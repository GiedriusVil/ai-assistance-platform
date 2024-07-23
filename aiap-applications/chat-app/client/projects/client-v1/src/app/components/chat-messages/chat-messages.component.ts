/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { _debugX } from "client-utils";

import { SessionServiceV1 } from "client-services";

@Component({
  selector: 'aca-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.scss'],
})
export class ChatMessagesComponent implements OnInit, AfterViewInit, OnDestroy {

  static getClassName() {
    return 'ChatMessagesComponent';
  }

  private _destroyed$: Subject<void> = new Subject();

  @Input() messages: any;

  @Output() userActionEvent = new EventEmitter<any>();

  session: any;
  configs: any;

  constructor(
    private sessionService: SessionServiceV1
  ) { }

  trackByFn(index: number, item: any): number {
    return index;
  }

  handleUserActionEvent(event) {
    this.userActionEvent.emit(event.detail);
  }

  isWbcMessage(message) {
    return ramda.pathOr(false, ['isWbc'], message);
  }

  ngOnInit(): void {
    _debugX(ChatMessagesComponent.getClassName(), 'ngOnInit', { this_message: this.messages });

    this.session = this.sessionService.getSession();
  }

  ngAfterViewInit(): void {
    _debugX(ChatMessagesComponent.getClassName(), 'ngAfterViewInit', { this_message: this.messages });
  }

  ngOnDestroy(): void {
    _debugX(ChatMessagesComponent.getClassName(), 'ngOnDestroy', { this_message: this.messages });
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
