
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-server-session-provider-processor-outgoing-message-process-default-by-attachment-aca-debug';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  getMemoryStore
} from '@ibm-aiap/aiap-memory-store-provider';

import {
  formatIntoAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  formatDebugMessage,
  constructMessageStackIdFromMessage
} from './utils';

const processDefaultByAttachmentAcaDebug = async (context, params) => {

  try {
    const SESSION_STORE = getMemoryStore();
    const MESSAGE = params?.message;
    const FORMATTED_MESSAGE = formatDebugMessage(MESSAGE);
    const MESSAGE_STACK_ID = constructMessageStackIdFromMessage(MESSAGE);
    let messagesStack = await SESSION_STORE.getData(MESSAGE_STACK_ID);
    if (!messagesStack.messages) {
      messagesStack.messages = [];
    }
    messagesStack.messages.push(FORMATTED_MESSAGE);

    await SESSION_STORE.setData(MESSAGE_STACK_ID, messagesStack);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(processDefaultByAttachmentAcaDebug.name, { ACA_ERROR });
    throw ACA_ERROR;
  }

}

export {
  processDefaultByAttachmentAcaDebug,
}
