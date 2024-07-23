/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { Buffer } from 'buffer';

import { _debugX, _errorX, Methods } from "client-utils";

import {
  TmpErrorsServiceV1,
  StorageServiceV1,
  ZendeskLiveAgentServiceV1,
  BotSocketIoServiceV1,
  EventsServiceV1,
} from '.';

const CHANNEL = {
  DEFAULT: 'default',
  ZENDESK: 'zen_desk',
  GENESYS: 'genesys',
  TELIA: 'telia',
};

@Injectable()
export class ClientServiceV1 {

  conversationID: any;

  static getClassName() {
    return 'ClientServiceV1';
  }

  constructor(
    private router: Router,
    private eventsService: EventsServiceV1,
    private storageService: StorageServiceV1,
    private botSocketIoService: BotSocketIoServiceV1,
    private zendeskLiveAgentService: ZendeskLiveAgentServiceV1,
    private tmpErrorsService: TmpErrorsServiceV1,
  ) { }

  connect() {
    try {
      const ACTIVE_CHANNEL: Methods = this.activeChannel();
      _debugX(ClientServiceV1.getClassName(), 'connect', { ACTIVE_CHANNEL });
      ACTIVE_CHANNEL.connect();
    } catch (error) {
      _errorX(ClientServiceV1.getClassName(), 'connect', { error });
      this.tmpErrorsService.setSystemError(error);
      this.router.navigateByUrl('/system-error-view');
    }
  }

  private decodeJwtToken(token: string): any {
    try {
      if (lodash.isNil(token)) {
        const ACA_ERROR = {
          type: 'VALIDATION_ERROR',
          message: `Missing token parameter!`,
          token: token
        };
        throw ACA_ERROR;
      }
      if (!lodash.isString(token)) {
        const ACA_ERROR = {
          type: 'VALIDATION_ERROR',
          message: `Provided token is not string!`,
          token: token
        };
        throw ACA_ERROR;
      }
      const TOKEN_PARTS = token.split('.');
      if (TOKEN_PARTS.length !== 3) {
        const ACA_ERROR = {
          type: 'VALIDATION_ERROR',
          message: `Provided token is not JWT!`,
          token: token
        };
        throw ACA_ERROR;
      }
      const TOKEN_BODY = TOKEN_PARTS[1];
      const RET_VAL = Buffer.from(TOKEN_BODY, 'base64').toString('utf-8');
      return RET_VAL;
    } catch (error) {
      _errorX(ClientServiceV1.getClassName(), 'decodeJwtToken', { error });
    }
  }

  handleIncomingMessage(message: any) {
    this.conversationID = ramda.pathOr(message?.sender_action?.data?.conversationId, ['recipient', 'id'], message);
    const ACTIVE_CHANNEL: Methods = this.activeChannel();
    _debugX(ClientServiceV1.getClassName(), 'handleIncomingMessage', {
      message: message,
      activeChannel: ACTIVE_CHANNEL,
    });
    ACTIVE_CHANNEL.handleIncomingMessage(message);
  }

  disconnectChat() {
    const ACTIVE_CHANNEL: Methods = this.activeChannel();
    _debugX(ClientServiceV1.getClassName(), 'disconnectChat', {
      ACTIVE_CHANNEL: ACTIVE_CHANNEL
    });
    ACTIVE_CHANNEL.disconnectChat();
  }

  disconnectFromWidget() {
    const ACTIVE_CHANNEL: Methods = this.activeChannel();
    _debugX(ClientServiceV1.getClassName(), 'disconnectFromWidget', {
      ACTIVE_CHANNEL: ACTIVE_CHANNEL
    });
    this.storageService.clearAll();
    ACTIVE_CHANNEL.disconnectFromWidget();

    setTimeout(() => {
      // SAST_FIX ['postMessage']
      window.parent['postMessage']({ type: 'onWidgetClose' }, '*')
    }, 0);
  }

  public postMessage(message: any) {
    const ACTIVE_CHANNEL: Methods = this.activeChannel();
    _debugX(ClientServiceV1.getClassName(), 'postMessage', {
      ACTIVE_CHANNEL: ACTIVE_CHANNEL
    });
    ACTIVE_CHANNEL.postMessage(message);
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

  isDefaultBotChannelActive(): boolean {
    let retVal = 'default' === this.activeChannelId();
    return retVal;
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
