/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-common-botmaster-actions-flights`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require(`@ibm-aca/aca-wrapper-ramda`);

const Flights = (configuration) => ({
  replace: 'all',
  series: true,
  evaluate: 'step',
  controller: async (params) => {
    logger.info(Flights.name, { configuration });
    // const REQUEST = {
    //   method: 'POST',
    //   uri: configuration.gatewayClient.url + '/api/v1/flights',
    //   json: true,
    //   timeout: 60000,
    //   body: ramda.mergeAll([
    //     configuration.flights,
    //     {
    //       dateFrom: update?.session?.context?.dateFrom,
    //       dateTo: update?.session?.context?.dateTo,
    //       airportFrom: update?.session?.context?.airportFrom,
    //       airportTo: update?.session?.context?.airportTo,
    //     },
    //     attributes,
    //   ]),
    // };

    // bot.reply(update, ramda.join('', [before, ramda.path(['message'])(result), after]));

    // update.session.context['dateFrom'] = undefined;
    // update.session.context['dateTo'] = undefined;
    // update.session.context['airportFrom'] = undefined;
    // update.session.context['airportTo'] = undefined;
  },
});

module.exports = {
  Flights,
};
