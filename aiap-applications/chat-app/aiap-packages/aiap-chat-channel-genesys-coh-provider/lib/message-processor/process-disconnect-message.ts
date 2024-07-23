/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-genesys-coh-provider-process-disconnect-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

import { ChatChannelV1GenesysCohV2 } from '../channel';

const processDisconnectMessage = async (
  channel: ChatChannelV1GenesysCohV2,
) => {
  try {
    const CHAT_CLOSED_MESSAGE = {
      conversationId: channel?.conversationId,
      sender_action: {
        subType: 'session_closed',
      },
    };
    await channel.chatServerSessionProvider.sendOutgoingMessage(CHAT_CLOSED_MESSAGE);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(processDisconnectMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  processDisconnectMessage,
}
