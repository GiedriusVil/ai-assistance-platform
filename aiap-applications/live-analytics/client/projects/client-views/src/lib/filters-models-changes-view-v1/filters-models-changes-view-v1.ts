/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  NgZone,
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

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
  BaseViewV1, BaseViewWithWbcLoaderV1
} from 'client-shared-views';

import {
  OUTLETS
} from 'client-utils';

@Component({
  selector: 'aiap-filters-models-changes-view-v1',
  templateUrl: './filters-models-changes-view-v1.html',
  styleUrls: ['./filters-models-changes-view-v1.scss'],
})
export class FiltersModelsChangesViewV1 extends BaseViewWithWbcLoaderV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'FiltersModelsChangesViewV1';
  }

  outlet = OUTLETS.liveAnalytics;

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
    protected sessionService: SessionServiceV1,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected ngZone: NgZone,
  ) {
    super(
        ngZone,
        router,
        activatedRoute,
        sessionService,
    );
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
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, FiltersModelsChangesViewV1.getClassName());
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.wbc = WBC;
      STATE_NEW.activatedRoute = this.activatedRoute;
      STATE_NEW.router = this.router;
      STATE_NEW.ngZone = this.ngZone;
      _debugX(FiltersModelsChangesViewV1.getClassName(), `loadConfiguration`, {
        STATE_NEW,
        SESSION,
        WBC,
      });
      this.state = STATE_NEW;
    } catch (error) {
      _errorX(FiltersModelsChangesViewV1.getClassName(), 'loadConfiguration', { error });
      throw error;
    }
  }

  static route() {
    const RET_VAL = {
      path: 'filters-models-changes',
      component: FiltersModelsChangesViewV1,
      data: {
        name: 'filters_models_changes_view_v1.name',
        breadcrumb: 'filters_models_changes_view_v1.breadcrumb',
        component: FiltersModelsChangesViewV1.getClassName(),
        description: 'filters_models_changes_view_v1.description',
        actions: [
          {
            name: 'View filters Model change',
            component: 'filters_models_changes.view.actions.view',
            description: 'Allows viewing of filters Models changes',
          }
        ]
      }
    };
    return RET_VAL;
  }
}
