/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-common-actions-get-location`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { copyMessageErrors } = require('@ibm-aiap/aiap-utils-soe-messages');

module.exports = {
  replace: 'all',
  series: true,
  evaluate: 'step',
  controller: (params) => {
    try {
      const { bot, update, before, message } = params;
      const OUTGOING_MESSAGE = bot.createOutgoingMessageFor(update.sender.id);

      copyMessageErrors(message, OUTGOING_MESSAGE);

      const SENDER_ACTION = {
        type: 'location',
        data: {
          conversationId: update.traceId?.conversationId,
          utteranceId: update.traceId?.utteranceId,
          messageId: update.traceId.messageId,
        },
      };

      OUTGOING_MESSAGE.addSenderAction(SENDER_ACTION);

      OUTGOING_MESSAGE.message = message.message;
      OUTGOING_MESSAGE.addText(before);

      bot.sendMessage(OUTGOING_MESSAGE, update);

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('->', { ACA_ERROR });
      throw ACA_ERROR;
    }
  },
};
