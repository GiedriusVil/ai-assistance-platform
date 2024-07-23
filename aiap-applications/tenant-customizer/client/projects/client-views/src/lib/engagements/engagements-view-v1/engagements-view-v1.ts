/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  NgZone,
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
  BaseViewV1,
} from 'client-shared-views';

@Component({
  selector: 'aiap-engagements-view-v1',
  templateUrl: './engagements-view-v1.html',
  styleUrls: ['./engagements-view-v1.scss'],
})
export class EngagementsViewV1 extends BaseViewV1 implements OnInit {

  static getClassName() {
    return 'EngagementsViewV1';
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
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, EngagementsViewV1.getClassName());
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.wbc = WBC;
      STATE_NEW.activatedRoute = this.activatedRoute;
      STATE_NEW.router = this.router;
      STATE_NEW.ngZone = this.ngZone;
      _debugX(EngagementsViewV1.getClassName(), `loadConfiguration`, {
        STATE_NEW,
        SESSION,
        WBC,
      });
      this.state = STATE_NEW;
    } catch (error) {
      _errorX(EngagementsViewV1.getClassName(), 'loadConfiguration', { error });
      throw error;
    }
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'engagements-v1',
      children: [
        ...children,
        {
          path: '',
          component: EngagementsViewV1,
          data: {
            name: 'engagements_view_v1.name',
            description: 'engagements_view_v1.description',
            component: EngagementsViewV1.getClassName(),
            actions: [
              {
                name: 'engagements_view_v1.action_add.name',
                description: 'engagements_view_v1.action_add.description',
                component: 'engagements.view.add',
              },
              {
                name: 'engagements_view_v1.action_edit.name',
                description: 'engagements_view_v1.action_edit.description',
                component: 'engagements.view.edit',
              },
              {
                name: 'engagements_view_v1.action_delete.name',
                description: 'engagements_view_v1.action_delete.description',
                component: 'engagements.view.delete',
              },
              {
                name: 'engagements_view_v1.action_import.name',
                description: 'engagements_view_v1.action_import.description',
                component: 'engagements.view.import',
              },
              {
                name: 'engagements_view_v1.action_export.name',
                description: 'engagements_view_v1.action_export.description',
                component: 'engagements.view.export',
              },
            ]
          }
        },
      ],
      data: {
        breadcrumb: 'engagements_view_v1.breadcrumb',
      }
    }
    return RET_VAL;
  }
}
