/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnDestroy, OnInit, HostListener } from '@angular/core';

import {
  LocalStorageServiceV1
} from 'client-services';

import {
  CHAT_APP_BUTTON_EVENT,
  _debugX,
  _errorX,
} from 'client-utils';

import {
  ChatAppButtonService,
  HTMLDependenciesServiceV1,
  StylesService,
  WindowEventsServiceV1
} from './services';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

@Component({
  selector: 'aca-wbc-chat-app-button',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {

  static getClassName() {
    return 'AppComponent';
  }

  static getElementTag() {
    return 'aca-wbc-chat-app-button';
  }

  static getWbcId() {
    return 'aca-wbc-chat-app-button';
  }

  @Input('wbcChatAppButtonOptions') public wbcChatAppButtonOptions;

  @HostListener('window:message', ['$event'])
  handleWindowMessageEvent(event) {
    switch (event?.data?.type) {
      case CHAT_APP_BUTTON_EVENT.SHOW_BUTTON:
        this.onChatButtonShow(event);
        break;
      case CHAT_APP_BUTTON_EVENT.CHAT_APP_CLIENT_READY:
        this.onChatAppReady(event);
        break;
    }
  }

  title = 'aca-wbc-chat-app-button';
  icons: any = {};

  constructor(
    public chatAppButtonService: ChatAppButtonService,
    private localStorageService: LocalStorageServiceV1,
    private htmlDependenciesService: HTMLDependenciesServiceV1,
    private stylesService: StylesService,
    private windowEventsService: WindowEventsServiceV1,
  ) { }

  ngOnInit(): void {
    this.chatAppButtonService.reloadWbcChatAppButtonOptions(this.wbcChatAppButtonOptions);
    this.loadHTMLDependencies();
  }

  ngOnDestroy(): void { }

  isReady() {
    const CSS_LOADED: boolean = this.htmlDependenciesService.idLoadedCSSDependency(`${AppComponent.getWbcId()}`);
    const CUSTOM_CSS_LOADED: boolean = this.stylesService.isCustomCssLoaded();
    const BUTTON_OPTIONS_ENGAGEMENT_LOADED: boolean = this.chatAppButtonService.isWbcChatAppButtonOptionsLoaded();
    const RET_VAL: boolean = CSS_LOADED && CUSTOM_CSS_LOADED && BUTTON_OPTIONS_ENGAGEMENT_LOADED;
    return RET_VAL;
  }

  isShown() {
    const RET_VAL = this.chatAppButtonService.getWbcChatAppButtonOptions()?.show;
    return RET_VAL;
  }

  onChatButtonShow(event) {
    _debugX(AppComponent.getClassName(), 'handleWindowMessageEvent', { event });
    this.localStorageService.setWbcChatAppButtonStateParameter('show', event?.data?.data);
    this.localStorageService.setWbcChatAppButtonStateParameter('chatOpened', !event?.data?.data);
  }

  onChatAppReady(event) {
    const IS_CHAT_OPENED = this.chatAppButtonService.getWbcChatAppButtonOptions()?.chatOpened;
    _debugX(AppComponent.getClassName(), 'handleWindowMessageEvent', { event, IS_CHAT_OPENED });
    if (IS_CHAT_OPENED) {
      this.windowEventsService.broadcastChatAppClientOpenEvent();
    }
  }

  private async loadHTMLDependencies() {
    this.htmlDependenciesService.loadCSSDependencies();
  }

}
