/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-middleware-session-outgoing-ware`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('ramda');

const {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
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

const { getMemoryStore } = require('@ibm-aiap/aiap-memory-store-provider');

const { getLibConfiguration } = require('../configuration');

class SessionOutgoingWare extends AbstractMiddleware {

  constructor(config) {
    super(
      [
        botStates.NEW,
        botStates.UPDATE
      ],
      'session-ware-out',
      middlewareTypes.OUTGOING
    );
    this.config = config;
  }

  __shouldSkip(context) {
    const PARAMS = {
      update: context?.update,
      skipSenderActionTypes: ['LOG_USER_ACTION'],
    };

    const IGNORE_BY_SENDER_ACTION_TYPE = shouldSkipBySenderActionTypes(PARAMS);

    if (IGNORE_BY_SENDER_ACTION_TYPE) {
      return true;
    }

    return false;
  }

  async executor(adapter, update) {
    const UPDATE_SENDER_ID = update?.sender?.id;

    let libConfiguration;
    let libConfigurationSessionExpiration;
    try {
      libConfiguration = getLibConfiguration();
      libConfigurationSessionExpiration = libConfiguration?.expiration;
      if (
        lodash.isEmpty(UPDATE_SENDER_ID)
      ) {
        const MESSAGE = 'Missing required update.sender.id attribute!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }

      const MEMORY_STORE = getMemoryStore();
      if (
        update.close
      ) {
        await MEMORY_STORE.deleteData(UPDATE_SENDER_ID);
      } else {
        if (
          !lodash.isNumber(libConfigurationSessionExpiration)
        ) {
          const ERROR_MESSAGE = 'Wrong type of required libConfiguration.expiration attribute!';
          throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
        }
        await MEMORY_STORE.setData(
          UPDATE_SENDER_ID,
          update.session,
          libConfigurationSessionExpiration,
        );
      }

      if (
        update.shouldCancel
      ) {
        return 'cancel';
      } else {
        return;
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, {
        UPDATE_SENDER_ID,
        libConfigurationSessionExpiration,
      });
      logger.error(this.executor.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

module.exports = {
  SessionOutgoingWare,
};
