/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-channel-rocketchat-provider-process-transfer-back-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IChatChannelV1RocketchatProcessMessageParams
} from '../types';


const processTransferBackMessage = async (
  params: IChatChannelV1RocketchatProcessMessageParams
) => {
  try {
    const MESSAGE = params?.message;
    const CHANNEL = params?.channel;
    const SAMPLE_TRANSFER_BACK_TEXT = 'Welcome back to the chatbot. You can continue asking questions.';
    const SAMPLE_AGENT_NOTIFICATION_MESSAGE = 'Agent closed the chat.';
  
    const NOTIFICATION_MESSAGE = {
      conversationId: CHANNEL.conversationId,
      message: {
        text: SAMPLE_AGENT_NOTIFICATION_MESSAGE
      },
      type: 'notification',
      translationKey: 'chat_app_rocketchat.agent-closed-chat'
    };

    const TRANSFER_MESSAGE = {
      sender_action: {
        type: 'transfer',
        channelId: 'socketio',
        skill: 'default',
        message:  SAMPLE_TRANSFER_BACK_TEXT
      },
      message: {},
      translationKey: 'chat_app_rocketchat.transfer-back-message'
    };

    await CHANNEL.chatServerSessionProvider.sendOutgoingMessage(NOTIFICATION_MESSAGE);
    await CHANNEL.chatServerSessionProvider.handleEventTransfer(TRANSFER_MESSAGE);
    await CHANNEL.disconnect();
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(processTransferBackMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


export {
  processTransferBackMessage,
}
