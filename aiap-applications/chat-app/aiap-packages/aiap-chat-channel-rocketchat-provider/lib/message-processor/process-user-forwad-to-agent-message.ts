/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-channel-rocketchat-provider-process-user-forwad-to-agent-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IChatChannelV1RocketchatProcessMessageParams
} from '../types';


const processUserForwardedToAgentMessage = async (
  params: IChatChannelV1RocketchatProcessMessageParams
) => {
  try {
    const MESSAGE = params?.message;
    const CHANNEL = params?.channel;
    const SAMPLE_TRANSFER_TEXT = 'Transfered to next agent';
    const OUTGOING_MESSAGE = {
      conversationId: CHANNEL.conversationId,
      message: {
        text: SAMPLE_TRANSFER_TEXT
      },
      type: 'notification',
      translationKey: 'chat_app_rocketchat.transfer-to-other-agent'
    };
    CHANNEL.chatInitiated = true;
    await CHANNEL.chatServerSessionProvider.sendOutgoingMessage(OUTGOING_MESSAGE);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(processUserForwardedToAgentMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  processUserForwardedToAgentMessage
}
