/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, NgZone, OnDestroy, OnInit } from '@angular/core';

import * as lodash from 'lodash';

import {
  retrieveViewWBCConfigurationFromSession,
  _debugX, _errorX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
} from 'client-shared-services';

import {
  BaseView
} from 'client-shared-views';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'aiap-surveys-view-v1',
  templateUrl: './surveys.view-v1.html',
  styleUrls: ['./surveys.view-v1.scss'],
})
export class SurveysViewV1 extends BaseView implements OnInit, OnDestroy {

  static getClassName() {
    return 'SurveysViewV1';
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
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, SurveysViewV1.getClassName());
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.wbc = WBC;
      STATE_NEW.activatedRoute = this.activatedRoute;
      STATE_NEW.router = this.router;
      STATE_NEW.ngZone = this.ngZone;
      _debugX(SurveysViewV1.getClassName(), `loadConfiguration`, {
        STATE_NEW,
        SESSION,
        WBC,
      });
      this.state = STATE_NEW;
    } catch (error) {
      _errorX(SurveysViewV1.getClassName(), 'loadConfiguration', { error });
      throw error;
    }
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'surveys-view-v1',
      children: [
        ...children,
        {
          path: '',
          component: SurveysViewV1,
          data: {
            name: 'surveys_view_v1.name',
            component: SurveysViewV1.getClassName(),
            description: 'surveys_view_v1.description',
          }
        }
      ],
      data: {
        breadcrumb: 'surveys_view_v1.breadcrumb',
      }
    };
    return RET_VAL;
  }

}
