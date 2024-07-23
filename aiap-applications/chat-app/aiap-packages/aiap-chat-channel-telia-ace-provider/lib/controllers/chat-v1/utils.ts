/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-chat-channel-telia-ace-provider-controllers-chat-v1-utils`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getEventStreamMain,
} from '@ibm-aiap/aiap-event-stream-provider';

const extractConversationIdFromRequest = (
  request: {
    headers: {
      authorization: string
    }
  }
) => {
  let authorization: string;
  try {
    if (
      lodash.isEmpty(request?.headers?.authorization)
    ) {
      const ERROR_MESSAGE = 'Missing required request?.headers?.authorization parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !lodash.isString(request?.headers?.authorization)
    ) {
      const ERROR_MESSAGE = 'Wrong type of required request?.headers?.authorization parameter! [Expected: String]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    authorization = request?.headers?.authorization;

    const RET_VAL = authorization.replace('Bearer ', '');
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(MODULE_ID, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const constructEventTypeForTealiaAce = (
  conversationId: string,
) => {
  const RET_VAL = `teliaace:${conversationId}`;
  return RET_VAL;
}

const publishTeliaAceEvent = (
  conversationId: string,
  conversationIdExternal: string,
  body: any,
) => {
  const MAIN_EVENT_STREAM = getEventStreamMain();
  if (
    !MAIN_EVENT_STREAM
  ) {
    const ERROR_MESSAGE = `Unable to retrieve MainAcaEventStream!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
  }
  const EVENT_TYPE = constructEventTypeForTealiaAce(conversationId);
  const EVENT = {
    conversationId: conversationId,
    conversationIdExternal: conversationIdExternal,
    body: body,
  }
  MAIN_EVENT_STREAM.publish(EVENT_TYPE, EVENT);
}

export {
  extractConversationIdFromRequest,
  publishTeliaAceEvent,
}
