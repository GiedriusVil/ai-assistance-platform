/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-common-botmaster-actions-flights`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require(`@ibm-aca/aca-wrapper-ramda`);


const Weather = (configuration) => ({
  replace: 'before',
  series: true,
  evaluate: 'step',
  controller: async (params) => {
    logger.info(Weather.name, { configuration });
    // const REQUEST = {
    //   method: 'POST',
    //   uri: configuration.gatewayClient.url + '/api/v1/weather',
    //   json: true,
    //   timeout: 60000,
    //   body: R.mergeAll([
    //     configuration.weather,
    //     {
    //       location: update?.session?.context?.location,
    //       dateFrom: update?.session?.context?.dateFrom,
    //       dateTo: update?.session?.context?.dateTo,
    //     },
    //     attributes,
    //   ]),
    // };

    // await bot.reply(update, ramda.join('', [before, ramda.path(['message'])(result)]));

    // update.session.context['location'] = undefined;
    // update.session.context['dateFrom'] = undefined;
    // update.session.context['dateTo'] = undefined;
  },
});

module.exports = {
  Weather,
};
