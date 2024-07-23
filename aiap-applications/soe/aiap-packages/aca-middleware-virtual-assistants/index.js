/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-middleware-virtual-assistants-incoming-ware`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const striptags = require('striptags');

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

class VirtualAssistantsIncomingWare extends AbstractMiddleware {

  constructor(config) {
    super(
      [
        botStates.NEW,
        botStates.UPDATE
      ],
      'virtual-assistants-incoming-ware',
      middlewareTypes.INCOMING
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

  async executor(bot, update) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);

    try {
      const senderId = UPDATE_SENDER_ID;
      const prefix =
        this.config.amazonAlexa.prefix || this.config.googleAssistant.prefix;

      if (
        senderId.includes(prefix)
      ) {
        let processing = update.response.text.replace(
          /(?:<pause.+?>)/g,
          '%BREAK%'
        );
        update.response = update.response || {};
        update.response.text = striptags(processing, ['getcustomername']);
      }

      return;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID });
      logger.error('executor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

module.exports = {
  VirtualAssistantsIncomingWare,
};
