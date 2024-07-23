/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy } from '@angular/core';

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
  BaseView
} from 'client-shared-views';

@Component({
  selector: 'aca-rules-changes-view-v2',
  templateUrl: './rules-changes-view-v2.html',
  styleUrls: ['./rules-changes-view-v2.scss'],
})
export class RulesChangesViewV2 extends BaseView implements OnInit, OnDestroy {

  static getClassName() {
    return 'RulesChangesViewV2';
  }

  _state = {
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
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, RulesChangesViewV2.getClassName());
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.wbc = WBC;
      _debugX(RulesChangesViewV2.getClassName(), `loadConfiguration`, {
        STATE_NEW,
        SESSION,
        WBC,
      });
      this.state = STATE_NEW;
    } catch (error) {
      _errorX(RulesChangesViewV2.getClassName(), 'loadConfiguration', { error });
      throw error;
    }
  }

  static route() {
    const RET_VAL = {
      path: 'rules-changes-view-v2',
      component: RulesChangesViewV2,
      data: {
        name: 'Rules Changes View (V2)',
        component: RulesChangesViewV2.getClassName(),
        description: 'Enables access to Rules V2 Changes view',
        breadcrumb: 'rules_changes_view_v2.breadcrumb',
        actions: []
      }
    };
    return RET_VAL;
  }
}
