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
  BaseViewV1,
} from 'client-shared-views';

@Component({
  selector: 'aiap-doc-validation-metrics-view-v2',
  templateUrl: './doc-validation-metrics-view-v2.html',
  styleUrls: ['./doc-validation-metrics-view-v2.scss'],
})
export class DocValidationMetricsViewV2 extends BaseViewV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'DocValidationMetricsViewV2';
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
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, DocValidationMetricsViewV2.getClassName());
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.wbc = WBC;
      STATE_NEW.activatedRoute = this.activatedRoute;
      _debugX(DocValidationMetricsViewV2.getClassName(), `loadConfiguration`, {
        STATE_NEW,
        SESSION,
        WBC,
      });
      this.state = STATE_NEW;
    } catch (error) {
      _errorX(DocValidationMetricsViewV2.getClassName(), 'loadConfiguration',
        {
          error
        });

      throw error;
    }
  }

  static route() {
    const RET_VAL = {
      path: 'doc-validation-metrics-view-2',
      component: DocValidationMetricsViewV2,
      data: {
        name: 'Documents Validation Metrics',
        componentInRoleTable: DocValidationMetricsViewV2.getClassName(),
        description: 'Enables access to Documents Validation Metrics View',
        breadcrumb: 'doc_validation_metrics_view_2.breadcrumb',
        actions: []
      }
    };
    return RET_VAL;
  }
}
