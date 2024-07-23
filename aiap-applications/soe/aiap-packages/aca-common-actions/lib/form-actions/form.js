/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-common-actions-form-actions-form`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { copyMessageErrors } = require('@ibm-aiap/aiap-utils-soe-messages');

const form = () => ({
  replace: 'all',
  series: true,
  evaluate: 'step',
  controller: ({ update, bot, tree, before, message }) => {
    try {
      const OUTGOING_MESSAGE = bot.createOutgoingMessageFor(update.sender.id);
      copyMessageErrors(message, OUTGOING_MESSAGE);
      const ELEMENTS = [];
      for (let value of tree) {
        if (
          lodash.isString(value)
        ) {
          continue;
        }
        if (value.tag === 'form') {
          for (let element of value.content) {
            if (typeof element == 'string' || element instanceof String) {
              continue;
            }
            if (element.tag === 'input' && element.attrs.type) {
              let item = {};
              item.tag = element.tag;
              item.type = element.attrs.type;
              if (element.attrs.value !== undefined) {
                item.value = element.attrs.value;
              }
              if (element.attrs.name !== undefined) {
                item.name = element.attrs.name;
              }
              if (element.attrs.value !== undefined) {
                item.value = element.attrs.value;
              }
              if (element.attrs.title !== undefined) {
                item.title = element.attrs.title;
              }
              ELEMENTS.push(item);
            }
          }
          if (
            !lodash.isEmpty(before)
          ) {
            OUTGOING_MESSAGE.addText(before);
          }
          const ATTACHMENT = {
            type: 'form',
            attributes: value.attrs,
            elements: ELEMENTS,
          };
          OUTGOING_MESSAGE.addAttachment(ATTACHMENT);
          bot.sendMessage(OUTGOING_MESSAGE);
          break;
        }
      }


    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('->', { ACA_ERROR });
      throw ACA_ERROR;
    }
  },
});

module.exports = form;
