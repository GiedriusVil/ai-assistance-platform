/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-genesys-coh-provider-process-notification';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

import { ChatChannelV1GenesysCohV2 } from '../channel';

const processNotification = async (
  channel: ChatChannelV1GenesysCohV2,
  message: any,
) => {
  try {
    const MESSAGE_TEXT = message?.message;
    const OUTGOING_MESSAGE = {
      conversationId: channel.conversationId,
      message: {
        text: MESSAGE_TEXT
      },
      type: 'notification',
    };

    await channel.chatServerSessionProvider.sendOutgoingMessage(OUTGOING_MESSAGE);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(processNotification.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  processNotification,
}
