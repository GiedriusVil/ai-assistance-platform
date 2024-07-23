/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { _debugX } from 'client-utils';
import { ConfigsServiceV1, MessagesServiceV1, SessionServiceV1 } from 'client-services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'aca-chat-wbc-attachment',
  templateUrl: './wbc.attachment.html',
  styleUrls: ['./wbc.attachment.scss'],
})
export class WbcAttachment implements OnInit, AfterViewInit, OnDestroy {

  static getClassName() {
    return 'WbcAttachment';
  }

  private _destroyed$: Subject<void> = new Subject();

  @Input() message: any;
  @Input() index: any;

  @Output() userActionEvent = new EventEmitter<any>();

  state = {
    component: null,
    configs: {
      host: null,
      path: null,
      language: null,
      isTranscript: null
    }
  }

  session: any;

  constructor(
    public messagesService: MessagesServiceV1,
    public translateService: TranslateService,
    public sessionService: SessionServiceV1,
    private configsService: ConfigsServiceV1,
  ) { }

  ngOnInit(): void {
    this.state.component = this.message?.attachment?.type;
    this.state.configs.host = this.message?.attachment?.host;
    this.state.configs.path = this.message?.attachment?.path;
    this.state.configs.language = this.translateService.currentLang;
    this.state.configs.isTranscript = this.configsService.isTranscript();

    this.session = this.sessionService.getSession();

    _debugX(WbcAttachment.getClassName(), `ngOnInit`, {
      this_state: this.state,
      this_message: this.message,
    });
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit(): void {
    _debugX(WbcAttachment.getClassName(), `ngAfterViewInit`, {
      this_state: this.state,
      this_message: this.message
    });
  }

  url() {
    return this.state.configs.host + this.state.configs.path;
  }

  isWbcTable(type) {
    return type === "aca-wbc-table";
  }

  handleWbcEvent(event: any): void {
    _debugX(WbcAttachment.getClassName(), `handleWbcEvent`, {
      event
    });
    const EVENT = ramda.path(['detail'], event);
    this.userActionEvent.emit(EVENT);
  }

}
