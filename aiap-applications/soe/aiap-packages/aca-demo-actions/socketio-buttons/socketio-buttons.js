/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const R = require('ramda');
const logger = require('@ibm-aca/aca-common-logger')('socketio-buttons-action');
const transformer = require('./transformer');

const ButtonsAction = () => ({
  replace: 'before',
  series: true,
  evaluate: 'step',
  controller: function({ bot, tree, update, before }) {
    const buttons = [];
    const quickReplies = [];
    tree.forEach(value => {
      if (value.tag == 'buttons') {
        value.content.forEach(contentItem => {
          if (typeof contentItem == 'string' || contentItem instanceof String) {
            contentItem.split('|').forEach(quickReply => {
              if (quickReply.trim()) quickReplies.push(quickReply.trim(' '));
            });
          } else if (typeof contentItem == 'object') {
            if (Array.isArray(contentItem.content)) {
              buttons.push(R.mergeRight({ payload: contentItem.content[0] }, contentItem.attrs));
            } else {
              buttons.push(R.mergeRight({ payload: '' }, contentItem.attrs));
            }
          }
        });
      }
    });

    if (quickReplies.length > 0 && buttons.length > 0) {
      logger.warn(`Buttons tag content malformed. Will skip buttons creation`);
      return '';
    }

    const outgoingMessage = bot.createOutgoingMessageFor(update.sender.id);

    if (buttons.length > 0) {
      const formattedButtons = transformer.transformButtons(buttons, before);
      if (formattedButtons.attachment && formattedButtons.quick_replies) {
        logger.warn(`Buttons tag content malformed. Both buttons and quick_replies exist. Will skip buttons creation`);
        return '';
      }
      if (formattedButtons.attachment) {
        outgoingMessage.addAttachment(formattedButtons.attachment);
        bot.sendMessage(outgoingMessage);
        return '';
      }
      if (formattedButtons.quick_replies) {
        processQuickReplyMessage(formattedButtons.quick_replies, before, outgoingMessage, bot);
        return '';
      }
    }

    if (quickReplies.length > 0) {
      const formattedQuickReplies = transformer.transformQuickReplies(quickReplies);
      if (formattedQuickReplies.length > 0) {
        processQuickReplyMessage(formattedQuickReplies, before, outgoingMessage, bot);
        return '';
      }
    }
    return '';
  },
});

const processQuickReplyMessage = (quickReplies, before, outgoingMessage, bot) => {
  if (before.trim()) outgoingMessage.addText(before);
  outgoingMessage.addQuickReplies(quickReplies);
  bot.sendMessage(outgoingMessage);
};

module.exports = ButtonsAction;
