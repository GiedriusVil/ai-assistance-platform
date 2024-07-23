/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-telia-ace-provider-process-established-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

import { ChatChannelV1TeliaAce } from '../channel';
import { IChatMessageV1TeliaAceV1 } from '../types';


const processEstablishedMessage = async (
  channel: ChatChannelV1TeliaAce,
  message: IChatMessageV1TeliaAceV1
) => {
  try {
    const SESSION = channel.__session();

    await channel.sendTranscript(SESSION);

    const MESSAGE_PROPERTIES = message?.properties;
    const MESSAGE_TEXT = MESSAGE_PROPERTIES?.infoText;

    const OUTGOING_MESSAGE = {
      conversationId: channel.conversationId,
      message: {
        text: MESSAGE_TEXT,
      },    
      type: 'notification',
    };
    await channel.chatServerSessionProvider.sendOutgoingMessage(
      OUTGOING_MESSAGE
    );
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(processEstablishedMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export { processEstablishedMessage };
