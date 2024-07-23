/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { ChatWidgetServiceV1, HTMLDependenciesServiceV1 } from 'client-services';
import { _debugX } from 'client-utils';

@Component({
  selector: 'aca-wbc-accordion',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  static getElementTag() {
    return 'aca-wbc-accordion';
  }

  title = 'aca-wbc-accordion';

  @Input() state: any;

  @Input() message: any;

  @Output() onWbcEvent = new EventEmitter<any>();

  _state = {
    attributes: [],
    content: {
      enabled: true
    },
  }

  constructor(
    private chatWidgetService: ChatWidgetServiceV1,
    private htmlDependenciesService: HTMLDependenciesServiceV1,
  ) { }

  ngOnInit(): void {
    this.loadHTMLDependencies();
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

  handleAnswerBtnClickEvent(text: string) {
    if (!this._state.content.enabled) {
      return;
    }
    const MESSAGE: any = {
      type: 'user',
      text: text,
      timestamp: new Date().getTime()
    }
    const EVENT = {
      type: 'POST_MESSAGE',
      data: MESSAGE
    }
    _debugX(AppComponent.getElementTag(), 'handleUserSelection', {
      this_state: this._state,
      event: EVENT
    });
    this.onWbcEvent.emit(EVENT);
    this._state.content.enabled = false;
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
