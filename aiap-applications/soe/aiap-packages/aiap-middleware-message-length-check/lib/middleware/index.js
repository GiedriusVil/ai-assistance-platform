/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-middleware-message-length-check-ware`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { AbstractMiddleware, botStates, middlewareTypes } = require('@ibm-aiap/aiap-soe-brain');

const {
  getUpdateSenderId,
} = require('@ibm-aiap/aiap-utils-soe-update');

const { getLibConfiguration } = require('../configuration');

class MessageLengthCheckWare extends AbstractMiddleware {

  constructor() {
    super(
      [
        botStates.NEW,
        botStates.UPDATE,
      ],
      'message-length-check-ware',
      middlewareTypes.INCOMING
    );
  }

  async executor(bot, update) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);

    let configuration;

    try {
      configuration = getLibConfiguration();
      if (
        update.message.text.length > configuration?.msgLengthChecker?.maxLength
      ) {
        if (
          logger.isDebug()
        ) {
          logger.debug(`Message is too long. Initiating fail: `, { update });
        }
        update.response = update.response || {};
        update.response.text = `<fail id ="${configuration?.msgLengthChecker?.id}" max = ${configuration?.msgLengthChecker?.maxRetryCount
          } message = "${configuration?.msgLengthChecker?.message}" handover = "${update.message.text}" skill="${configuration?.msgLengthChecker?.skill
          }" />${configuration?.msgLengthChecker?.retryMessage}`;

        const outgoingMessage = bot.createOutgoingMessageFor(UPDATE_SENDER_ID);
        outgoingMessage.addText(update?.response?.text);
        ramda.omit(['response'], update);
        bot.sendMessage(outgoingMessage);
      } else {
        return;
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID });
      logger.error(this.executor.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

module.exports = {
  MessageLengthCheckWare,
};
