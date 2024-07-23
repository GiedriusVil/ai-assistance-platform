/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { _debugX, LANGUAGE } from 'client-utils';
import * as lodash from 'lodash';

import {
  ChatWidgetServiceV1,
  ConfigsServiceV1,
  HTMLDependenciesServiceV1,
  SessionServiceV1,
} from 'client-services';

@Component({
  selector: 'aca-wbc-mult-response-v2',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  static getClassName() {
    return 'AppComponent';
  }

  static getElementTag() {
    return 'aca-wbc-mult-response-v2';
  }

  @Input() state: any;
  @Input() message: any;

  @Output() onWbcEvent = new EventEmitter<any>();

  @Input() set configs(configs: any) {
    this.configsService.parseConfigs(configs);
    this.translateService.use(this.configsService.getLanguage());

    this.loadHTMLDependencies();
  }

  @Input() set session(session: any) {
    this.sessionService.setSession(session);
  }

  title = 'aca-wbc-mult-response-v2';

  _state = {
    attributes: [],
    content: {
      enabled: true
    },
  }

  constructor(
    private translateService: TranslateService,
    private chatWidgetService: ChatWidgetServiceV1,
    private htmlDependenciesService: HTMLDependenciesServiceV1,
    private configsService: ConfigsServiceV1,
    private sessionService: SessionServiceV1,
  ) { }

  ngOnInit() { }

  handleAnswerBtnClickEvent(text: string) {
    if (
      !this._state.content.enabled
    ) {
      return;
    }
    const MESSAGE = {
      type: 'user',
      text: text,
      timestamp: new Date().getTime()
    };
    const EVENT = {
      type: 'POST_MESSAGE',
      data: MESSAGE
    };
    _debugX(AppComponent.getElementTag(), 'handleUserSelection', {
      this_state: this._state,
      event: EVENT
    });
    this.onWbcEvent.emit(EVENT);
    this._state.content.enabled = false;
  }

  handleFeedbackClickEvent(data) {
    const feedbackScore = data?.feedback?.score;
    this.message.feedback = {
      feedbackScore: feedbackScore,
      type: 'feedback'
    }

    const EVENT = {
      type: "FEEDBACK",
      data: data
    };
    _debugX(AppComponent.getElementTag(), 'handleUserSelection', {
      this_state: this._state,
      event: EVENT
    });
    this.onWbcEvent.emit(EVENT);
  }

  getActiveClassNames() {
    let retVal = 'message--content w-100';
    if (
      !this._state.content.enabled
    ) {
      retVal = `${retVal} content--disabled`;
    }
    return retVal;
  }

  isReady() {
    const RET_VAL = this.htmlDependenciesService.idLoadedCSSDependency(this.elCSSLinkId());
    return RET_VAL;
  }

  private elCSSLinkId() {
    return AppComponent.getElementTag();
  }

  private async loadHTMLDependencies() {

    let clientWbcURL = this.chatWidgetService.getClientWbcUrl();

    if (clientWbcURL === '/client-wbc') {
      clientWbcURL = this.configsService.getHost() + "/client-wbc";
    }

    this.htmlDependenciesService.loadCSSDependency(this.elCSSLinkId(), `${clientWbcURL}/${this.elCSSLinkId()}/styles.css`);
  }

}
