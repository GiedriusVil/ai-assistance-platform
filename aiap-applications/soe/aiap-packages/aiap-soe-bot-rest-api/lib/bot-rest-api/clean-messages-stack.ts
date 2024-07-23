/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-bot-rest-api-bot-rest-api-clean-messages-stack';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

const cleanMessagesStack = (
  messagesStack: {
    last_message_timestamp: any,
    messages: Array<{
      traceId: {
        incoming_timestamp: any
      }
    }>,
  },
) => {
  try {
    const RET_VAL: any = {
      last_message_timestamp: messagesStack.last_message_timestamp,
      messages: [],
    };

    for (let i = 0; i < messagesStack.messages.length; i++) {
      if (
        messagesStack.messages[i].traceId.incoming_timestamp >= messagesStack.last_message_timestamp
      ) {
        RET_VAL.messages.push(messagesStack.messages[i]);
      }
    }

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(cleanMessagesStack.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  cleanMessagesStack,
} 
