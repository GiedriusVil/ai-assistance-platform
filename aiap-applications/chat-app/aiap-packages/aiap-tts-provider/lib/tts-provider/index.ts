/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-tts-provider-tts-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
import EventEmitter from 'events';

import {
  ITTSServiceV1,
  IChatMessageV1
} from '@ibm-aiap/aiap-chat-app--types';

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

class AIAPTTSProvider extends EventEmitter {
  rooms: Map<any, any>;

  constructor() {
    super();
    this.on('message', this.handleIncomingMessage);
    this.rooms = new Map();
  }

  joinRoom(room, listener): void {
    if (this.rooms.has(room)) {
      this.removeAllListeners(room);
      this.rooms.delete(room);
    }
    this.rooms.set(room, new Set());
    const LISTENERS = this.rooms.get(room);
    LISTENERS.add(listener);
    this.on(room, listener);
  }

  unsubscribe(room): void {
    this.removeAllListeners(room);
    this.rooms.delete(room);
  }

  emitToRoom(room, event, ...args): void {
    if (this.rooms.has(room)) {
      this.emit(room, event, ...args);
    }
  }

  async handleIncomingMessage(
    message: IChatMessageV1
  ): Promise<void> { }

  init(
    ttsService: ITTSServiceV1
  ): void { }
  

}

export{
  AIAPTTSProvider,
}
