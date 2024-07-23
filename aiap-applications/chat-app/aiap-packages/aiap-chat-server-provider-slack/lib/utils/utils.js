/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-slack-utils-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const retrieveSlackSessionExpirationTime = (config) => {
  const DEFAULT_SESSION_EXPIRATION_TIME_IN_SECONDS = 600;
  const SESSION_EXPIRATION_TIME_IN_SECONDS = ramda.path(['external', 'sessionExpirationTimeInSeconds'], config);
  const PARSED_SESSION_EXPIRATION_TIME_IN_SECONDS = Number.parseInt(SESSION_EXPIRATION_TIME_IN_SECONDS);
  if (!lodash.isNumber(SESSION_EXPIRATION_TIME_IN_SECONDS) || lodash.isNaN(PARSED_SESSION_EXPIRATION_TIME_IN_SECONDS)) {
    return DEFAULT_SESSION_EXPIRATION_TIME_IN_SECONDS;
  }
  const FLOORED_TIME = Math.floor(PARSED_SESSION_EXPIRATION_TIME_IN_SECONDS);
  return FLOORED_TIME;
}
module.exports = {
  retrieveSlackSessionExpirationTime
}
