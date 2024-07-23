/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-telia-ace-provider-channel-client-send-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  execHttpPostRequest,
} from '@ibm-aca/aca-wrapper-http';

import {
  IChatMessageV1,
} from '@ibm-aiap/aiap-chat-app--types';

import {
  ChatChannelV1TeliaAce,
} from '../channel';

const sendMessage = async (
  channel: ChatChannelV1TeliaAce,
  params?: {
    state: {
      authentication: {
        accessToken: string,
      }
    },
    message?: IChatMessageV1,
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
    if (
      lodash.isEmpty(params?.message)
    ) {
      const ERROR_MESSAGE = 'Missing required params?.message parameter!';
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
    const REQUEST_URL = `${ENDPOINT}/${CONVERSATION_EXTERNAL_ID}/message`
    
    let message: string;

    logger.info(MODULE_ID, { 
      message: params?.message?.message?.text 
    });

    if (
      !lodash.isEmpty(params?.message?.message?.text)
    ) {
      message = params?.message?.message?.text
    } else {
      message = 'N/A';
    }

    const BODY: any = {
      message
    }

    requestParams = {
      url: REQUEST_URL,
      headers: {
        Authorization: HEADER_AUTHORISATION,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: BODY,
    };
    additionalParams = {
      json: true,
    };

    response = await execHttpPostRequest({}, requestParams, additionalParams);
    
    const RET_VAL = response?.body;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { requestParams, response, additionalParams });
    logger.error(sendMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
export {
  sendMessage,
}
