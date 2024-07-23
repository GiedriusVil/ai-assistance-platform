/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnInit, } from '@angular/core';
import { Subject } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  BaseView
} from 'client-shared-views';

import {
  OUTLETS,
} from 'client-utils';

@Component({
  selector: 'aca-chat-widget-test-view-view',
  templateUrl: './chat-widget-test.view.html',
  styleUrls: ['./chat-widget-test.view.scss']
})
export class ChatWidgetTestView extends BaseView implements OnInit, AfterViewInit {

  static getClassName() {
    return 'ChatWidgetTestView';
  }

  outlet = OUTLETS.tenantCustomizer;

  _state = {
    hostname: undefined,
    language: undefined,
    tenantId: undefined,
    engagementId: undefined,
    assistantId: undefined,
    accessToken: undefined
  };
  state = lodash.cloneDeep(this._state);

  constructor() {
    super();
  }


  ngOnInit() { }

  ngAfterViewInit() { }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  setAccessTokenToLocalStorage(accessToken) {
    window.localStorage.setItem('access_token', accessToken);
  }

  handleReloadChatWidgetClickEvent(event: any) {
    _debugX(ChatWidgetTestView.getClassName(), `handleCatalogViewEvent`, { event });
    const NEW_STATE = lodash.cloneDeep(this.state);
    if (NEW_STATE.accessToken) {
      this.setAccessTokenToLocalStorage(NEW_STATE.accessToken);
    }
    this.state = NEW_STATE;
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'chat-widget-test-view',
      children: [
        ...children,
        {
          path: '',
          component: ChatWidgetTestView,
          data: {
            breadcrumb: 'Test Chat Widget',
            name: 'Test Chat Widget',
            component: ChatWidgetTestView.getClassName(),
            actions: []
          }
        }
      ],
      data: {
        breadcrumb: 'Chat Widget Test View',
      }
    };
    return RET_VAL;
  }
}
