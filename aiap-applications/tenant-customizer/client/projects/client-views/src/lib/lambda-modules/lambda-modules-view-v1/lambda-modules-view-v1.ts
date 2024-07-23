/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, NgZone, OnInit } from '@angular/core';

import * as lodash from 'lodash';

import { ActivatedRoute, Router } from '@angular/router';

import {
  _debugX,
  _errorX,
  retrieveViewWBCConfigurationFromSession
} from 'client-shared-utils';

import {
  SessionServiceV1,
} from 'client-shared-services';

import {
  BaseViewV1,
} from 'client-shared-views';

@Component({
  selector: 'aiap-lambda-modules-view-v1',
  templateUrl: './lambda-modules-view-v1.html',
  styleUrls: ['./lambda-modules-view-v1.scss'],
})
export class LambdaModulesViewV1 extends BaseViewV1 implements OnInit {

  static getClassName(): string {
    return 'LambdaModulesViewV1';
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
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, LambdaModulesViewV1.getClassName());
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.wbc = WBC;
      STATE_NEW.activatedRoute = this.activatedRoute;
      STATE_NEW.router = this.router;
      STATE_NEW.ngZone = this.ngZone;
      _debugX(LambdaModulesViewV1.getClassName(), `loadConfiguration`, {
        STATE_NEW,
        SESSION,
        WBC,
      });
      this.state = STATE_NEW;
    } catch (error) {
      _errorX(LambdaModulesViewV1.getClassName(), 'loadConfiguration', { error });
      throw error;
    }
  }

  static route(children: any[]) {
    const RET_VAL = {
      path: 'lambda-modules-v1',
      children: [
        ...children,
        {
          path: '',
          component: LambdaModulesViewV1,
          data: {
            name: 'lambda_modules_view_v1.name',
            description: 'lambda_modules_view_v1.description',
            component: LambdaModulesViewV1.getClassName(),
            actions: [
              {
                name: 'lambda_modules_view_v1.action_pull.name',
                description: 'lambda_modules_view_v1.action_pull.description',
                component: 'lambda-modules.view.pull'
              },
              {
                name: 'lambda_modules_view_v1.action_add.name',
                description: 'lambda_modules_view_v1.action_add.description',
                component: 'lambda-modules.view.add'
              },
              {
                name: 'lambda_modules_view_v1.action_edit.name',
                description: 'lambda_modules_view_v1.action_edit.description',
                component: 'lambda-modules.view.edit'
              },
              {
                name: 'lambda_modules_view_v1.action_import.name',
                description: 'lambda_modules_view_v1.action_import.description',
                component: 'lambda-modules.view.import'
              },
              {
                name: 'lambda_modules_view_v1.action_export.name',
                description: 'lambda_modules_view_v1.action_export.description',
                component: 'lambda-modules.view.export'
              },
              {
                name: 'lambda_modules_view_v1.action_delete.name',
                description: 'lambda_modules_view_v1.action_delete.description',
                component: 'lambda-modules.view.delete'
              }
            ]
          }
        }
      ],
      data: {
        breadcrumb: 'lambda_modules_views_v1.breadcrumb',
      }
    }
    return RET_VAL;
  }
}
