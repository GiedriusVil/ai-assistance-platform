/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID =
  'aiap-chat-channel-telia-ace-provider-process-agent-typing-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

import { ChatChannelV1TeliaAce } from '../channel';

const processAgentTypingStartedMessage = async (
  channel: ChatChannelV1TeliaAce,
) => {
  try {
    const OUTGOING_MESSAGE = {
      recipient: {
        id: channel.conversationId,
      },
      sender_action: {
        type: 'typing_on',
      },
    };
    await channel.chatServerSessionProvider.sendOutgoingMessage(
      OUTGOING_MESSAGE
    );
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(processAgentTypingStartedMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const processAgentTypingStoppedMessage = async (
  channel: ChatChannelV1TeliaAce,
) => {
  try {
    const OUTGOING_MESSAGE = {
      recipient: {
        id: channel.conversationId,
      },
      sender_action: {
        type: 'typing_off',
      },
    };
    await channel.chatServerSessionProvider.sendOutgoingMessage(
      OUTGOING_MESSAGE
    );
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(processAgentTypingStoppedMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export { 
  processAgentTypingStartedMessage, 
  processAgentTypingStoppedMessage 
};
