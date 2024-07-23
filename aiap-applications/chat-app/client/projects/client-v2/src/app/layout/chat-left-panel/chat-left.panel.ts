/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import * as lodash from 'lodash';

import {
  EventsServiceV1,
  StorageServiceV2,
  ClientServiceV2,
} from "client-services";

import { _debugX } from "client-utils";

@Component({
  selector: 'aca-chat-left-panel',
  templateUrl: './chat-left.panel.html',
  styleUrls: ['./chat-left.panel.scss'],
})
export class ChatLeftPanel implements OnInit, OnDestroy {
  static getClassName() {
    return 'ChatLeftPanel';
  }

  static getHTMLTagName() {
    const RET_VAL = 'aca-chat-left-panel';
    return RET_VAL;
  }

  private leftPanelSubscription: Subscription;

  _components: any[] = [];

  set components(components: any[]) {
    components.forEach((component) => {
      this.mergeDefaultAndLanguageParams(component);
      this.setConfigObject(component);
    });
    this._components = components;
  }

  state: any = {
    errorMessage: 'Error occured while loading component!',
  };

  constructor(
    private clientService: ClientServiceV2,
    private eventsService: EventsServiceV1,
    private storageService: StorageServiceV2,
    private translateService: TranslateService
  ) { }

  ngOnDestroy(): void {
    this.leftPanelSubscription.unsubscribe();
  }

  ngOnInit() {
    this.components = this.storageService.getLeftPanel();
    this.subscribeToEvents();
  }

  url(component) {
    return component.host + component.path;
  }

  handleUserActionEvent(event: any): void {
    const EVENT_DETAIL = event?.detail;
    const EVENT_TYPE = EVENT_DETAIL?.type;
    const EVENT_DATA = EVENT_DETAIL?.data;
    switch (EVENT_TYPE) {
      case 'POST_MESSAGE':
        this.clientService.postMessage(EVENT_DATA);
        break;
      default:
        break;
    }
  }

  mergeDefaultAndLanguageParams(component) {
    const APP_LANG = this.translateService.getDefaultLang();
    const PARAMS = lodash.merge(
      component.params,
      component[`params-${APP_LANG}`]
    );

    component.params = PARAMS;
  }

  setConfigObject(component) {
    const CONFIG_OBJ = this.createConfigObject(component);
    component.configs = CONFIG_OBJ;
  }

  createConfigObject(component) {
    const RET_VAL = {
      host: component.host,
      path: component.path,
      language: this.translateService.getDefaultLang(),
    };
    return RET_VAL;
  }

  private subscribeToEvents() {
    this.leftPanelSubscription = this.eventsService.leftPanelEmitter.subscribe(
      (event) => {
        if (event?.leftPanelStateChange) {
          this.components = this.storageService.getLeftPanel();
        }
      }
    );
  }

  getItemTracker(index: number, item: any) {
    return JSON.stringify(item);
  }
}
