/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-watsonx-provider-watsonx-v1-utils-get-iam-token';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import querystring from 'node:querystring';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  execHttpPostRequest,
} from '@ibm-aca/aca-wrapper-http';

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import { IWatsonxV1 } from '../types';

import { setWatsonxIamToken, getWatsonxIamToken } from './memory-store.utils';

const isTokenExpired = (result) => {
  const TOKEN_EXPIRATION_TIMESTAMP = result?.expiration;
  const CURRENT_TIMESTAMP_IN_SECONDS = Date.now() / 1000;
  const RET_VAL = TOKEN_EXPIRATION_TIMESTAMP < CURRENT_TIMESTAMP_IN_SECONDS;
  return RET_VAL;
}

const getIAMToken = async (
  watsonx: IWatsonxV1
) => {
  let response;
  let result;
  try {
    const GET_TOKEN_PARAMS = {
      external: watsonx.config,
    }
    result = await getWatsonxIamToken(GET_TOKEN_PARAMS);

    if (lodash.isEmpty(result) || isTokenExpired(result)) {

      if (lodash.isEmpty(watsonx.iamTokenUrl)) {
        const MESSAGE = 'Missing required iamTokenUrl parameter!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }

      const opts = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        url: watsonx.iamTokenUrl,
        options: {
          timeout: 5000,
        },
        body: querystring.stringify({
          'grant_type': 'urn:ibm:params:oauth:grant-type:apikey',
          apikey: watsonx.apiKey,
        }),
      };
      const additionalOptions = {
        json: false,
      };
      response = await execHttpPostRequest({}, opts, additionalOptions);
      result = JSON.parse(response?.body);

      const SET_TOKEN_PARAMS = {
        iamTokenResponse: result,
        external: watsonx.config,
      };
      setWatsonxIamToken(SET_TOKEN_PARAMS);
    }

    const RET_VAL = result?.access_token;    
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { response });
    logger.error(getIAMToken.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  getIAMToken,
}
