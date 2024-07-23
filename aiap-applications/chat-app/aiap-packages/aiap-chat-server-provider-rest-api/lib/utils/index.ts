/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-chat-server-provider-rest-api-utils-rest-api-server-id`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  formatIntoAcaError,
  appendDataToError,
  ACA_ERROR_TYPE,
  throwAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  ChatRestV1SessionProvider
} from '../server-session-provider';

const aiapRestApiServerId = (params) => {
  const TENANT_ID = params?.tenant;
  const ENGAGEMENT_ID = params?.engagement?.id;
  const ENGAGEMENT_ASSISTANT_ID = params?.assistant?.id;
  try {
    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = `Missing required params.tenant.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE)
    }
    if (
      lodash.isEmpty(ENGAGEMENT_ID)
    ) {
      const MESSAGE = `Missing required params.engagement.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE)
    }
    if (
      lodash.isEmpty(ENGAGEMENT_ASSISTANT_ID)
    ) {
      const MESSAGE = `Missing required params.engagement.assistant.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE)
    }
    const RET_VAL = `${TENANT_ID}:${ENGAGEMENT_ASSISTANT_ID}:${ENGAGEMENT_ID}`;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { TENANT_ID, ENGAGEMENT_ASSISTANT_ID, ENGAGEMENT_ID });
    throw ACA_ERROR
  }
}

const setRetrieveMessageInterval = async (
  chatRestSessionProvider: ChatRestV1SessionProvider,
  params: any
) => {
  const BODY = params?.body;
  const RESPONSE = params?.response;
  const INTERVAL = setInterval(async () => {
    const MESSAGE = await chatRestSessionProvider.checkForAvailableMessages();
    if (!lodash.isEmpty(MESSAGE)) {
      BODY.output = {
        text: MESSAGE
      };
      RESPONSE.send(BODY);
      chatRestSessionProvider.clearRetrieveMessageInterval();
    }
  }, 4000);
  return INTERVAL;
}

const transformMessagesStack = (messageStack) => {
  const filteredMessages = messageStack?.messages.filter((message) => !lodash.isEmpty(message?.message?.text));
  let retVal = [];
  if (!lodash.isEmpty(filteredMessages)) {
    filteredMessages?.forEach(message => {
      const MESSAGE_TEXT = message?.message?.text;
      retVal.push(MESSAGE_TEXT);
    })
  }
  return retVal;

}

export {
  aiapRestApiServerId,
  setRetrieveMessageInterval,
  transformMessagesStack
};
