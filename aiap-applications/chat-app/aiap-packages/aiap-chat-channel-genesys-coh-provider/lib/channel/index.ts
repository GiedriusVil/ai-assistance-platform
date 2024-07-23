/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-genesys-coh-provider-coh-genesys-channel';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';



import {
  retrieveTranscript,
} from '@ibm-aca/aca-utils-transcript';

import {
  IChatMessageV1,
  IChatServerSessionV1,
  ChatChannelV1,
  ChatServerV1,
  ChatServerV1SessionProvider,
} from '@ibm-aiap/aiap-chat-app--types';

import { transformTranscript } from '../client-utils';

import {
  IChatChannelV1GenesysCohV2Configuration,
} from '../types';

import { channelClient } from '../channel-client';

import { _startChat } from './start-chat';
import { _refreshConversation } from './refresh-conversation';

class ChatChannelV1GenesysCohV2 extends ChatChannelV1<IChatChannelV1GenesysCohV2Configuration> {

  latestTimestamp: any;
  online = false;
  refreshTimer: any;

  constructor(
    id: string,
    chatServerSessionProvider: ChatServerV1SessionProvider<ChatServerV1, ChatChannelV1GenesysCohV2>,
    configuration: IChatChannelV1GenesysCohV2Configuration,
  ) {
    super(id, chatServerSessionProvider, configuration)
    this.type = configuration?.type;
  }

  async startChat(
    session: IChatServerSessionV1,
  ) {
    const RET_VAL = await _startChat(this, session);
    return RET_VAL;
  }

  async continueChat(
    session: IChatServerSessionV1,
  ) {
    try {
      if (
        lodash.isEmpty(session?.conversation?.id)
      ) {
        const ERROR_MESSAGE = 'Missing required session?.conversation parameter!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
      if (
        lodash.isEmpty(session?.conversation?.external?.id)
      ) {
        const ERROR_MESSAGE = 'Missing required session?.conversation parameter!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
      this.conversationId = session?.conversation?.id;
      this.conversationIdExternal = session?.conversation?.external?.id;

      this.online = true;
      this.refreshConversation();

      const RET_VAL = {
        conversationId: this.conversationId,
        conversationIdExternal: this.conversationIdExternal,
      };
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.continueChat.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async refreshConversation() {
    await _refreshConversation(this);
  }

  scheduleNextRefresh() {
    try {
      if (
        !lodash.isEmpty(this.__session())
      ) {
        if (
          this.online
        ) {
          this.refreshTimer = setTimeout(
            () => {
              this.refreshConversation();
            },
            this.configuration?.external?.pollingInterval || 2000
          );
        }
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.scheduleNextRefresh.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  clearRefreshTimer() {
    try {
      if (
        this.refreshTimer
      ) {
        clearTimeout(this.refreshTimer);
      }
      delete this.refreshTimer;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.clearRefreshTimer.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async sendTranscript(
    session: IChatServerSessionV1,
  ) {
    try {
      const TRANSCRIPT = await retrieveTranscript(session);
      const MESSAGE = await transformTranscript(TRANSCRIPT);
      await this.sendMessage(MESSAGE);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.sendTranscript.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async sendMessage(message: IChatMessageV1) {
    try {
      const PARAMS_SEND_MESSAGE = {
        configuration: this.configuration,
        conversationIdExternal: this.conversationIdExternal,
        state: this.__state(),
        message: message,
      };
      await channelClient.sendMessage(PARAMS_SEND_MESSAGE);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.sendMessage.name, { ACA_ERROR });
    }
  }

  async disconnect(userClose = undefined) {
    try {
      this.online = false;
      const PARAMS_DISCONNECT = {
        configuration: this.configuration,
        conversationIdExternal: this.conversationIdExternal,
        state: this.__state(),
      }
      await channelClient.disconnect(PARAMS_DISCONNECT);
      this.chatServerSessionProvider = undefined;
      this.clearRefreshTimer();
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { userClose });
      logger.error(this.disconnect.name, { ACA_ERROR });
    }
  }

  async handleClientSideDisconnect() {
    try {
      this.clearRefreshTimer();
      this.online = false;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.handleClientSideDisconnect.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async sendUserTyping(status) {
    try {
      const PARAMS = {
        configuration: this.configuration,
        conversationIdExternal: this.conversationIdExternal,
        state: this.__state(),
      };
      switch (status) {
        case true:
          await channelClient.startTyping(PARAMS);
          break;
        case false:
          await channelClient.stopTyping(PARAMS);
          break;
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.sendUserTyping.name, { ACA_ERROR });
    }
  }

}

export {
  ChatChannelV1GenesysCohV2,
};
