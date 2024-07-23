/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, NgZone, } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

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
  BaseViewV1,
} from '../../base/base-view-v1/base-view-v1';

@Component({
  selector: 'aiap-live-analytics-view-v2',
  templateUrl: './live-analytics-view-v2.html',
  styleUrls: ['./live-analytics-view-v2.scss'],
})
export class LiveAnalyticsViewV2 extends BaseViewV1 implements OnInit, OnDestroy, OnInit {

  static getClassName() {
    return 'LiveAnalyticsViewV2';
  }

  _state: any = {
    activatedRoute: undefined,
    router: undefined,
    wbc: {
      host: undefined,
      path: undefined,
      tag: undefined,
    },
    configs: {
      dashboardRef: undefined,
    }
  }

  state = lodash.cloneDeep(this._state);

  _params = {};
  params = lodash.cloneDeep(this._params);

  constructor(
    private sessionService: SessionServiceV1,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
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
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, LiveAnalyticsViewV2.getClassName());
      const STATE_NEW = lodash.cloneDeep(this.state);

      STATE_NEW.wbc = WBC;
      STATE_NEW.activatedRoute = this.activatedRoute;
      STATE_NEW.router = this.router;
      STATE_NEW.ngZone = this.ngZone;
      STATE_NEW.configs.dashboardRef = WBC?.dashboardRef;

      _debugX(LiveAnalyticsViewV2.getClassName(), `loadConfiguration`, {
        STATE_NEW,
        SESSION,
        WBC,
      });
      this.state = STATE_NEW;
    } catch (error) {
      _errorX(LiveAnalyticsViewV2.getClassName(), 'loadConfiguration', { error });
      throw error;
    }
  }

  url() {
    const RET_VAL = this.state?.wbc?.host + this.state?.wbc?.path;
    return RET_VAL;
  }

  static route() {
    const RET_VAL = {
      path: `live-analytics-view-v2`,
      component: LiveAnalyticsViewV2,
      data: {
        breadcrumb: 'Live Analytics',
      }
    };
    return RET_VAL;
  }

}
