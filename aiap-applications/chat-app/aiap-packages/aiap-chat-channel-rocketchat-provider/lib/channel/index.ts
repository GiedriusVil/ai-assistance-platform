/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-channel-rocketchat-provider-rocketchat-channel';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import uuid from 'uuid/v4';

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE
} from '@ibm-aca/aca-utils-errors';

import {
  storeSession
} from '@ibm-aca/aca-utils-session';

import {
  IChatMessageV1,
  ChatChannelV1,
  IChatServerSessionV1,
} from '@ibm-aiap/aiap-chat-app--types';

import {
  initChatConnection,
  connectUserToChat,
  constructRocketchatSession,
} from '../client';

import {
  processMessage
} from '../message-processor';

import {
  IChatChannelV1RocketchatConfiguration
} from '../types';


class ChatChannelV1Rocketchat extends ChatChannelV1<IChatChannelV1RocketchatConfiguration> {

  config: any;
  chatServerSessionProvider: any;
  rocketchatSocket: any;
  conversationId: string;
  messagesCount: number;
  chatInitiated: boolean;
  channelId: any

  constructor(
    channelId: any,
    chatServerSessionProvider: any,
    config: any
  ) {
    super(channelId, chatServerSessionProvider, config)
    this.config = config;
    this.chatServerSessionProvider = chatServerSessionProvider;
    this.conversationId = chatServerSessionProvider?.session?.conversation?.id;
    this.messagesCount = 1;
    this.chatInitiated = false;
    this.channelId = channelId;

  }

  async __init(reconnect = false) {
    try {
      if (!this.chatServerSessionProvider) {
        const ERROR_MESSAGE = 'Missing required this.chatServerSessionProvider attribute!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);;
      }
      if (!this.chatServerSessionProvider.session) {
        const ERROR_MESSAGE = 'Missing required this.chatServerSessionProvider.session attribute!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);;
      }
      const STORED_SESSION = this.__session();
      const INIT_CHAT_PARAMS = {
        configurations: this.config,
      };
      this.rocketchatSocket = await initChatConnection(INIT_CHAT_PARAMS);
      if (!reconnect) {
        const ROCKETCHAT_SESSION = constructRocketchatSession();
        STORED_SESSION.channel.rocketchat = ROCKETCHAT_SESSION;
        await storeSession(STORED_SESSION);
      }
      await this.subscribeToChatEvents(STORED_SESSION);
    }
    catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.__init.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }


  async startChat(session: IChatServerSessionV1, notify?: boolean): Promise<{ conversationId: string; conversationIdExternal: string; }> {

    try {
      await this.__init();
      const RET_VAL = {
        conversationId: this.conversationId,
        conversationIdExternal: this.conversationId
      };
      return RET_VAL;

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('startChat', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
  async continueChat(session: IChatServerSessionV1): Promise<{ conversationId: string; conversationIdExternal: string; }> {

    try {
      await this.__init(true);
      const RET_VAL = {
        conversationId: this.conversationId,
        conversationIdExternal: this.conversationId
      };
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('continueChat', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async sendMessage(message: IChatMessageV1): Promise<any> {

    try {
      const SESSION = this.chatServerSessionProvider?.session;
      const MESSAGE_TEXT = message?.message?.text;
      const ROCKETCHAT_SESSION = SESSION?.channel?.rocketchat;
      const CHAT_ROOM_ID = ROCKETCHAT_SESSION?.chatRoomId;
      const CHAT_TOKEN = ROCKETCHAT_SESSION?.chatToken;
      const SEND_MESSAGE_REQUEST = {
        msg: 'method',
        method: 'sendMessageLivechat',
        params: [
          {
            _id: uuid(),
            rid: CHAT_ROOM_ID,
            msg: MESSAGE_TEXT,
            token: CHAT_TOKEN,
          }, null],
        id: String(this.messagesCount++),
      };
      await this.rocketchatSocket.send(JSON.stringify(SEND_MESSAGE_REQUEST));
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('sendMessage', { ACA_ERROR });
    }
  }

  async disconnect(): Promise<any> {

    logger.info('Rocketchat socket disconnect');
    try {
      this.chatServerSessionProvider = undefined;
      if (
        this.rocketchatSocket
      ) {
        await this.rocketchatSocket.close();
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('disconnect', { ACA_ERROR });
    }
  }

  async handleClientSideDisconnect(): Promise<any> {

    try {
      await this.disconnect();
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('handleClientSideDisconnect', { ACA_ERROR });
    }
  }

  async sendUserTyping(status: any): Promise<any> { }

  subscribeToChatEvents(session) {

    this.rocketchatSocket.on('open', async () => {
      try {
        await connectUserToChat(this, session);
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('subscribeToChatEvents:onOpen', { ACA_ERROR });
      }
    });

    this.rocketchatSocket.onmessage = async (event) => {
      try {
        const PARSED_RESPONSE = JSON.parse(event?.data);
        await processMessage(this, PARSED_RESPONSE);
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('subscribeToChatEvents:onmessage', { ACA_ERROR });
      }

    }
  }

  __session() {
    const RET_VAL = this?.chatServerSessionProvider?.session;
    return RET_VAL;
  }



}

export {
  ChatChannelV1Rocketchat
};
