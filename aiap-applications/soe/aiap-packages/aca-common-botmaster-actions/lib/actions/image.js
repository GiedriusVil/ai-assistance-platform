/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/*
  Action tag:
  <image message="" url="" />
*/

const Image = transformer => ({
  replace: 'all',
  series: true,
  evaluate: 'step',
  controller: ({ update, bot, attributes, before, after }) => {
    const transformWith = transformer => transformer && typeof transformer === 'function';
    const message = attributes.message;
    const url = attributes.url;
    const outgoingMessage = bot.createOutgoingMessageFor(update.sender.id);

    if (before) {
      bot.reply(update, before);
    }

    outgoingMessage.addText(
      transformWith(transformer) ? transformer(attributes) : `${before}${message} ${url}${after}`
    );
    outgoingMessage.addAttachment({
      type: 'image',
      payload: {
        url,
        is_reusable: true,
      },
    });

    bot.sendMessage(outgoingMessage);

    if (after) {
      bot.reply(update, after);
    }
  },
});

module.exports = {
  Image
};
