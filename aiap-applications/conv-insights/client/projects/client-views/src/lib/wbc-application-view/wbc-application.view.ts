/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

import * as ramda from 'ramda';
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
  selector: 'aca-wbc-application-view',
  templateUrl: './wbc-application.view.html',
  styleUrls: ['./wbc-application.view.scss'],
})
export class WbcApplicationView extends BaseView implements OnInit, AfterViewInit, OnDestroy {

  static getClassName() {
    return 'WbcApplicationView';
  }

  _state = {
    component: undefined,
    host: undefined,
    path: undefined,
  }
  state: any = lodash.cloneDeep(this._state);

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscribeToRouteChanges();
  }

  subscribeToRouteChanges() {
    this.route.params
      .pipe(
        takeUntil(this._destroyed$),
      ).subscribe((routeParams: any) => {
        _debugX(WbcApplicationView.getClassName(), 'subscribeToRouteChanges', { routeParams });
        const SESSION = this.sessionService.getSession();


        const STATE_BEFORE = lodash.cloneDeep(this.state);
        const STATE_AFTER = lodash.cloneDeep(STATE_BEFORE);


        const APPLICATION_CONFIGURATION = SESSION?.application?.configuration;

        STATE_AFTER.component = APPLICATION_CONFIGURATION?.component?.tag;
        STATE_AFTER.host = APPLICATION_CONFIGURATION?.component?.host;
        STATE_AFTER.path = APPLICATION_CONFIGURATION?.component?.path;


        _debugX(WbcApplicationView.getClassName(), `subscribeToRouteChanges`, { STATE_BEFORE, STATE_AFTER, routeParams, SESSION });
        this.state = STATE_AFTER;
      });
  }

  url() {
    return this.state.host + this.state.path;
  }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this.superNgOnDestroy();
  }

  applicationLoadingText() {
    return `Waiting for application ${this.state?.component} to load from ${this.state?.host}${this.state?.path}!`;
  }

  static route() {
    const RET_VAL = {
      path: `:component`,
      component: WbcApplicationView,
      data: {
        breadcrumb: 'WebComponent',
      }
    };
    return RET_VAL;
  }

}
