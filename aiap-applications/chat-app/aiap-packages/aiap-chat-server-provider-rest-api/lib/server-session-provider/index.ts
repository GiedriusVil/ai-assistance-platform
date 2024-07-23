/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-rest-server-session-provider-chat-rest-session-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);


import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  ChatChannelV1,
  ChatServerV1SessionProvider,
  IChatChannelV1Configuration,
  IChatMessageV1
} from '@ibm-aiap/aiap-chat-app--types';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  getChannelBySessionProviderAndChannelId
} from '@ibm-aiap/aiap-chat-channel-provider';

import {
  retrieveStoredSession as retrieveStoredSession,
  storeSession as storeSession,
  deleteSession as deleteSessionFromMemoryStore,
  refreshToken as refreshToken,
} from '@ibm-aca/aca-utils-session';

import { authorizationService } from '@ibm-aiap/aiap-authorization-service';

import {
  getMemoryStore
} from '@ibm-aiap/aiap-memory-store-provider';

import {
  _startChat
} from './start-chat';

import {
  _continueChat
} from './continue-chat';

import {
  _handleIncomingMessageEvent
} from './handle-event-incoming-message';

import {
  _sendOutgoingMessage
} from './send-outgoing-message';

import {
  AiapChatRestV1Server
} from '../server'

import {
  transformMessagesStack
} from '../utils';

class ChatRestV1SessionProvider extends ChatServerV1SessionProvider<AiapChatRestV1Server, ChatChannelV1<IChatChannelV1Configuration>>  {

  tenantId: string;
  assistantId: string;
  engagementId: string;
  conversationId: string;
  gAcaProps: any;
  session: any;
  channel: any;
  sessionTime: any;
  retrieveMessageInterval: any;
  userId: any;


