/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-telia-ace-provider-channel-client-post-conversation';
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
  PostConversationBody
} from '../types';

import {
  ChatChannelV1TeliaAce,
} from '../channel';

const postConversation = async (
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
    const ENDPOINT = channel?.configuration?.external?.conversation?.endpoint;
    const HEADER_BEARER_TOKEN = params?.state?.authentication?.accessToken;
    const HEADER_AUTHORISATION = `Bearer ${HEADER_BEARER_TOKEN}`;

    const EXTERNAL = channel?.configuration?.external;
    const EXTERNAL_CONVERSATION = EXTERNAL?.conversation;

    if (
      lodash.isEmpty(channel?.conversationId)
    ) {
      const ERROR_MESSAGE = 'Missing required channel?.conversationId parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(EXTERNAL_CONVERSATION?.chatSettings?.eventCallbackURL)
    ) {
      const ERROR_MESSAGE = 'Missing required EXTERNAL_CONVERSATION?.chatSettings?.eventCallbackURL parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    const BODY: PostConversationBody = {
      eventCallbackURL: EXTERNAL_CONVERSATION?.chatSettings?.eventCallbackURL,
      eventCallbackBearerToken: channel?.conversationId,
      chatEngineInstanceName: EXTERNAL_CONVERSATION?.chatSettings?.chatEngineInstanceName,
      customerIpAddress: EXTERNAL_CONVERSATION?.chatSettings?.customerIpAddress,
      sourceUrl: EXTERNAL_CONVERSATION?.chatSettings?.sourceUrl,
      entrance: EXTERNAL_CONVERSATION?.chatSettings?.entrance,
      errand: EXTERNAL_CONVERSATION?.chatSettings?.errand,
      videoChatCapabilities: EXTERNAL_CONVERSATION?.chatSettings?.videoChatCapabilities,
      contactData: {
        customerSpecific5: channel?.conversationId
      },
    }

    requestParams = {
      url: `${ENDPOINT}?media=chat`,
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

    const response = await execHttpPostRequest({}, requestParams, additionalParams);

    const RET_VAL = response?.body;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { requestParams, response, additionalParams });
    logger.error(postConversation.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
export {
  postConversation,
}
