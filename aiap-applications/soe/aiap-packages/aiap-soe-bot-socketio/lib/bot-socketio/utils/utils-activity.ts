/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-bot-socketio-utils-activity';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

import * as chatEvents from '../socketio/events/chat-events';

import {
  appendDataToError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

const ACTIVITY_LAST_TIMESTAMP = 'activity';
const ACTIVITY_CLOSING_STATE_TIMESTAMP = 'close';
const ACTIVITY_IS_CLOSED = 'closed';

const CLOSE_TIMEOUT_FUNCTION = 'close';
const MESSAGE_INTERVAL_FUNCTION = 'message';
const CLOSING_STATE_TIMEOUT_FUNCTION = 'closingState';

class UtilsActivity {

  adapter: any;
  clientActivityTimers: any;

  constructor(adapter) {
    this.adapter = adapter;
    this.clientActivityTimers = {};
  }

  async getClientActivity(
    clientId: any,
  ) {
    try {
      const result = await this.adapter.sessionStorage.getData(`activity:${clientId}`);
      return result;
    } catch (e) {
      logger.warn(`Could not find activity for client: ${clientId}`);
      return {};
    }
  }

  saveClientActivity(clientId, clientActivity) {
    this.adapter.sessionStorage
      .setData(`activity:${clientId}`, clientActivity, this.adapter.settings.session.expiration)
      .then()
      .catch(e => logger.warn(`Could not save client activity for client: ${clientId}`, e));
  }

  removeClientActivityTimers(clientId) {
    this.clearActivityTimers(clientId);
    this.clearClosingStateTimer(clientId);
    this.clientActivityTimers = ramda.dissoc(clientId, this.clientActivityTimers);
  }

  updateClientActivity(clientId, clientActivity) {
    const dateNow = new Date().valueOf();
    clientActivity[ACTIVITY_LAST_TIMESTAMP] = dateNow;
    this.updateClientActivityTimers(clientId, clientActivity);
    this.saveClientActivity(clientId, clientActivity);
  }

  updateClientActivityTimers(clientId, clientActivity) {
    this.clearActivityTimers(clientId);
    this.setActivityTimers(clientId, clientActivity);
  }

  updateClosingStateTimers(clientId, clientActivity) {
    this.clearActivityTimers(clientId);
    this.clearClosingStateTimer(clientId);
    this.setClosingStateTimer(clientId, clientActivity);
  }

  setClosingState(clientId, clientActivity) {
    this.adapter.utilsTyping.removeFromTypingStatus(clientId);
    this.clearActivityTimers(clientId);

    clientActivity[ACTIVITY_CLOSING_STATE_TIMESTAMP] = new Date().valueOf();
    this.setClosingStateTimer(clientId, clientActivity);
    this.saveClientActivity(clientId, clientActivity);
  }

  async setChatClosed(clientId) {
    const clientActivity = await this.getClientActivity(clientId);
    if (clientActivity) {
      clientActivity[ACTIVITY_IS_CLOSED] = true;
      this.saveClientActivity(clientId, clientActivity);
    }
  }

  isChatInClosingState(clientActivity) {
    return clientActivity[ACTIVITY_IS_CLOSED] || clientActivity[ACTIVITY_CLOSING_STATE_TIMESTAMP] != null;
  }

  isChatClosed(clientActivity) {
    if (clientActivity[ACTIVITY_IS_CLOSED]) return true;
    if (clientActivity[ACTIVITY_CLOSING_STATE_TIMESTAMP] == null) return false;

    //Check if (<time adapter set closing state> + <closing state duration> < <current time>) chat is closed according by time (in case chat closed in another instance or while disconnected)
    const predictedCloseTimestamp =
      clientActivity[ACTIVITY_CLOSING_STATE_TIMESTAMP] + this.adapter.settings.activity.close.closingStateTime;
    const currentTimestamp = new Date().valueOf();

    return ramda.lte(predictedCloseTimestamp, currentTimestamp);
  }

  clearActivityTimers(clientId) {
    let closeTimeout;
    try {
      closeTimeout = ramda.path([clientId, CLOSE_TIMEOUT_FUNCTION], this.clientActivityTimers);
      if (closeTimeout != null) {
        clearTimeout(closeTimeout);
      }
      this.clearActivityMessageInterval(clientId);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { clientId });
      logger.error(this.clearActivityTimers.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  clearActivityMessageInterval(clientId) {
    let messageInterval;
    try {
      messageInterval = ramda.path([clientId, MESSAGE_INTERVAL_FUNCTION], this.clientActivityTimers);
      if (messageInterval != null) {
        clearInterval(messageInterval);
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { clientId });
      logger.error(this.clearActivityMessageInterval.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  setActivityTimers(
    clientId,
    clientActivity,
  ) {
    const currentTimestamp = new Date().valueOf();

    this.clientActivityTimers[clientId] = {};
    if (
      this.adapter?.settings?.activity?.close

    ) {
      const inactivityTime =
        this.adapter.settings.activity.close.inactivityTime -
        (clientActivity.activity ? currentTimestamp - clientActivity.activity : 0);

      const inactivityFunction = setTimeout(() => {
        try {
          const updateObject = {
            sender: {
              id: clientId,
            },
          };
          this.adapter.__closeConversation(updateObject, 'inactivity');
        } catch (error) {
          const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
          appendDataToError(ACA_ERROR, { clientId });
          logger.error('closeTimeoutFunction', { ACA_ERROR });
          throw ACA_ERROR;
        }
      }, Math.max(inactivityTime));

      this.clientActivityTimers[clientId][CLOSE_TIMEOUT_FUNCTION] = inactivityFunction;
    }

    /**
     * Can do improvement here -  check how much time passed from last message
     */
    if (
      this.adapter?.settings?.activity?.message
    ) {
      const inactivityFunction = setInterval(() => {
        try {
          const clientSocket = this.adapter.getClientSocket(clientId);
          if (
            lodash.isEmpty(clientSocket)
          ) {
            logger.debug(`Failed to get clientSocket while sending inactivity message`);
            this.clearActivityMessageInterval(clientId);
            return;
          }
          chatEvents.inactivity.send(clientSocket, this.adapter.settings.activity.message.message);
        } catch (error) {
          const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
          appendDataToError(ACA_ERROR, { clientId });
          logger.error('messageIntervalFunction', { ACA_ERROR });
          throw ACA_ERROR;
        }
      }, this.adapter.settings.activity.message.inactivityTime);

      this.clientActivityTimers[clientId][MESSAGE_INTERVAL_FUNCTION] = inactivityFunction;
    }
  }

  clearClosingStateTimer(clientId) {
    let closingStateTimeout;
    try {
      closingStateTimeout = ramda.path([clientId, CLOSING_STATE_TIMEOUT_FUNCTION], this.clientActivityTimers);
      if (
        closingStateTimeout != null
      ) {
        clearTimeout(closingStateTimeout);
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { clientId });
      logger.error(this.clearClosingStateTimer.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  setClosingStateTimer(clientId, clientActivity) {
    const currentTimestamp = new Date().valueOf();
    //Calculate close time based on current time
    const closeTime =
      this.adapter.settings.activity.close.closingStateTime -
      (clientActivity[ACTIVITY_CLOSING_STATE_TIMESTAMP]
        ? currentTimestamp - clientActivity[ACTIVITY_CLOSING_STATE_TIMESTAMP]
        : 0);

    //Set close timeout
    const closeFunction = setTimeout(() => {
      try {
        this.setChatClosed(clientId);
        const clientSocket = this.adapter.getClientSocket(clientId);
        if (clientSocket != null) clientSocket.disconnect();
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { clientId });
        logger.error('closingStateTimeoutFunction', { ACA_ERROR });
        throw ACA_ERROR;
      }
    }, Math.max(closeTime, 0));

    //Remove all other intervals/timeouts
    this.clientActivityTimers[clientId] = {
      [CLOSING_STATE_TIMEOUT_FUNCTION]: closeFunction,
    };
  }
}

export {
  UtilsActivity,
}
