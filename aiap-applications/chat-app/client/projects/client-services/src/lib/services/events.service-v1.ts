/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable()
export class EventsServiceV1 {

  public eventsEmitter: Subject<any> = new Subject<any>();
  public messagesEmitter: Subject<any> = new Subject<any>();
  public sessionEmitter: Subject<any> = new Subject<any>();
  public leftPanelEmitter: Subject<any> = new Subject<any>();

  constructor() { }

  eventEmit(value: any) {
    this.eventsEmitter.next(value);
    // onWidgetResize
    // onWidgetClose
    // onFooterResize
    // onSurveyShow
    // onPreChatShow
    // onAudioPlay
    // onClientConnect
    // onInputDisable
    // onBotTyping
    // onSessionEnded
    // onConversationRestore
    // onConversationSave
    // onInputFocus
    // onInitialMaximize
    // onPiAgreement
  }

  messageEmit(value: any) {
    this.messagesEmitter.next(value);
  }

  sessionEmit(session: any) {
    this.sessionEmitter.next(session);
  }

  leftPanelEmit(value: any) {
    this.leftPanelEmitter.next(value);
  }

}
