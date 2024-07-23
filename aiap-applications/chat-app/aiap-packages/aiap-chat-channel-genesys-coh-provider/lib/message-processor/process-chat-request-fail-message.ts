/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-genesys-coh-provider-process-chat-request-failed-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { appendDataToError, formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

import { ChatChannelV1GenesysCohV2 } from '../channel';

const processChatRequestFailMessage = async (
  channel: ChatChannelV1GenesysCohV2,
  message: any,
) => {
  let messageStatusCode;
  let messageReason;
  try {
    messageStatusCode = message?.statusCode;
    messageReason = message?.reason;  // I am not sure this one is correct!

    const OUTGOING_MESSAGE = {
      conversationId: channel.conversationId,
      error: {
        code: messageStatusCode,
        message: messageReason
      },
      type: 'bot',
    };
    await channel.chatServerSessionProvider.sendOutgoingMessage(OUTGOING_MESSAGE);

    setTimeout(() => {
      channel.disconnect();
    }, 100);

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR,
      {
        messageStatusCode,
        messageReason,
      });
    logger.error(processChatRequestFailMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  processChatRequestFailMessage,
}
