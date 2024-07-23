/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-common-actions-google-map`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { execHttpGetRequest } = require('@ibm-aca/aca-wrapper-http');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');


const googleMap = (configuration) => ({
  replace: 'all',
  series: true,
  evaluate: 'step',
  controller: async ({ before, after, bot, update, attributes, message }) => {
    let context;
    let params;

    let locationFrom;
    let locationTo;

    let response;

    try {
      locationFrom = attributes?.from;
      locationTo = attributes?.to;
      context = {};
      params = {
        url: 'https://maps.googleapis.com/maps/api/directions/json',
        queryParams: {
          origin: locationFrom,
          destination: locationTo,
          mode: 'driving',
          key: configuration.key,
        },
      };

      response = await execHttpGetRequest(context, params);

      const POLYLINES = ramda.path(['routes', 0, 'overview_polyline', 'points'], response?.body);
      const POLYLINES_ENCODED = encodeURI(POLYLINES);
      const STATIC_URL = `https://maps.googleapis.com/maps/api/staticmap?size=400x400&path=enc%3A${POLYLINES_ENCODED}&key=${configuration.key}`;

      const BOT_REPLY = ramda.join('', [before, `<image message="Google Static Map" url=${STATIC_URL} />`, after])
      bot.reply(update, BOT_REPLY);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(googleMap.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  },
});

module.exports = {
  googleMap,
};
