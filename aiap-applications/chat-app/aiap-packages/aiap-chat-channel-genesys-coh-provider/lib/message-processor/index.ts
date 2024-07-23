/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-genesys-coh-provider-message-processor';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import { ChatChannelV1GenesysCohV2 } from '../channel';

import { processErrorMessage } from './process-error-message';
import { processChatRequestFailMessage } from './process-chat-request-fail-message';
import { processAgentJoinedMessage } from './process-agent-joined-message';
import {
  processAgentTypingStartedMessage,
  processAgentTypingStoppedMessage,
} from './process-agent-typing-message';
import { processTextMessage } from './process-text-message';
import { processPushUrlMessage } from './process-push-url-message';
import { processAgentLeftMessage } from './process-agent-left-message';
import { processNotification } from './process-notification';
import { processDisconnectMessage } from './process-disconnect-message';
import { processTransferMessage } from './process-transfer-message';

const CHAT_STATE_ENUM = {
  CONNECTED: 'CONNECTED',
  TRANSCRIPT: 'TRANSCRIPT',
  DISCONNECTED: 'DISCONNECTED'
}

const MESSAGE_TYPE_ENUM = {
  ERROR: 'Error',
  CHAT_REQUEST_FAIL: 'Error',
  AGENT_JOINED: 'ParticipantJoined',
  AGENT_LEFT: 'ParticipantLeft',
  AGENT_TYPING_STARTED: 'TypingStarted',
  AGENT_TYPING_STOPPED: 'TypingStopped',
  MESSAGE: 'Message',
  NOTIFICATION: 'Notification',
  PUSH_URL: 'PushUrl',
};

const throwEmtpyChatStateError = (
  channel: ChatChannelV1GenesysCohV2
) => {
  const ERROR_MESSAGE = 'Missing chat channel state!';
  throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE,
    {
      genesys: channel?.chatServerSessionProvider?.session?.genesys,
      conversation: channel?.chatServerSessionProvider?.session?.conversation
    });
}

const throwEmptyMessageTypeError = (
  channel: ChatChannelV1GenesysCohV2,
  message: any,
) => {
  const ERROR_MESSAGE = 'Missing message type!';
  throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE,
    {
      genesys: channel?.chatServerSessionProvider?.session?.genesys,
      conversation: channel?.chatServerSessionProvider?.session?.conversation,
      message: message,
    });
}

const processMessage = async (
  channel: ChatChannelV1GenesysCohV2,
  chatState: any,
  message: any,
) => {
  try {
    if (
      lodash.isEmpty(chatState)
    ) {
      throwEmtpyChatStateError(channel);
    }

    if (
      chatState === CHAT_STATE_ENUM.CONNECTED ||
      chatState === CHAT_STATE_ENUM.TRANSCRIPT
    ) {
      const MESSAGE_TYPE = message?.type;
      if (
        lodash.isEmpty(MESSAGE_TYPE)
      ) {
        throwEmptyMessageTypeError(channel, message);
      }
      switch (MESSAGE_TYPE) {
        case MESSAGE_TYPE_ENUM.ERROR:
          await processErrorMessage(channel, message);
          break;
        case MESSAGE_TYPE_ENUM.CHAT_REQUEST_FAIL:
          await processChatRequestFailMessage(channel, message);
          break;
        case MESSAGE_TYPE_ENUM.AGENT_JOINED:
          await processAgentJoinedMessage(channel, message);
          break;
        case MESSAGE_TYPE_ENUM.AGENT_TYPING_STARTED:
          await processAgentTypingStartedMessage(channel, message);
          break;
        case MESSAGE_TYPE_ENUM.AGENT_TYPING_STOPPED:
          await processAgentTypingStoppedMessage(channel, message);
          break;
        case MESSAGE_TYPE_ENUM.MESSAGE:
          await processTextMessage(channel, message);
          break;
        case MESSAGE_TYPE_ENUM.AGENT_LEFT:
          await processAgentLeftMessage(channel, message);
          break;
        case MESSAGE_TYPE_ENUM.NOTIFICATION:
          await processNotification(channel, message);
          break;
        case MESSAGE_TYPE_ENUM.PUSH_URL:
          await processPushUrlMessage(channel, message);
          break
        default:
          break;
      }
    } else if (
      chatState === CHAT_STATE_ENUM.DISCONNECTED
    ) {
      if (
        channel?.configuration?.external?.onDisconnectAction === 'transfer'
      ) {
        await processTransferMessage(channel);
      } else {
        await processDisconnectMessage(channel);
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(processMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  processMessage,
}
