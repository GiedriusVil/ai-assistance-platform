/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-middleware-reconnection-check-ware`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  formatIntoAcaError,
  appendDataToError,
} = require('@ibm-aca/aca-utils-errors');

const {
  shouldSkipBySenderActionTypes,
} = require('@ibm-aca/aca-utils-soe-middleware');

const {
  AbstractMiddleware,
  botStates,
  middlewareTypes,
} = require('@ibm-aiap/aiap-soe-brain');

const { getUpdateSenderId } = require('@ibm-aiap/aiap-utils-soe-update');

const { getLibConfiguration } = require('../configuration');

class ReconnectionCheckWare extends AbstractMiddleware {
  constructor() {
    super(
      [
        botStates.NEW,
        botStates.UPDATE
      ],
      'reconnection-check-ware',
      middlewareTypes.INCOMING
    );
  }

  __shouldSkip(context) {
    const PARAMS = {
      update: context?.update,
      skipSenderActionTypes: [],
    };

    const IGNORE_BY_SENDER_ACTION_TYPE = shouldSkipBySenderActionTypes(PARAMS);

    if (IGNORE_BY_SENDER_ACTION_TYPE) {
      return true;
    }

    return false;
  }

  async executor(bot, update) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);

    let configuration;

    let retVal;
    try {

      configuration = getLibConfiguration();
      if (
        lodash.isEmpty(configuration)
      ) {
        configuration = {
          notification: true
        }
      }

      if (
        update.session.hasOwnProperty('dialogId') &&
        update.session.hasOwnProperty('greeting') &&
        update.status === 'NEW'
      ) {
        const outgoingMessage = bot.createOutgoingMessageFor(update.sender.id);

        if (
          update.session.hasOwnProperty('pendingReply')
        ) {
          outgoingMessage.addText(
            update.session.greeting + ' ' + update.session.pendingReply
          );
          delete update.session.pendingReply;
        } else {
          outgoingMessage.addText(update.session.greeting);
        }
        delete update.session.greeting;
        bot.sendMessage(outgoingMessage);
        retVal = 'skip';
      }

      if (
        update.reconnected &&
        update.lastMessage.source === 'agent'
      ) {
        if (
          !configuration?.notification
        ) {
          retVal = 'skip';
        }
        if (
          logger.isDebug()
        ) {
          logger.debug('sending reconnection message', { update });
        }

        let text = 'Sorry for the disconnection, what was your answer to my question above?';
        if (
          lodash.isEmpty(configuration?.message)
        ) {
          text = configuration?.message;
        }

        const outgoingMessage = bot.createOutgoingMessageFor(update.sender.id);
        outgoingMessage.addText(text);

        bot.sendMessage(outgoingMessage, { ignoreMiddleware: true });
      }
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID });
      logger.error(this.executor.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

module.exports = {
  ReconnectionCheckWare,
};
