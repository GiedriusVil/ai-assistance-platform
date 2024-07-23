/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-telia-ace-provider-process-entry-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

import { ChatChannelV1TeliaAce } from '../channel';
import { IChatMessageV1TeliaAceV1 } from '../types';

const MESSAGE_SOURCE_ENUM = {
  SYSTEM: 'system',
  AGENT: 'agent',
  CUSTOMER: 'customer',
};

const getMessageType = (messageSource: string) => {
  switch (messageSource) {
    case MESSAGE_SOURCE_ENUM.AGENT:
      return 'agent';
    case MESSAGE_SOURCE_ENUM.SYSTEM:
      return 'notification';
    case MESSAGE_SOURCE_ENUM.CUSTOMER:
      return 'agent';
    default:
      return 'agent';
  }
};

const processEntryMessage = async (
  channel: ChatChannelV1TeliaAce,
  message: IChatMessageV1TeliaAceV1
) => {
  try {
    const MESSAGE_PROPERTIES = message?.properties;
    const MESSAGE_PROPERTIES_SOURCE = MESSAGE_PROPERTIES?.source || '';
    const MESSAGE_TEXT = MESSAGE_PROPERTIES?.message;
    const MESSAGE_TYPE = getMessageType(MESSAGE_PROPERTIES_SOURCE);

    if (MESSAGE_PROPERTIES_SOURCE === MESSAGE_SOURCE_ENUM.CUSTOMER) {
        logger.info(processEntryMessage.name, {
            message
        });
        return;
    }

    const OUTGOING_MESSAGE = {
      conversationId: channel.conversationId,
      message: {
        text: MESSAGE_TEXT,
      },
      type: MESSAGE_TYPE,
    };
    await channel.chatServerSessionProvider.sendOutgoingMessage(
      OUTGOING_MESSAGE
    );
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(processEntryMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export { processEntryMessage };
