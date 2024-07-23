/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-genesys-coh-provider-coh-genesys-channel-refresh-conversation';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  IChatServerSessionV1,
} from '@ibm-aiap/aiap-chat-app--types';

import {
  setParamToSession,
  storeSession,
} from '@ibm-aca/aca-utils-session';

import { channelClient } from '../channel-client';

import { ChatChannelV1GenesysCohV2 } from '.';

import {
  processMessage,
} from '../message-processor';

const _refreshConversation = async (
  channel: ChatChannelV1GenesysCohV2,
) => {
  channel.clearRefreshTimer();
  if (
    !lodash.isEmpty(channel.__session())
  ) {
    let response = undefined;
    let state = undefined;
    try {
      state = channel.__state();
      await channel.chatServerSessionProvider.sendOutgoingMessageAcaDebug(MODULE_ID, { state });
      const PARAMS_REFRESH_CHAT = {
        conversationIdExternal: channel.conversationIdExternal,
        configuration: channel.configuration,
        state: state,
      }
      response = await channelClient.refreshChat(PARAMS_REFRESH_CHAT);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { state })
      logger.error(_refreshConversation.name, { ACA_ERROR });
      channel.scheduleNextRefresh();
      await channel.chatServerSessionProvider.sendOutgoingMessageAcaError(MODULE_ID, ACA_ERROR);
      return;
    }
    if (
      response
    ) {
      const TRANSCRIPT_POSITION = response?.transcriptPosition;
      await setParamToSession(
        channel.chatServerSessionProvider,
        [
          'channel',
          channel.id,
          'transcriptPosition'
        ],
        TRANSCRIPT_POSITION
      );
      if (
        channel.chatServerSessionProvider.session
      ) {
        channel.chatServerSessionProvider.session.channel[channel.id].transcriptPosition = TRANSCRIPT_POSITION;
        await storeSession(channel.chatServerSessionProvider.session);
      }
      const RESP_MESSAGES = response?.messages;
      const CHAT_STATE = response?.chat?.status;
      if (
        CHAT_STATE === 'DISCONNECTED'
      ) {
        await processMessage(channel, CHAT_STATE, '');
      }
      if (
        RESP_MESSAGES &&
        lodash.isArray(RESP_MESSAGES) &&
        !lodash.isEmpty(RESP_MESSAGES)
      ) {
        for (const MESSAGE of RESP_MESSAGES) {
          await processMessage(
            channel,
            CHAT_STATE,
            MESSAGE
          );
        }
      }
    }
    channel.scheduleNextRefresh();
  }
}

export {
  _refreshConversation,
} 
