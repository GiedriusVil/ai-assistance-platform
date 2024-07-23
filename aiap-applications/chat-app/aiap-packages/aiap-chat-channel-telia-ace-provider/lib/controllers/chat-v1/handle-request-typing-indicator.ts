/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-tealia-ace-provider-controllers-chat-v1-handle-request-typing-indicator';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  publishTeliaAceEvent,
  extractConversationIdFromRequest,
} from './utils';

const handleRequestTypingIndicator = async (
  request: any,
  response: any,
) => {
  const ERRORS: Array<any> = [];
  let body;
  let conversationId;
  let conversationIdExternal;
  let status;
  try {
    conversationId = extractConversationIdFromRequest(request);
    if (
      lodash.isEmpty(conversationId)
    ) {
      const ERROR_MESSAGE = 'Unable to extract conversationId, by provided request!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    conversationIdExternal = request?.params?.conversationIdExternal;
    status = request?.query?.status;
    body = {...request?.body, type: `typing_${status}`};

    publishTeliaAceEvent(
      conversationId,
      conversationIdExternal,
      body,
    );

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR,
      {
        conversationId,
        conversationIdExternal,
      });
    logger.error(handleRequestTypingIndicator.name, { ACA_ERROR });
    ERRORS.push(ACA_ERROR);
  }

  if (
    !lodash.isEmpty(ERRORS)
  ) {
    logger.error(handleRequestTypingIndicator.name, { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  } else {
    response.status(200).json({
      status: 'valid',
      conversationId,
      conversationIdExternal,
    });
  }
}

export {
  handleRequestTypingIndicator,
}
