/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-wrapper-http-exec-http-put-request';

const got = require('got');
const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { validateParams, appendQueryParamsToUrl } = require('./utils');

const execHttpPutRequest = async (context, params) => {
  const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
  const CONTEXT_USER_ID = context?.user?.id;
  try {
    validateParams(params);
    const PARSED_URL = appendQueryParamsToUrl(params);

    const OPTIONS = {
      url: PARSED_URL,
      headers: params?.headers,
      method: 'PUT',
      body: params?.body,
      json: true,
      throwHttpErrors: true,
      responseType: 'json',
      retry: params?.options?.retry,
      timeout: params?.options?.timeout,
    };
    const RESPONSE = await got(OPTIONS);
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
    logger.error(`${execHttpPutRequest.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  execHttpPutRequest,
}
