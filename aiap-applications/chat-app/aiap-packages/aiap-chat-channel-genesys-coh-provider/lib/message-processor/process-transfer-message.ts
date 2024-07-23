/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-genesys-coh-provider-process-transfer-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

import { ChatChannelV1GenesysCohV2 } from '../channel';

const TRANSFER_BACK_NOTIFICATION = {
  en: 'Please do not write personal information in the chat. Welcome back to the chatbot. You can continue asking questions.',
  fi: 'Ethän kirjoita henkilötietojasi chattiin. Tervetuloa takaisin chatbottiin. Voit kysyä uuden kysymyksen.',
  sv: 'Skriv inte dina personuppgifter i chatten. Välkommen tillbaka till chatbotten. Du kan ställa en ny fråga.',
}

const processTransferMessage = async (
  channel: ChatChannelV1GenesysCohV2,
) => {
  try {
    let transferBackText = TRANSFER_BACK_NOTIFICATION.fi;
    const CHAT_LANGUAGE = channel?.chatServerSessionProvider?.session?.gAcaProps?.isoLang;
    const TRANSFER_BACK_TXT_BY_LANG = TRANSFER_BACK_NOTIFICATION?.[CHAT_LANGUAGE];
    if (
      !lodash.isEmpty(TRANSFER_BACK_TXT_BY_LANG)
    ) {
      transferBackText = TRANSFER_BACK_TXT_BY_LANG;
    }

    const OUTGOING_MESSAGE = {
      conversationId: channel?.conversationId,
      message: {
        text: transferBackText
      },
      type: 'notification',
    };
    await channel.chatServerSessionProvider.sendOutgoingMessage(
      OUTGOING_MESSAGE
    );
    
    const TRANSFER_MESSAGE = {
      sender_action: {
        type: 'transfer',
        channelId: 'socketio',
        skill: 'default',
      }
    };
    await channel.chatServerSessionProvider.handleEventTransfer(
      TRANSFER_MESSAGE
    );
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(processTransferMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  processTransferMessage,
}
