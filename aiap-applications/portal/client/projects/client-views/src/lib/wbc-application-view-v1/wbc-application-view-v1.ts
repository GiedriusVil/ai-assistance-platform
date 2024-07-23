/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
} from 'client-shared-services';

import {
  BaseView
} from 'client-shared-views';

@Component({
  selector: 'aiap-wbc-application-view-v1',
  templateUrl: './wbc-application-view-v1.html',
  styleUrls: ['./wbc-application-view-v1.scss'],
})
export class WbcApplicationViewV1 extends BaseView implements OnInit, AfterViewInit, OnDestroy {

  static getClassName() {
    return 'WbcApplicationViewV1';
  }

  _state = {
    component: undefined,
    host: undefined,
    path: undefined,
  }
  state: any = lodash.cloneDeep(this._state);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sessionService: SessionServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscribeToRouteChanges();
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy(): void {
    this.superNgOnDestroy();
  }

  subscribeToRouteChanges() {
    this.route.params
      .pipe(
        takeUntil(this._destroyed$),
      ).subscribe((routeParams: any) => {
        _debugX(WbcApplicationViewV1.getClassName(), 'subscribeToRouteChanges',
          {
            routeParams,
          });

        const SESSION = this.sessionService.getSession();

        const STATE_BEFORE = lodash.cloneDeep(this.state);
        const STATE_AFTER = lodash.cloneDeep(STATE_BEFORE);

        const APPLICATION_CONFIGURATION = SESSION?.application?.configuration;

        STATE_AFTER.component = APPLICATION_CONFIGURATION?.component?.tag;
        STATE_AFTER.host = APPLICATION_CONFIGURATION?.component?.host;
        STATE_AFTER.path = APPLICATION_CONFIGURATION?.component?.path;


        _debugX(WbcApplicationViewV1.getClassName(), `subscribeToRouteChanges`,
          {
            STATE_BEFORE,
            STATE_AFTER,
            routeParams,
            SESSION,
          });

        this.state = STATE_AFTER;
      });
  }

  url() {
    return this.state.host + this.state.path;
  }

  applicationLoadingText() {
    return `Waiting for application ${this.state?.component} to load from ${this.state?.host}${this.state?.path}!`;
  }

  static route() {
    const RET_VAL = {
      path: `:component`,
      component: WbcApplicationViewV1,
      children: [
        { path: '**', component: WbcApplicationViewV1 }
      ],
      data: {
        breadcrumb: 'WebComponent',
      }
    };
    return RET_VAL;
  }

}
