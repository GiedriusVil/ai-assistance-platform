/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import * as ramda from 'ramda';
import * as lodash from 'lodash';


import {
  _debugX,
  _errorX,
  StripTextPipe,
  retrieveViewWBCConfigurationFromSession,
} from 'client-shared-utils';

import {
  SessionServiceV1,
} from 'client-shared-services';

import {
  BaseView
} from 'client-shared-views';


import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'aiap-utterances-view-v1',
  templateUrl: './utterances.view-v1.html',
  styleUrls: ['./utterances.view-v1.scss'],
  providers: [StripTextPipe, DecimalPipe]
})
export class UtterancesViewV1 extends BaseView implements OnInit, OnDestroy {

  static getClassName() {
    return 'UtterancesViewV1';
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
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, UtterancesViewV1.getClassName());
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.wbc = WBC;
      STATE_NEW.activatedRoute = this.activatedRoute;
      STATE_NEW.router = this.router;
      STATE_NEW.ngZone = this.ngZone;
      _debugX(UtterancesViewV1.getClassName(), `loadConfiguration`, {
        STATE_NEW,
        SESSION,
        WBC,
      });
      this.state = STATE_NEW;
    } catch (error) {
      _errorX(UtterancesViewV1.getClassName(), 'loadConfiguration', { error });
      throw error;
    }
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'utterances-view-v1',
      children: [
        ...children,
        {
          path: '',
          component: UtterancesViewV1,
          data: {
            component: UtterancesViewV1.getClassName(),
          }
        },
      ],
      data: {
        breadcrumb: 'utterances_view_v1.breadcrumb',
      }
    };
    return RET_VAL;
  }

}
