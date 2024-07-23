/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-common-actions-google-action';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { execHttpGetRequest } = require('@ibm-aca/aca-wrapper-http');



const getPhotoUrl = (item, key) => {
  const photos = ramda.pathOr([], ['photos'], item);
  if (photos.length > 0) {
    const reference = ramda.pathOr(null, ['photo_reference'], ramda.head(photos));
    if (reference) {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${reference}&key=${key}`;
    }
  }
  return null;
};

const googlePlaces = (configuration) => ({
  replace: 'all',
  series: true,
  evaluate: 'step',
  controller: async ({ before, after, bot, update, attributes }) => {

    let place;
    let location;
    let coordinates;

    let context;
    let params;

    let response;
    try {
      place = attributes?.place;
      location = attributes?.location;
      coordinates = attributes?.coordinates;

      let query = `${place}`;

      if (
        location
      ) {
        query = `${query} in ${location}`;
      }
      if (
        coordinates
      ) {
        query = `${query}&location=${coordinates.split(' ').join('')}`;
      }

      query = query.split(' ').join('+');

      context = {};
      params = {
        url: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${configuration.key}`,
      }

      response = await execHttpGetRequest(context, params);


      let results = [];

      const items = ramda.slice(0, 3, response?.body?.results || []);

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        results.push({
          name: item['name'],
          photoUrl: getPhotoUrl(item, configuration.key),
          address: item['formatted_address'],
          location: item['geometry']['location'],
        });
      }

      let elements = '';
      for (let i = 0; i < results.length; i++) {
        elements = `${elements}<element title="${results[i]['name']}" subtitle="${results[i]['address']
          }" image_url="${results[i]['photoUrl']
          }"><button title="Driving Directions" type="postback" payload="Get Driving Directions to ${results[i]['address']
          }"/></element>`;
      }

      if (
        ramda.isEmpty(elements)
      ) {
        logger.error('[ERROR] google places elements array is empty');
        bot.reply(update, 'Error Occurred. Something is wrong with the conversation.');
      } else {
        bot.reply(update, ramda.join('', [before, `<carousel>${elements}</carousel>`, after]));
      }

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(MODULE_ID, { ACA_ERROR });
      bot.reply(update, 'Error Occurred. Something is wrong with the conversation.');
    }
  },
});

module.exports = {
  googlePlaces,
};
