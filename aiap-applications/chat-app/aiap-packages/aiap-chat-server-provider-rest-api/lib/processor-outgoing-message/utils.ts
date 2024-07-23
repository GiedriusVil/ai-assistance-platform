/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

const formatDebugMessage = (message) => {
  const FORMATTED_MESSAGE = {
    conversationId: message?.traceId?.conversationId,
    message: {
      text: message?.message?.text
    }
  }
  return FORMATTED_MESSAGE;
}

const constructMessageStackIdFromMessage = (message) => {
  let retVal = '';
  const CONVERSATION_ID = message?.traceId?.conversationId;
  if (!lodash.isEmpty(CONVERSATION_ID)) {
    retVal = 'MESSAGE_STACK_' + CONVERSATION_ID;
  }
  return retVal;
}

export {
  formatDebugMessage,
  constructMessageStackIdFromMessage
}
