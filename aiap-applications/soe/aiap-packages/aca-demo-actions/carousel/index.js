/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const tagParsers = require('./tagParsers');

module.exports = {
  replace: 'before',
  series: true,
  evaluate: 'step',
  controller: async ({ update, bot, tree }) => {
    let carouselTree = [];
    if (tree.length > 0) {
      tree.forEach(value => {
        if (value.tag === 'carousel') carouselTree = value.content;
      });
    }
    let attachment = {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: tagParsers.collectFromContent(carouselTree, 'element', tagParsers.parseElementTag),
      },
    };
    const outgoingMessage = bot.createOutgoingMessageFor(update.sender.id);
    outgoingMessage.addAttachment(attachment);
    await bot.sendMessage(outgoingMessage);
  },
};
