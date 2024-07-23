/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, NgZone, OnInit, ViewChild } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { ActivatedRoute, Router } from '@angular/router';

import {
  IViewStateV1,
  _debugX,
  _errorX,
  retrieveViewWBCConfigurationFromSession
} from 'client-shared-utils';

import {
  EventsServiceV1,
  SessionServiceV1,
} from 'client-shared-services';

import {
  BaseView
} from 'client-shared-views';

@Component({
  selector: 'aiap-conversations-view-v1',
  templateUrl: './conversations.view-v1.html',
  styleUrls: ['./conversations.view-v1.scss']
})
export class ConversationsViewV1 extends BaseView implements OnInit {

  static getClassName() {
    return 'ConversationsViewV1';
  }

  _state: any = {
    activatedRoute: undefined,
    router: undefined,
    wbc: {
      host: undefined,
      path: undefined,
      tag: undefined,
    },
  }
  state = lodash.cloneDeep(this._state);

  _params = {};
  params = lodash.cloneDeep(this._params);

  constructor(
    private sessionService: SessionServiceV1,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadWBCView();
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  url() {
    const RET_VAL = this.state?.wbc?.host + this.state?.wbc?.path;
    return RET_VAL;
  }

  applicationLoadingText() {
    return `Waiting for application ${this.state?.wbc?.tag} to load from ${this.state?.wbc?.host}${this.state?.wbc?.path}!`;
  }

  loadWBCView() {
    try {
      const SESSION = this.sessionService.getSession();
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, ConversationsViewV1.getClassName());
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.wbc = WBC;
      STATE_NEW.activatedRoute = this.activatedRoute;
      STATE_NEW.router = this.router;
      STATE_NEW.ngZone = this.ngZone;
      _debugX(ConversationsViewV1.getClassName(), `loadConfiguration`, {
        STATE_NEW,
        SESSION,
        WBC,
      });
      this.state = STATE_NEW;
    } catch (error) {
      _errorX(ConversationsViewV1.getClassName(), 'loadConfiguration', { error });
      throw error;
    }
  }


  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'conversations-view-v1',
      children: [
        ...children,
        {
          path: '',
          component: ConversationsViewV1,
          data: {
            name: 'conversations_view_v1.name',
            component: ConversationsViewV1.getClassName(),
            description: 'conversations_view_v1.description',
            actions: [
              {
                name: 'conversations_view_v1.actions.view.name',
                component: 'conversations.view.view-transcript',
                description: 'conversations_view_v1.actions.view.description',
              },
              {
                name: 'conversations_view_v1.actions.delete.name',
                component: 'conversations.view.delete',
                description: 'conversations_view_v1.actions.delete.description',
              }
            ]
          }
        },
      ],
      data: {
        breadcrumb: 'conversations_view_v1.breadcrumb',
      }
    }
    return RET_VAL;
  }
}
