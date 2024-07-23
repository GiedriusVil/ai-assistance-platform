/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
  retrieveViewWBCConfigurationFromSession,
  IViewStateV1,
} from 'client-shared-utils';

import {
  SessionServiceV1,
} from 'client-shared-services';

import {
  BaseView,
} from 'client-shared-views';

@Component({
  selector: 'aca-validation-engagements-view-v1',
  templateUrl: './validation-engagements-view-v1.html',
  styleUrls: ['./validation-engagements-view-v1.scss'],
})
export class ValidationEngagementsViewV1 extends BaseView implements OnInit, OnDestroy {

  static getClassName() {
    return 'ValidationEngagementsViewV1';
  }

  _state: IViewStateV1 = {
    activatedRoute: undefined,
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
    private activatedRoute: ActivatedRoute,
    private sessionService: SessionServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadWBCView();
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  loadWBCView() {
    try {
      const SESSION = this.sessionService.getSession();
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, ValidationEngagementsViewV1.getClassName());
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.wbc = WBC;
      STATE_NEW.activatedRoute = this.activatedRoute;
      _debugX(ValidationEngagementsViewV1.getClassName(), `loadConfiguration`, {
        STATE_NEW,
        SESSION,
        WBC,
      });
      this.state = STATE_NEW;
    } catch (error) {
      _errorX(ValidationEngagementsViewV1.getClassName(), 'loadConfiguration', { error });
      throw error;
    }
  }

  static route() {
    const RET_VAL = {
      path: 'validation-engagements-view-v1',
      component: ValidationEngagementsViewV1,
      data: {
        name: 'Validation Engagements View',
        component: ValidationEngagementsViewV1.getClassName(),
        description: 'Enables access to Validation Engagements view',
        breadcrumb: 'validation_engagements_view_v1.breadcrumb',
        actions: []
      }
    };
    return RET_VAL;
  }
}
