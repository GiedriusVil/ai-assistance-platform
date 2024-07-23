/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  NgZone,
  Component,
  OnInit,
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
  BaseViewV1
} from 'client-shared-views';

@Component({
  selector: 'aiap-tiles-models-changes-view-v1',
  templateUrl: './tiles-models-changes-view-v1.html',
  styleUrls: ['./tiles-models-changes-view-v1.scss'],
})
export class TilesModelsChangesViewV1 extends BaseViewV1 implements OnInit {

  static getClassName() {
    return 'TilesModelsChangesViewV1';
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
    private ngZone: NgZone,
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
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, TilesModelsChangesViewV1.getClassName());
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.wbc = WBC;
      STATE_NEW.activatedRoute = this.activatedRoute;
      STATE_NEW.router = this.router;
      STATE_NEW.ngZone = this.ngZone;
      _debugX(TilesModelsChangesViewV1.getClassName(), `loadConfiguration`, {
        STATE_NEW,
        SESSION,
        WBC,
      });
      this.state = STATE_NEW;
    } catch (error) {
      _errorX(TilesModelsChangesViewV1.getClassName(), 'loadConfiguration', { error });
      throw error;
    }
  }

  static route() {
    const RET_VAL = {
      path: 'tiles-models-changes',
      component: TilesModelsChangesViewV1,
      data: {
        name: 'tiles_models_changes_view_v1.name',
        breadcrumb: 'tiles_models_changes_view_v1.breadcrumb',
        component: TilesModelsChangesViewV1.getClassName(),
        description: 'tiles_models_changes_view_v1.description',
        actions: [
          {
            name: 'View tiles Model change',
            component: 'tiles_models_changes.view.actions.view',
            description: 'Allows viewing of tiles Models changes',
          }
        ]
      }
    };
    return RET_VAL;
  }
}
