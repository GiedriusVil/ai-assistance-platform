/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy } from '@angular/core';
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
  selector: 'aca-validation-engagements-changes-view-v1',
  templateUrl: './validation-engagements-changes-view-v1.html',
  styleUrls: ['./validation-engagements-changes-view-v1.scss'],
})
export class ValidationEngagementsChangesViewV1 extends BaseView implements OnInit, OnDestroy {

  static getClassName() {
    return 'ValidationEngagementsChangesViewV1';
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
    private sessionService: SessionServiceV1,
    private activatedRoute: ActivatedRoute,
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
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, ValidationEngagementsChangesViewV1.getClassName());
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.wbc = WBC;
      STATE_NEW.activatedRoute = this.activatedRoute;
      _debugX(ValidationEngagementsChangesViewV1.getClassName(), `loadConfiguration`, {
        STATE_NEW,
        SESSION,
        WBC,
      });
      this.state = STATE_NEW;
    } catch (error) {
      _errorX(ValidationEngagementsChangesViewV1.getClassName(), 'loadConfiguration', { error });
      throw error;
    }
  }

  static route() {
    const RET_VAL = {
      path: 'validation-engagements-changes-view-v1',
      component: ValidationEngagementsChangesViewV1,
      data: {
        name: 'Validation Engagements Changes',
        component: ValidationEngagementsChangesViewV1.getClassName(),
        description: 'Enables access to Validation Engagements Changes view',
        breadcrumb: 'validation_engagements_changes_view_v1.breadcrumb',
        actions: []
      }
    };
    return RET_VAL;
  }
}
