/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-common-actions-structured-actions`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  formatIntoAcaError,
} = require('@ibm-aca/aca-utils-errors');

const {
  copyMessageErrors,
} = require('@ibm-aiap/aiap-utils-soe-messages');


const processor = require('./processor');
const messageUtils = require('./message-utils');

const StructuredAction = actionName => (settings = {}, dataProvider) => ({
  replace: 'before',
  series: true,
  evaluate: 'step',
  controller: async (params) => {
    try {
      const { bot, attributes, update, tree, before, message } = params;
      if ('ACA_CANCEL_OUTGOING_THREAD' === before) {
        return 'ACA_CANCEL_OUTGOING_THREAD';
      }
      const ATTACHMENTS = [];
      if (tree.length > 0) {
        tree.forEach(value => {
          if (value.tag === actionName) {
            const processedAttachments = processor.processContent(value, settings);
            if (Array.isArray(processedAttachments)) {
              ATTACHMENTS.push(...processedAttachments);
            } else {
              ATTACHMENTS.push(processedAttachments);
            }
          }
        });
      } else {
        if (dataProvider) {
          const dataFromDataProvider = await dataProvider.getData(attributes);
          ATTACHMENTS.push(...dataFromDataProvider);
        }
      }

      const OUTGOING_MESSAGE = bot.createOutgoingMessageFor(update.sender.id);
      copyMessageErrors(message, OUTGOING_MESSAGE);

      if (
        !lodash.isEmpty(before)
      ) {
        OUTGOING_MESSAGE.addText(before);
      }


      const ATTACHMENT = messageUtils(actionName, attributes, ATTACHMENTS);
      OUTGOING_MESSAGE.addAttachment(ATTACHMENT);
      await bot.sendMessage(OUTGOING_MESSAGE);
      return 'ACA_CANCEL_OUTGOING_THREAD';
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('->', { ACA_ERROR });
      throw ACA_ERROR;
    }
  },
});

module.exports = {
  carousel: StructuredAction('carousel'),
  image: StructuredAction('image'),
  link: StructuredAction('link'),
  audio: StructuredAction('audio'),
  video: StructuredAction('video'),
  file: StructuredAction('file'),
  widget: StructuredAction('widget'),
  card: StructuredAction('card'),
  list: StructuredAction('list'),
  quickReply: StructuredAction('quickReply'),
};
