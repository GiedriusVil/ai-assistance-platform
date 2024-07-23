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
  selector: 'aiap-rules-import-view-v1',
  templateUrl: './rules-import-view-v1.html',
  styleUrls: ['./rules-import-view-v1.scss']
})
export class RulesImportViewV1 extends BaseViewV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'RulesImportViewV1';
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
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, RulesImportViewV1.getClassName());
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.wbc = WBC;
      STATE_NEW.activatedRoute = this.activatedRoute;
      _debugX(RulesImportViewV1.getClassName(), `loadConfiguration`, {
        STATE_NEW,
        SESSION,
        WBC,
      });
      this.state = STATE_NEW;
    } catch (error) {
      _errorX(RulesImportViewV1.getClassName(), 'loadConfiguration', { error });
      throw error;
    }
  }

  static route() {
    return {
      path: 'rules-import-view-v1',
      component: RulesImportViewV1,
      data: {
        name: 'Rules Import View',
        component: RulesImportViewV1.getClassName(),
        description: 'Enables access to Rules Import view',
        breadcrumb: 'rules_import_view_v1.breadcrumb',
        actions: []
      }
    };
  }

}
