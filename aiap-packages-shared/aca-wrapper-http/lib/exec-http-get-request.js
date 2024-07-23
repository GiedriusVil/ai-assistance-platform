/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-wrapper-http-exec-http-get-request';

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const got = require('got');
const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { validateParams, appendQueryParamsToUrl } = require('./utils');

const execHttpGetRequest = async (context, params, additionalOptions = {}) => {

  const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

  const CONTEXT_USER_ID = context?.user?.id;
  try {
    validateParams(params);
    const PARSED_URL = appendQueryParamsToUrl(params);
    const INCOMING_OPTIONS = ramda.path(['incomingOptions'], params);

    let options = {
      url: PARSED_URL,
      headers: params?.headers,
      method: 'GET',
      json: lodash.isBoolean(params?.json) ? params?.json : true,
      throwHttpErrors: lodash.isBoolean(params?.throwHttpErrors) ? params?.throwHttpErrors : true,
      responseType: params?.responseType || 'json',
      retry: params?.options?.retry,
      timeout: params?.options?.timeout,
      hooks: params?.hooks,
      ...additionalOptions,
    };

    if (!lodash.isEmpty(INCOMING_OPTIONS)) {
      options = ramda.mergeRight(options, INCOMING_OPTIONS);
    }

    logger.info('OPTIONS: ', { options });
    const RESPONSE = await got(PARSED_URL, options);

    const RET_VAL = {
      body: RESPONSE.body,
      status: {
        code: RESPONSE.statusCode,
        message: RESPONSE.statusMessage,
      },
      headers: RESPONSE.headers
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params });
    logger.error(`${execHttpGetRequest.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  execHttpGetRequest,
}
