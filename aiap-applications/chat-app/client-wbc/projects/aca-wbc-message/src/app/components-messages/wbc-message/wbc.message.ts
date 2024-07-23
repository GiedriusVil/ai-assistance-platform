/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnDestroy, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { _debugX } from 'client-utils';

import {
  MessagesServiceV1,
  AttachmentsServiceV1,
  SessionServiceV1
} from 'client-services';

@Component({
  selector: 'aca-chat-wbc-message',
  templateUrl: './wbc.message.html',
  styleUrls: ['./wbc.message.scss'],
})
export class WbcMessage implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'WbcMessage';
  }

  private _destroyed$: Subject<void> = new Subject();

  @Input() message: any;
  @Input() index: any;

  @Output() userActionEvent = new EventEmitter<any>();

  iconsEnabled = false;

  constructor(
    public attachmentsService: AttachmentsServiceV1,
    public messagesService: MessagesServiceV1,
    private sessionService: SessionServiceV1,
  ) { }

  ngOnInit(): void {
    _debugX(WbcMessage.getClassName(), 'ngOnInit', { this_message: this.message });

    const SESSION = this.sessionService.getSession();
    this.iconsEnabled = SESSION?.engagement?.chatApp?.messages?.icons?.enabled ?? false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    _debugX(WbcMessage.getClassName(), 'ngOnChanges', { changes: changes });
  }

  ngAfterViewInit(): void {
    _debugX(WbcMessage.getClassName(), 'ngAfterViewInit', { this_message: this.message });
  }

  ngOnDestroy(): void {
    _debugX(WbcMessage.getClassName(), 'ngOnDestroy', { this_message: this.message });
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  handleUserActionEvent(event: any) {
    this.userActionEvent.emit(event);
  }

  //TEMP FUCTION UNTIL FULLY MOVED TO WBC MESSAGE STRUCTURE
  isWbcTable(type) {
    return type === "aca-wbc-table";
  }

  hasText(message: any): boolean {
    let retVal = false;
    if (
      message.text &&
      message.text.trim().length > 0
    ) {
      retVal = true;
    }
    return retVal;
  }

  applyStyle(message: any) {
    const TYPE = ramda.pathOr(undefined, ['attachment', 'type'], message);
    if (TYPE === 'styling') {
      const attributes = ramda.pathOr(undefined, ['attachment', 'payload'], message);
      if (attributes) return attributes;
    }
  }

  botOrUserIcon(type: string): string {
    if (type === 'bot') {
      return 'persona-icon icon--bot';
    } else if (type === 'user') {
      return 'persona-icon icon--user';
    } else {
      return 'persona-icon icon--agent';
    }
  }

}
