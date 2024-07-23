/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const DeepLink = transformer => ({
  replace: 'all',
  series: true,
  evaluate: 'step',
  controller: ({ update, bot, attributes, before, after }) => {
    const customersSkipRegexp = /twilio|facebook/;
    const skip = update => ramda.test(customersSkipRegexp, ramda.view(ramda.lensProp('customerId'), update));
    const transformWith = transformer => transformer && typeof transformer === 'function';

    const title = attributes.title;
    const link = attributes.link;
    const outgoingMessage = bot.createOutgoingMessageFor(update.sender.id);

    if (transformWith(transformer) && !skip(update)) {
      outgoingMessage.addText(`${before}${transformer(attributes)}${after}`);
    } else if (skip(update)) {
      outgoingMessage.addText(`${before}${title} (${link})${after}`);
    } else {
      outgoingMessage.addText(`${before}<a href="${link}">${title}</a>${after}`);
    }

    outgoingMessage.addAttachment({
      type: 'link',
      payload: {
        url: link,
        is_reusable: true,
      },
    });

    bot.sendMessage(outgoingMessage);
  },
});

module.exports = {
  DeepLink,
};
