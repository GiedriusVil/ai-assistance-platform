/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit } from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
  retrieveViewWBCConfigurationFromSession,
} from 'client-shared-utils';

import {
  SessionServiceV1,
} from 'client-shared-services';

import {
  BaseView,
} from '../../base/base-view/base-view';

@Component({
  selector: 'aiap-live-analytics-view-v1',
  templateUrl: './live-analytics-view-v1.html',
  styleUrls: ['./live-analytics-view-v1.scss'],
})
export class LiveAnalyticsViewV1 extends BaseView implements OnInit, OnDestroy, OnInit {

  static getClassName() {
    return 'LiveAnalyticsViewV1';
  }

  _state = {
    component: undefined,
    configs: {
      host: undefined,
      path: undefined,
      dashboardRef: undefined,
    }
  }
  state = lodash.cloneDeep(this._state);

  constructor(
    private sessionService: SessionServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadWBCView();
  }

  ngOnDestroy(): void {
    this.superNgOnDestroy();
  }

  applicationLoadingText() {
    return `Waiting for application ${this.state?.component} to load from ${this.state?.configs?.host}${this.state?.configs?.path}!`;
  }

  loadWBCView() {
    try {
      const SESSION = this.sessionService.getSession();
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, LiveAnalyticsViewV1.getClassName());
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.component = WBC?.tag;
      STATE_NEW.configs.host = WBC?.host;
      STATE_NEW.configs.path = WBC?.path;
      STATE_NEW.configs.dashboardRef = WBC?.dashboardRef;
      _debugX(LiveAnalyticsViewV1.getClassName(), `loadConfiguration`, {
        STATE_NEW,
        SESSION,
        WBC,
      });
      this.state = STATE_NEW;
    } catch (error) {
      _errorX(LiveAnalyticsViewV1.getClassName(), 'loadConfiguration', { error });
      throw error;
    }
  }

  url() {
    return this.state.configs.host + this.state.configs.path;
  }

  static route() {
    const RET_VAL = {
      path: `live-analytics-view-v1`,
      component: LiveAnalyticsViewV1,
      data: {
        breadcrumb: 'Live Analytics',
      }
    };
    return RET_VAL;
  }

}