  static async getInstance(params) {

    try {
      const RET_VAL = new ChatRestV1SessionProvider(params, {});
      await RET_VAL.init();
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(`getInstance`, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  constructor(configuration, socket) {
    super(configuration, socket)
    const TENANT_ID = configuration?.tenantId;
    const ASSISTANT_ID = configuration?.assistantId;
    const ENGAGEMENT_ID = configuration?.engagementId;
    const USER_ID = configuration?.userId;

    try {
      if (
        lodash.isEmpty(TENANT_ID)
      ) {
        const MESSAGE = `Missing required configuration.tenantId parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }
      if (
        lodash.isEmpty(ASSISTANT_ID)
      ) {
        const MESSAGE = `Missing required configuration.assistantId parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }
      if (
        lodash.isEmpty(ENGAGEMENT_ID)
      ) {
        const MESSAGE = `Missing required configuration.engagementId parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }
      if (
        lodash.isEmpty(USER_ID)
      ) {
        const MESSAGE = `Missing required configuration.userId parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }
      this.tenantId = TENANT_ID;
      this.assistantId = ASSISTANT_ID;
      this.engagementId = ENGAGEMENT_ID;
      this.userId = USER_ID;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(`constructor`, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async init(): Promise<any> {
    let hasToStartChat = false;
    try {
      this._initialiseGAcaProps();
      logger.info('initialise', { this_gAcaProps: this.gAcaProps });
      this.session = await authorizationService.authorize({ gAcaProps: this.gAcaProps });
      this.conversationId = this.session?.conversation?.id;
      if (
        lodash.isEmpty(this?.session?.channel?.id)
      ) {
        hasToStartChat = true;
        this.__assignDefaultChatChannelId();
      }

      this.channel = getChannelBySessionProviderAndChannelId(this, this.session?.channel?.id);

      logger.debug(this.init.name, {
        this_channel_type: this?.channel?.type
      });

      if (
        hasToStartChat
      ) {
        await this.startChat();
      } else {
        await this.continueChat();
      }

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.init.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async retrieveSession() {
    const PARAMS = {
      conversation: {
        id: this.conversationId
      }
    };
    const STORED_SESSION = await retrieveStoredSession(PARAMS);
    if (
      lodash.isEmpty(STORED_SESSION)
    ) {
      const MESSAGE = `No authorized session found!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.AUTHORIZATION_ERROR, MESSAGE);
    }
    this.session = STORED_SESSION;
  }

  async deleteSession() {
    const PROVIDER_CONVERSATION_ID = this.conversationId;

    try {
      if (
        this.session
      ) {
        logger.debug('deleteSession', { this_session: this.session });
        await deleteSessionFromMemoryStore(this.session);
        delete this.session;
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { PROVIDER_CONVERSATION_ID });
      logger.error('disconnect', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  _initialiseGAcaProps() {

    const G_ACA_PROPS = {
      tenantId: this.tenantId,
      assistantId: this.assistantId,
      engagementId: this.engagementId,
      isoLang: 'en', // We need to fix this!
    };

    this.gAcaProps = G_ACA_PROPS;
  }

  handleEventDisconnect(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  handleEventIncomingMessage(message: IChatMessageV1): Promise<any> {
    throw new Error('Method not implemented.');
  }
  handleEventTransferToBot(message: IChatMessageV1): Promise<any> {
    throw new Error('Method not implemented.');
  }
  handleEventTransfer(message: IChatMessageV1): Promise<any> {
    throw new Error('Method not implemented.');
  }
  sendOutgoingMessageAcaDebug(moduleId: string, data: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  sendOutgoingMessageAcaError(moduleId: string, error: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async startChat() {
    await _startChat(this);
  }

  async continueChat() {
    await _continueChat(this);
  }

  async handleIncomingMessageEvent(message) {
    await _handleIncomingMessageEvent(this, message);
  }

  async handleTransferOnClientSideEvent(message) {

    logger.debug('handleTransferOnClientSideEvent', { message });
  }

  async handleTransferToBot(message) {
    logger.debug('handleTransferToBot', { message });
  }

  async checkForAvailableMessages() {
    const CONVERSATION_ID = this.conversationId;
    const SESSION_STORE = getMemoryStore();
    let retVal = [];
    try {
      if (
        lodash.isEmpty(CONVERSATION_ID)
      ) {
        const MESSAGE = `Missing required conversation.id attribute!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
      }
      let messagesStack = await SESSION_STORE.getData('MESSAGE_STACK_' + CONVERSATION_ID);
      if (!messagesStack.messages) {
        messagesStack.messages = [];
      }
      if (!lodash.isEmpty(messagesStack.messages)) {

        let messagesArray = transformMessagesStack(messagesStack);
        messagesStack.messages = [];
        await SESSION_STORE.setData('MESSAGE_STACK_' + CONVERSATION_ID, messagesStack);
        retVal = messagesArray;
      }

      return retVal;

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { CONVERSATION_ID });
      logger.error(this.checkForAvailableMessages.name, { ACA_ERROR });
      throw ACA_ERROR;
    }

  }

  async sendOutgoingMessage(message) {
    await _sendOutgoingMessage(this, message);
  }

  setRetrieveMessageInterval(interval) {
    this.retrieveMessageInterval = interval;
  }

  clearRetrieveMessageInterval() {
    clearInterval(this.retrieveMessageInterval);
    this.retrieveMessageInterval = null;
  }


  async disconnect(reason = undefined) {
    const PROVIDER_CONVERSATION_ID = this.conversationId;

    try {
      await this.disconnectFromChannel();
      await this.deleteSession();
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { PROVIDER_CONVERSATION_ID, reason });
      logger.error('disconnect', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async disconnectFromChannel() {
    const PROVIDER_CONVERSATION_ID = this.conversationId;

    try {
      if (
        this.channel
      ) {
        await this.channel.disconnect();
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { PROVIDER_CONVERSATION_ID });
      logger.error('disconnectFromChannel', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

}

export {
  ChatRestV1SessionProvider,
}
