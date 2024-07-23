/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-telia-ace-provider-channel-client-disconnect';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  execHttpPutRequest,
} from '@ibm-aca/aca-wrapper-http';

import {
  ChatChannelV1TeliaAce,
} from '../channel';

const disconnect = async (
  channel: ChatChannelV1TeliaAce,
  params?: {
    state: {
      authentication: {
        accessToken: string,
      }
    },
  }
) => {
  let response;
  let requestParams;
  let additionalParams;

  try {
    if (
      lodash.isEmpty(channel?.configuration?.external?.conversation?.endpoint)
    ) { 
      const ERROR_MESSAGE = 'Missing required channel?.configuration?.external?.conversation?.endpoint parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(params?.state?.authentication?.accessToken)
    ) {
      const ERROR_MESSAGE = 'Missing required params?.state?.authentication?.accessToken parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    const ENDPOINT = channel?.configuration?.external?.conversation?.endpoint;
    const HEADER_BEARER_TOKEN = params?.state?.authentication?.accessToken;
    const HEADER_AUTHORISATION = `Bearer ${HEADER_BEARER_TOKEN}`;

    if (
      lodash.isEmpty(channel?.conversationIdExternal)
    ) {
      const ERROR_MESSAGE = 'Missing required channel?.conversationIdExternal parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    const CONVERSATION_EXTERNAL_ID = channel?.conversationIdExternal;
    const REQUEST_URL = `${ENDPOINT}/${CONVERSATION_EXTERNAL_ID}/end`

    requestParams = {
      url: REQUEST_URL,
      headers: {
        Authorization: HEADER_AUTHORISATION,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    };
    additionalParams = {
      json: true,
    };

    response = await execHttpPutRequest({}, requestParams, additionalParams);

    const RET_VAL = response?.body;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { requestParams, response, additionalParams });
    logger.error(disconnect.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
export {
  disconnect,
}
