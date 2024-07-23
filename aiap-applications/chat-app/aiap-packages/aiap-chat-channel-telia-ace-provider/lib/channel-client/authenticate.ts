/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-telia-ace-provider-channel-client-authenticate';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  execHttpPostRequest,
} from '@ibm-aca/aca-wrapper-http';

import {
  IChatChannelV1TeliaAceConfiguration,
} from '../types';

import { ChatChannelV1TeliaAce } from '../channel';

const authenticate = async (
  channel: ChatChannelV1TeliaAce,
  params: {
    configuration: IChatChannelV1TeliaAceConfiguration,
  }
) => {
  try {
    if (
      lodash.isEmpty(params?.configuration?.external?.authentication?.endpoint)
    ) {
      const ERROR_MESSAGE = `Missing required params?.configuration?.external?.authentication?.endpoint parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(params?.configuration?.external?.authentication?.username)
    ) {
      const ERROR_MESSAGE = `Missing required params?.configuration?.external?.authentication?.username parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(params?.configuration?.external?.authentication?.password)
    ) {
      const ERROR_MESSAGE = `Missing required params?.configuration?.external?.authentication?.password parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const AUTHENTICATE = params?.configuration?.external?.authentication;
    const AUTHENTICATE_ENDPOINT = AUTHENTICATE?.endpoint;
    const AUTHENTICATE_USERNAME = AUTHENTICATE?.username;
    const AUTHENTICATE_PASSWORD = AUTHENTICATE?.password;
    const BASIC_VALUE = Buffer.from(`${AUTHENTICATE_USERNAME}:${AUTHENTICATE_PASSWORD}`).toString('base64');
    const AUTHORIZATION_HEADER = `Basic ${BASIC_VALUE}`;
    const HTTP_REQUEST = {
      url: AUTHENTICATE_ENDPOINT,
      headers: {
        Authorization: AUTHORIZATION_HEADER,
        Accept: '*/*',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials&scope=ace_chat',
    }
    const HTTP_REQUEST_ADDITIONAL_OPTIONS = {
      json: false,
    };
    const HTTP_RESPONSE = await execHttpPostRequest({}, HTTP_REQUEST, HTTP_REQUEST_ADDITIONAL_OPTIONS);
    const HTTP_RESPONSE_TMP: any = HTTP_RESPONSE;

    let httpResponseBody: any;
    if (
      lodash.isString(HTTP_RESPONSE_TMP?.body)
    ) {
      httpResponseBody = JSON.parse(HTTP_RESPONSE_TMP?.body);
    }

    if (
      lodash.isEmpty(httpResponseBody?.access_token)
    ) {
      const ERROR_MESSAGE = `Missing required httpResponseBody?.access_token attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    if (
      !lodash.isNumber(httpResponseBody?.expires_in)
    ) {
      const ERROR_MESSAGE = `Wrong type  of httpResponseBody?.expires_in attribute! [Expected: number]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(httpResponseBody?.token_type)
    ) {
      const ERROR_MESSAGE = `Missing required httpResponseBody?.token_type attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }

    const RET_VAL = {
      accessToken: httpResponseBody?.access_token,
      expiresIn: httpResponseBody?.expires_in,
      tokenType: httpResponseBody?.token_type,
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, {
      conversationId: channel?.conversationId,
    });
    logger.error(authenticate.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  authenticate,
}
