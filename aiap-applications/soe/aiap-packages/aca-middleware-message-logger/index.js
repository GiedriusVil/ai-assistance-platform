/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-middleware-message-logger-ware`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

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

const lodash = require('@ibm-aca/aca-wrapper-lodash');

class MessageLoggerWare extends AbstractMiddleware {
  constructor() {
    super(
      [botStates.NEW, botStates.UPDATE],
      'message-logger-ware',
      middlewareTypes.OUTGOING
    );
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

  async executor(bot, update, message) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);
    try {
      //
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID });
      logger.error('executor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

module.exports = {
  MessageLoggerWare,
};
