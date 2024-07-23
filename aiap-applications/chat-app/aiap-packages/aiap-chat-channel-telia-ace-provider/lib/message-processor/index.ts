/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-telia-ace-provider-message-processor';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import { ChatChannelV1TeliaAce } from '../channel';

import { IChatMessageV1TeliaAceV1 } from '../types';
import { processEntryMessage } from './process-entry-message';
import { processQueueMessage } from './process-queue-mesage';
import { processEstablishedMessage } from './process-established-message';
import { processFinishedMessage } from './process-finished-mesage';
import { 
  processAgentTypingStartedMessage, 
  processAgentTypingStoppedMessage
 } from './process-agent-typing-message';

const MESSAGE_TYPE_ENUM = {
  ENTRY: 'entry',
  QUEUE: 'queue',
  ESTABLISHED: 'established',
  FINISHED: 'finished',
  AGENT_TYPING_STARTED: 'typing_on',
  AGENT_TYPING_STOPPED: 'typing_off'
};

const processMessage = async (
  channel: ChatChannelV1TeliaAce,
  message: IChatMessageV1TeliaAceV1
) => {
  try {
    if (
      lodash.isEmpty(message?.type)
    ) {
      const ERROR_MESSAGE = 'Missing required message?.type paramter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const MESSAGE_TYPE = message?.type;

    switch (MESSAGE_TYPE) {
      case MESSAGE_TYPE_ENUM.AGENT_TYPING_STARTED:
        await processAgentTypingStartedMessage(channel);
        break;
      case MESSAGE_TYPE_ENUM.AGENT_TYPING_STOPPED:
        await processAgentTypingStoppedMessage(channel);
        break;
      case MESSAGE_TYPE_ENUM.ENTRY:
        await processEntryMessage(channel, message);
        break;
      case MESSAGE_TYPE_ENUM.ESTABLISHED:
        await processEstablishedMessage(channel, message);
        break;
      case MESSAGE_TYPE_ENUM.FINISHED:
        await processFinishedMessage(channel);
        break;
      case MESSAGE_TYPE_ENUM.QUEUE:
        await processQueueMessage(channel, message);
        break;
      default:
        break;
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(processMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export { processMessage };
