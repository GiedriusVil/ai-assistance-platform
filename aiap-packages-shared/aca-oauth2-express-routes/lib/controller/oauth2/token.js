/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-oauth2-express-routes-controller-oauth2-token';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { oauth2Service } = require('@ibm-aca/aca-oauth2-service');

const _retrieveApiKeyFromRequestHeaders = (request) => {
  let retVal;
  let headers;
  try {
    headers = request.headers;
    retVal = headers['x-aiap-api-key'];
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_retrieveApiKeyFromRequestHeaders.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _retrieveTokenRefreshFromRequestHeaders = (request) => {
  let retVal;
  let headers;
  try {
    headers = request.headers;
    retVal = headers['x-aiap-token-refresh'];
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_retrieveTokenRefreshFromRequestHeaders.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const token = async (request, response) => {
  const ERRORS = [];

  let apiKey;
  let tokenRefresh;

  let retVal;
  try {
    const CONTEXT = {};
    const PARAMS = {};

    apiKey = _retrieveApiKeyFromRequestHeaders(request);
    tokenRefresh = _retrieveTokenRefreshFromRequestHeaders(request);
    if (
      !lodash.isEmpty(apiKey)
    ) {
      PARAMS.apiKey = apiKey;
    }
    if (
      !lodash.isEmpty(tokenRefresh)
    ) {
      PARAMS.tokenRefresh = tokenRefresh;
    }
    PARAMS.tenant = {
      external: {
        id: request?.body?.tenantExternalId,
      },
    };

    retVal = await oauth2Service.token(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(retVal);
  } else {
    logger.error(token.name, { ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
}

module.exports = {
  token,
}
