/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-middleware-message-source-detection-ware`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
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

const SYSTEM_SOURCE = 'SYSTEM';

class MessageSourceDetectionWare extends AbstractMiddleware {
  constructor(config) {
    super(
      [botStates.NEW, botStates.UPDATE, botStates.INTERNAL_UPDATE],
      'message-source-detection-ware',
      middlewareTypes.INCOMING
    );
    this.config = config;
    this.config.messages = config.messages.map((m) => m.toUpperCase());
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
    try {
      if (
        this.config.messages.includes(update.raw.message.text.toUpperCase()) ||
        // TODO Let's try to classify empty user messages as not system -> Also sender action stuff might be an issue here!
        //(update.status === botStates.NEW && update.raw.message.text === '') ||
        update.status === botStates.INTERNAL_UPDATE
      ) {
        update.source = SYSTEM_SOURCE;
      }
      return;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID });
      logger.error('->', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

module.exports = {
  MessageSourceDetectionWare,
};
