/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { _debugX, LANGUAGE } from 'client-utils';

import {
  ChatWidgetServiceV1,
  ConfigsServiceV1,
  HTMLDependenciesServiceV1,
  SessionServiceV1,
} from 'client-services';

@Component({
  selector: 'aca-wbc-mult-response',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  static getClassName() {
    return 'AppComponent';
  }

  static getElementTag() {
    return 'aca-wbc-mult-response';
  }

  @Input() set configs(configs: any) {
    this.configsService.parseConfigs(configs);
    this.translateService.use(this.configsService.getLanguage());
  }

  @Input() set session(session: any) {
    this.sessionService.setSession(session);
  }

  @Input() state: any;
  @Input() message: any;

  @Output() onWbcEvent = new EventEmitter<any>();

  title = 'aca-wbc-mult-response';

  // TODO [LEGO] We need to figure out -> how state is used? can we put it assetsUrl into state?
  assetsUrl: any;

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

  ngOnInit() {
    this.setAssetsUrl();
    this.loadHTMLDependencies();
  }

  setAssetsUrl() {
    const HOST_URL = this.chatWidgetService.getClientWbcHostUrl();
    this.assetsUrl = `${HOST_URL}/${AppComponent.getElementTag()}/assets`;
  }

  handleAnswerBtnClickEvent(text: string) {
    if (
      !this._state.content.enabled
    ) {
      return;
    }
    const MESSAGE: any = {
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
    const EVENT = {
      type: 'FEEDBACK',
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
    const CLIENT_WBC_URL = this.chatWidgetService.getClientWbcUrl();
    this.htmlDependenciesService.loadCSSDependency(this.elCSSLinkId(), `${CLIENT_WBC_URL}/${this.elCSSLinkId()}/styles.css`);
  }

}
