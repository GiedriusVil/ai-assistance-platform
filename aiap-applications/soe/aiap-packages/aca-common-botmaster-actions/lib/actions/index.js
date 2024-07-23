/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

// const changeWA = require('./lib/change-wa');
const { SendEmailAction } = require('./send-email');
const { SuggestEntities } = require('./suggest-entities');
const { SuggestEntitiesNg } = require('./suggest-entities-ng');

const { wiki } = require('./wiki');

const { answer } = require('./answer');
const { carousel } = require('./carousel');
const { Close } = require('./close');
const { DeepLink } = require('./deepLink');

const { Flights } = require('./flights');
const { GetCustomerName } = require('./get-customer-name');

const { Image } = require('./image');

// const { Metric } = require('./metric');
const { PIIMasking } = require('./pii-masking');
const { RetryTag } = require('./retry-tag');
const { ValueReplace } = require('./value-replace');

const { Video } = require('./video');

const { Weather } = require('./weather');

module.exports = {
  // changeWA,
  SendEmailAction: SendEmailAction,
  SuggestEntities: SuggestEntities,
  SuggestEntitiesNg: SuggestEntitiesNg,
  wiki: wiki,
  answer: answer,
  carousel: carousel,
  close: Close,
  deeplink: DeepLink,
  flights: Flights,
  getCustomerName: GetCustomerName,
  image: Image,
  // metric: Metric,
  PIIMasking: PIIMasking,
  retryTag: RetryTag,
  valueReplace: ValueReplace,
  video: Video,
  weather: Weather,
};
