/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-genesys-coh-provider-coh-genesys-channel-start-chat';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  IChatServerSessionV1,
} from '@ibm-aiap/aiap-chat-app--types';

import {
  storeSession,
  reloadChatServerSessionProviderSession,
} from '@ibm-aca/aca-utils-session';

import { channelClient } from '../channel-client';

import { ChatChannelV1GenesysCohV2 } from '.';

const _startChat = async (
  channel: ChatChannelV1GenesysCohV2,
  session: IChatServerSessionV1,
) => {
  try {
    if (
      lodash.isEmpty(session?.conversation?.id)
    ) {
      const ERROR_MESSAGE = 'Missing required session?.conversation';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    channel.conversationId = session?.conversation?.id;

    const PARAMS_REQUEST_CHAT = {
      conversationId: channel.conversationId,
      configuration: channel.configuration,
    };
    console.log(MODULE_ID,
      {
        PARAMS_REQUEST_CHAT,
      });
    const RESPONSE = await channelClient.requestChat(PARAMS_REQUEST_CHAT);

    session.conversation.external = {
      id: RESPONSE?.chatId,
    }
    session.channel[channel.id] = RESPONSE;
    await storeSession(session);
    await reloadChatServerSessionProviderSession(channel.chatServerSessionProvider);

    channel.conversationIdExternal = session?.conversation?.external?.id;
    channel.online = true;
    channel.scheduleNextRefresh();
    logger.info(_startChat.name,
      {
        channel_id: channel.id,
        channel_conversationId: channel.conversationId,
        channel_conversationIdExternal: channel.conversationIdExternal,
      });

    channel.sendTranscript(session);
    const RET_VAL = {
      conversationId: channel.conversationId,
      conversationIdExternal: channel.conversationIdExternal,
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_startChat.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  _startChat,
}
