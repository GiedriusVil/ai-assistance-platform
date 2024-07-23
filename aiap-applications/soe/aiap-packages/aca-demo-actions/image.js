/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
module.exports = {
  replace: 'before',
  series: true,
  evaluate: 'step',
  controller: function({ before, update, bot, attributes }) {
    const outgoingMessage = bot.createOutgoingMessageFor(update.sender.id);
    if (before) {
      outgoingMessage.addText(before);
    }
    outgoingMessage.addAttachment({
      type: 'image',
      payload: {
        url: attributes.url,
        is_reusable: true,
      },
    });
    bot.sendMessage(outgoingMessage);
    return '';
  },
};
