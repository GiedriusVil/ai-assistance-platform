/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rocketchat-genesys-provider-process-error-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IChatChannelV1RocketchatProcessMessageParams
} from '../types';

const processErrorMessage = async (
  params: IChatChannelV1RocketchatProcessMessageParams
) => {
  try {
    const MESSAGE = params?.message;
    const CHANNEL = params?.channel;
    const ERROR = MESSAGE?.error;
    const ERROR_CODE = 500;
    const ERROR_MESSAGE = ERROR?.message;

    const OUTGOING_MESSAGE = {
      conversationId: CHANNEL.conversationId,
      error: {
        code: ERROR_CODE, 
        message: ERROR_MESSAGE
      },
      message: {
        text: ERROR_MESSAGE
      },
      type: 'bot',
      translationKey: 'chat_app_rocketchat.no-agents-available'
    };

    const TRANSFER_BACK_MESSAGE = 'Welcome back to the chatbot. You can continue asking questions.';
    const TRANSFER_MESSAGE = {
      sender_action: {
        type: 'transfer',
        channelId: 'socketio',
        skill: 'default',
        message:  TRANSFER_BACK_MESSAGE
      },
      message: {},
      translationKey: 'chat_app_rocketchat.transfer-back-message'
    };

    await CHANNEL.chatServerSessionProvider.sendOutgoingMessage(OUTGOING_MESSAGE);
    await CHANNEL.chatServerSessionProvider.handleEventTransfer(TRANSFER_MESSAGE);
    await CHANNEL.disconnect();

    
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(processErrorMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  processErrorMessage
}
