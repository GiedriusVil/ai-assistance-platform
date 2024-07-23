/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  SENDER_ACTIONS,
  ATTACHMENT_TYPES,
} from 'client-utils';

@Component({
  selector: 'aca-chat-ai-service-suggestions-attachment',
  templateUrl: './ai-service-suggestions.attachment.html',
  styleUrls: ['./ai-service-suggestions.attachment.scss']
})
export class AiServiceSuggestionsAttachment implements OnInit, OnDestroy {

  static getClassName() {
    return 'AiServiceSuggestionsAttachment';
  }

  private _destroyed$: Subject<void> = new Subject();

  @Input() message;
  @Input() disabled: boolean;

  @Output() userActionEvent = new EventEmitter<any>();
  attachmentItems = [];
  type: ATTACHMENT_TYPES.AI_SERVICE_SUGGESTIONS | ATTACHMENT_TYPES.INTENT_SUGGESTIONS;

  constructor() { }

  ngOnInit(): void {
    switch (this.message?.attachment?.type) {
      case ATTACHMENT_TYPES.AI_SERVICE_SUGGESTIONS:
        this.type = ATTACHMENT_TYPES.AI_SERVICE_SUGGESTIONS;
        this.attachmentItems = this.message.attachment.aiServices;
        break;
      case ATTACHMENT_TYPES.INTENT_SUGGESTIONS:
        this.type = ATTACHMENT_TYPES.INTENT_SUGGESTIONS;
        this.attachmentItems = this.message.attachment.intents;
        break;
    }
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  handleButtonClickEvent(event: Event, item: any): void {
    _debugX(AiServiceSuggestionsAttachment.getClassName(), 'handleButtonClickEvent', { event, item });
    event.preventDefault();
    const EVENT = {
      type: 'POST_MESSAGE',
      data: {
        type: 'user',
        text: this.message?.attachment?.user?.text,
        sender_action: {
          ...item,
          type: this.type === ATTACHMENT_TYPES.INTENT_SUGGESTIONS ? SENDER_ACTIONS.INTENT_SELECTED : SENDER_ACTIONS.AI_SERVICE_SELECTED
        },
        timestamp: new Date().getTime()
      }
    };
    this.userActionEvent.emit(EVENT);
  }

}
