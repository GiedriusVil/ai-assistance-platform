/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-common-actions-feedback';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { copyMessageErrors } = require('@ibm-aiap/aiap-utils-soe-messages');

const { getUpdateSenderId } = require('@ibm-aiap/aiap-utils-soe-update');

module.exports = () => ({
  replace: 'all',
  series: true,
  evaluate: 'step',
  controller: async ({ bot, update, before, after, message }) => {
    let outgoingMessage;
    let conversationId;
    let utteranceId;
    let messageId;

    let updateSenderId;

    let senderAction;
    let attachment;
    try {
      if ('ACA_CANCEL_OUTGOING_THREAD' === before) {
        return 'ACA_CANCEL_OUTGOING_THREAD';
      }
      conversationId = update?.traceId?.conversationId;
      utteranceId = update?.traceId?.utteranceId;
      messageId = update?.traceId?.messageId;

      updateSenderId = getUpdateSenderId(update);

      if (
        lodash.isEmpty(conversationId)
      ) {
        const ERROR_MESSAGE = `Missing required update?.traceId?.conversationId parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      if (
        lodash.isEmpty(utteranceId)
      ) {
        const ERROR_MESSAGE = `Missing required update?.traceId?.utteranceId parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      if (
        lodash.isEmpty(messageId)
      ) {
        const ERROR_MESSAGE = `Missing required update?.traceId?.messageId parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      senderAction = {
        type: 'feedback',
        data: {
          conversationId, utteranceId, messageId,
        },
      };

      attachment = message?.message?.attachment;
      outgoingMessage = bot.createOutgoingMessageFor(updateSenderId);
      outgoingMessage.addSenderAction(senderAction);
      outgoingMessage.addText(before);
      if (
        !lodash.isEmpty(attachment)
      ) {
        outgoingMessage.addAttachment(attachment);
      }
      copyMessageErrors(message, outgoingMessage);
      await bot.sendMessage(outgoingMessage, update);
      if (
        !lodash.isEmpty(after)
      ) {
        bot.reply(update, after);
        return 'ACA_CANCEL_OUTGOING_THREAD';
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('aca-common-actions-feedback:controller', { ACA_ERROR });
      throw ACA_ERROR;
    }
  },
});
