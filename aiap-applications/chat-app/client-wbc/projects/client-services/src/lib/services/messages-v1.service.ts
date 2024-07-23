/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX,
  ATTACHMENT_TYPES
} from 'client-utils';

import {
  SessionServiceV1,
} from '.';

@Injectable()
export class MessagesServiceV1 {

  private conversationMessages = [];

  constructor(
    private sessionService: SessionServiceV1,
  ) { }


  public addMessageToConvesation(message) {
    this.conversationMessages.push(message);
  }

  public replaceMessageInConversation(message, index) {
    this.conversationMessages[index] = message;
  }

  public removeMessage(message) {
    const INDEX = this.conversationMessages.indexOf(message);
    if (INDEX !== -1) {
      this.conversationMessages.splice(INDEX, 1);
    }
  }

  isContentEnabled(index: number, type: string): boolean {
    if (
      this.isContextRestoreForActionTypeEnabled(type)
    ) {
      return true;
    }
    const CONV_MESSAGE_LENGTH = this.conversationMessages.length;

    const FIRST_MESSAGE_PI_MODAL = CONV_MESSAGE_LENGTH === 2 &&
      index === 1 &&
      this.conversationMessages[index - 1]?.message?.attachment?.type === ATTACHMENT_TYPES.PI_AGREEMENT_MODAL;

    return CONV_MESSAGE_LENGTH - 1 <= index || FIRST_MESSAGE_PI_MODAL;
  }

  isContextRestoreForActionTypeEnabled(type: string): boolean {
    let retVal = false;
    const SESSION = this.sessionService.getSession();
    const CONTEXT_RESTORE_ENABLED = SESSION?.engagement?.chatApp?.contextRestore?.enabled;
    const CONTEXT_RESTORE_ACTION_TYPE_ENABLED = SESSION?.engagement?.chatApp?.contextRestore?.actions[type];
    if (
      CONTEXT_RESTORE_ENABLED &&
      CONTEXT_RESTORE_ACTION_TYPE_ENABLED
    ) {
      retVal = true;
    }
    return retVal;
  }

  public checkForMessageSender(message: any, isTranscript: boolean = false): boolean {
    const SENDERS = ['bot', 'user', 'agent'];
    const MESSAGE_TYPE = message?.type;
    if (isTranscript) {
      SENDERS.push('system');
    }
    return SENDERS.includes(MESSAGE_TYPE);
  }


  public isLastOfType(index: number): boolean {
    let retVal = index === this.conversationMessages.length - 1;
    retVal ||= this.conversationMessages[index]?.message?.type !== this.conversationMessages[index + 1]?.message?.type;

    return retVal;
  }

  isLastMessage(index: number): boolean {
    if (index === this.conversationMessages.length - 1) {
      return true;
    }
    return false;
  }
}
