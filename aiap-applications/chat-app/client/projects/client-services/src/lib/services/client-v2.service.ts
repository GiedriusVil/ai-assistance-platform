/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { _debugX, _errorX, Methods } from "client-utils";

import {
  StorageServiceV2,
  BotSocketIoServiceV2,
  ZendeskLiveAgentServiceV2,
  ChatWidgetServiceV1,
  EventsServiceV1,
} from '.';

const CHANNEL = {
  DEFAULT: 'default',
  SOCKETIO: 'socketio',
  ZENDESK: 'zen_desk',
  GENESYS: 'genesys',
  TELIA: 'telia',
};

@Injectable()
export class ClientServiceV2 {

  conversationID: any;

  static getClassName() {
    return 'ClientServiceV2';
  }

  constructor(
    private router: Router,
    private eventsService: EventsServiceV1,
    private storageService: StorageServiceV2,
    private botSocketIoService: BotSocketIoServiceV2,
    private zendeskLiveAgentService: ZendeskLiveAgentServiceV2,
    private chatWidgetService: ChatWidgetServiceV1,
  ) { }

  connect() {
    try {
      const ACTIVE_CHANNEL: Methods = this.activeChannel();
      _debugX(ClientServiceV2.getClassName(), 'connect', { ACTIVE_CHANNEL });
      ACTIVE_CHANNEL.connect();
    } catch (error) {
      _errorX(ClientServiceV2.getClassName(), 'connect', { error });
      this.router.navigateByUrl('/system-error-view');
    }
  }

  private decodeJwtToken(token: string): any {
    return atob(token.split('.')[1]);
  }

  handleIncomingMessage(message: any) {
    this.conversationID = ramda.pathOr(message?.sender_action?.data?.conversationId, ['recipient', 'id'], message);
    const ACTIVE_CHANNEL: Methods = this.activeChannel();
    _debugX(ClientServiceV2.getClassName(), 'handleIncomingMessage', {
      message: message,
      activeChannel: ACTIVE_CHANNEL,
    });
    ACTIVE_CHANNEL.handleIncomingMessage(message);
  }

  disconnectChat() {
    const ACTIVE_CHANNEL: Methods = this.activeChannel();
    _debugX(ClientServiceV2.getClassName(), 'disconnectChat', {
      ACTIVE_CHANNEL: ACTIVE_CHANNEL
    });
    ACTIVE_CHANNEL.disconnectChat();
  }

  disconnectFromWidget() {
    const ACTIVE_CHANNEL: Methods = this.activeChannel();
    _debugX(ClientServiceV2.getClassName(), 'disconnectFromWidget', {
      ACTIVE_CHANNEL: ACTIVE_CHANNEL
    });
    this.storageService.clearAll();
    ACTIVE_CHANNEL.disconnectFromWidget();
    this.chatWidgetService.broadcast(ChatWidgetServiceV1.EVENT.CHAT_WINDOW_CLOSE, true);
  }

  public postMessage(message: any) {
    const ACTIVE_CHANNEL: Methods = this.activeChannel();
    _debugX(ClientServiceV2.getClassName(), 'postMessage', {
      ACTIVE_CHANNEL: ACTIVE_CHANNEL
    });
    ACTIVE_CHANNEL.postMessage(message);
  }

  public postAudioMessage(audioMessage: Blob) {
    const ACTIVE_CHANNEL: Methods = this.activeChannel();
    ACTIVE_CHANNEL.postAudioMessage(audioMessage);
  }

  isDefaultBotChannelActive(): boolean {
    let retVal = 'default' === this.activeChannelId();
    return retVal;
  }

  handleUserTyping(isUserTyping: boolean) {
    const ACTIVE_CHANNEL_ID = this.activeChannelId();
    switch (ACTIVE_CHANNEL_ID) {
      case CHANNEL.GENESYS:
      case CHANNEL.TELIA:
        this.botSocketIoService.handleUserTyping(isUserTyping);
        break;
    }
  }

  private activeChannelId(): string {
    let retVal = 'default';
    const JWT_TOKEN_ENCODED = this.storageService.getConversationToken();
    if (
      !lodash.isEmpty(JWT_TOKEN_ENCODED)
    ) {
      const JWT_TOKEN_DECODED = JSON.parse(this.decodeJwtToken(JWT_TOKEN_ENCODED));
      const JWT_TOKEN_DECODED_CHANNEL_ID = JWT_TOKEN_DECODED.channel?.id;
      if (
        !lodash.isEmpty(JWT_TOKEN_DECODED_CHANNEL_ID)
      ) {
        retVal = JWT_TOKEN_DECODED_CHANNEL_ID;
      }
    }
    if (lodash.startsWith(retVal, CHANNEL.GENESYS)) {
      retVal = CHANNEL.GENESYS;
    }
    if (lodash.startsWith(retVal, CHANNEL.TELIA)) {
      retVal = CHANNEL.TELIA;
    }
    return retVal;
  }

  private activeChannel() {
    let retVal: any;
    const ACTIVE_CHANNEL_ID = this.activeChannelId();
    switch (ACTIVE_CHANNEL_ID) {
      case CHANNEL.ZENDESK:
        retVal = this.zendeskLiveAgentService;
        break;
      default:
        retVal = this.botSocketIoService;
        break;
    }
    return retVal;
  }

}
