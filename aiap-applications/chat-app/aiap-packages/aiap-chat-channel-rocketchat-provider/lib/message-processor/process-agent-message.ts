/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-channel-rocketchat-provider-process-agent-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IChatChannelV1RocketchatProcessMessageParams
} from '../types';

const processAgentMessage = async (
  params: IChatChannelV1RocketchatProcessMessageParams
) => {
  try {
    const MESSAGE = params?.message;
    const CHANNEL = params.channel;
    const MESSAGE_TEXT = MESSAGE?.fields?.args?.[0]?.msg;
    const OUTGOING_MESSAGE = {
      conversationId: CHANNEL.conversationId,
      message: {
        text: MESSAGE_TEXT
      },
      type: 'agent',
    };
    await CHANNEL.chatServerSessionProvider.sendOutgoingMessage(OUTGOING_MESSAGE);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(processAgentMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  processAgentMessage
}
