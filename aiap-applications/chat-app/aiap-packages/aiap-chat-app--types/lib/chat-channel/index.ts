/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-app--types-chat-channel-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  IChatMessageV1,
} from '../chat-message';

import {
  IChatChannelV1Configuration,
} from '../chat-channel-configuration';

// import {
//   ChatServerV1,
// } from '../chat-server';

import {
  IChatServerSessionV1,
} from '../chat-server-session';

// import {
//   ChatServerV1SessionProvider,
// } from '../chat-server-session-provider'

abstract class ChatChannelV1<E extends IChatChannelV1Configuration> {

  id: string;
  type: string;

  chatServerSessionProvider: any;
  configuration: E;

  conversationId: string;
  conversationIdExternal: string;

  constructor(
    id: string,
    chatServerSessionProvider: any,
    configuration: E,
  ) {
    this.setId(id);
    this.setConfiguration(configuration);
    this.setChatServerSessionProvider(chatServerSessionProvider)
  }

  protected setId(id: string) {
    this.id = id;
  }

  protected setConfiguration(configuration: any) {
    this.configuration = configuration;
  }

  setChatServerSessionProvider(chatServerSessionProvider: any) {
    this.chatServerSessionProvider = chatServerSessionProvider;
  }

  __session(): IChatServerSessionV1 {
    const RET_VAL = this?.chatServerSessionProvider?.session;
    return RET_VAL;
  }

  __state() {
    const RET_VAL = ramda.path([this.id], this.__session()?.channel);
    return RET_VAL;
  }

  abstract startChat(
    session: IChatServerSessionV1,
    notify?: boolean,
  ): Promise<{
    conversationId: string,
    conversationIdExternal: string,
  }>;

  abstract continueChat(
    session: IChatServerSessionV1,
  ): Promise<{
    conversationId: string,
    conversationIdExternal: string,
  }>;

  abstract sendMessage(message: IChatMessageV1): Promise<any>;

  abstract disconnect(): Promise<any>;

  abstract handleClientSideDisconnect(): Promise<any>;

  abstract sendUserTyping(status: any): Promise<any>;
}

export {
  ChatChannelV1,
}
