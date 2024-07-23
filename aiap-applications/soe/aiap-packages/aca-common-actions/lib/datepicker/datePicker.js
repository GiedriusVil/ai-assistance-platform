/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-common-actions-datepicker';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');
const lodash = require('lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { copyMessageErrors } = require('@ibm-aiap/aiap-utils-soe-messages');

module.exports = {
  replace: 'all',
  series: true,
  evaluate: 'step',
  controller: async ({ bot, update, attributes, before, after, message }) => {
    try {
      const OUTGOING_MESSAGE = bot.createOutgoingMessageFor(update.sender.id);
      copyMessageErrors(message, OUTGOING_MESSAGE);
      const MODAL_TITLE = ramda.path(['modalTitle'], attributes);
      const ATTACHMENT = {
        type: 'datePicker',
        attributes: [],
        attachments: [],
      };
      if (
        !lodash.isEmpty(MODAL_TITLE)
      ) {
        ATTACHMENT.attributes.push({
          key: 'modalTitle',
          value: MODAL_TITLE
        });
      }
      OUTGOING_MESSAGE.addAttachment(ATTACHMENT);
      if (
        !lodash.isEmpty(before)
      ) {
        OUTGOING_MESSAGE.addText(before);
      }
      await bot.sendMessage(OUTGOING_MESSAGE, update);
      if (
        !lodash.isEmpty(after)
      ) {
        bot.reply(update, after);
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('->', { ACA_ERROR });
      throw ACA_ERROR;
    }
  },
};
