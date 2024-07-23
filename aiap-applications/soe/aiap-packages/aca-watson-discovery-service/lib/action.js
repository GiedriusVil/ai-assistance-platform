/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const logger = require('@ibm-aca/aca-common-logger')('watson-discovery-service-action');
const { transform } = require('./transform');
const WDService = require('./WDService');

const wds = (config, wdsService) => ({
  replace: 'before',
  series: true,
  evaluate: 'step',
  controller: ({ update, bot, attributes, before, content }) => {
    const limit = attributes.limit;
    const serviceId = attributes.id;
    const environment = attributes.environment;
    const collection = attributes.collection;

    const outgoingMessage = bot.createOutgoingMessageFor(update.sender.id);
    wdsService
      .query(content, serviceId, environment, collection, limit)
      .then(wdsResult => {
        if (before) outgoingMessage.addText(before);
        outgoingMessage.addAttachment({
          type: 'wds',
          payload: transform(wdsResult.result.results),
        });
        bot.sendMessage(outgoingMessage);
      })
      .catch(err => {
        logger.warn('Error getting response from Watson Discovery Service', err);
        outgoingMessage.addText(config.unavailableMessage);
        bot.sendMessage(outgoingMessage);
      });
  },
});

module.exports = config => wds(config, WDService(config));
