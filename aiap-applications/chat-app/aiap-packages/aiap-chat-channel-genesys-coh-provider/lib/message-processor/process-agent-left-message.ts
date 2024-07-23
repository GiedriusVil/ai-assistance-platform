/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-genesys-coh-provider-process-agent-left-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

import { ChatChannelV1GenesysCohV2 } from '../channel';

const NOTIFICATION = {
  en: ' service advisor has left the chat.',
  fi: ' palveluneuvoja poistui keskustelusta.',
  sv: ' servicerådgivaren lämnade chatten.',
}

const processAgentLeftMessage = async (
  channel: ChatChannelV1GenesysCohV2,
  message: any,
) => {
  try {
    const AGENT_NAME = message?.nickname;
    let text = AGENT_NAME + NOTIFICATION.fi;
    const CHAT_LANGUAGE = channel?.chatServerSessionProvider?.session?.gAcaProps?.isoLang;
    const TEXT_BY_LANG = NOTIFICATION?.[CHAT_LANGUAGE];
    if (
      !lodash.isEmpty(TEXT_BY_LANG)
    ) {
      text = AGENT_NAME + TEXT_BY_LANG;
    }
    const OUTGOING_MESSAGE = {
      conversationId: channel.conversationId,
      message: {
        text: text
      },
      type: 'notification',
    };
    await channel.chatServerSessionProvider.sendOutgoingMessage(OUTGOING_MESSAGE);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(processAgentLeftMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


export {
  processAgentLeftMessage,
}
