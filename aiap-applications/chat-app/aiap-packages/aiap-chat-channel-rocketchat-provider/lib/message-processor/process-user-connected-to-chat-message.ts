/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-channel-rocketchat-provider-process-user-connected-to-chat-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IChatChannelV1RocketchatProcessMessageParams
} from '../types';

const processUserConnectedToChatMessage = async (
  params: IChatChannelV1RocketchatProcessMessageParams
) => {
  try {
    const MESSAGE = params?.message;
    const CHANNEL = params?.channel;
    const SAMPLE_USER_JOIN_MESSAGE = 'User joined the chat';
    const SAMPLE_AGENT_FIRST_MESSAGE = 'Welcome to customer support. Agent will join shortly.';

    const USER_JOIN_NOTIFICATION_MESSAGE = {
      conversationId: CHANNEL.conversationId,
      message: {
        text: SAMPLE_USER_JOIN_MESSAGE
      },
      type: 'notification',
      translationKey: 'chat_app_rocketchat.user-joined-chat'
    };

    const AGENT_FIRST_MESSAGE_MESSAGE = {
      conversationId: CHANNEL.conversationId,
      message: {
        text: SAMPLE_AGENT_FIRST_MESSAGE
      },
      type: 'agent',
      translationKey: 'chat_app_rocketchat.agent-first-message'
    };

    await CHANNEL.chatServerSessionProvider.sendOutgoingMessage(USER_JOIN_NOTIFICATION_MESSAGE);
    await CHANNEL.chatServerSessionProvider.sendOutgoingMessage(AGENT_FIRST_MESSAGE_MESSAGE);
    CHANNEL.chatInitiated = true;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(processUserConnectedToChatMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  processUserConnectedToChatMessage
}
