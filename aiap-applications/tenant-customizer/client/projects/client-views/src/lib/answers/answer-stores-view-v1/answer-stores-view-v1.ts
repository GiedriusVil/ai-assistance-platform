/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';

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
  selector: 'aiap-answer-stores-view-v1',
  templateUrl: './answer-stores-view-v1.html',
  styleUrls: ['./answer-stores-view-v1.scss'],
})
export class AnswerStoresViewV1 extends BaseViewV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'AnswerStoresViewV1';
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
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, AnswerStoresViewV1.getClassName());
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.wbc = WBC;
      STATE_NEW.activatedRoute = this.activatedRoute;
      STATE_NEW.router = this.router;
      STATE_NEW.ngZone = this.ngZone;
      _debugX(AnswerStoresViewV1.getClassName(), `loadConfiguration`, {
        STATE_NEW,
        SESSION,
        WBC,
      });
      this.state = STATE_NEW;
    } catch (error) {
      _errorX(AnswerStoresViewV1.getClassName(), 'loadConfiguration', { error });
      throw error;
    }
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'answer-stores',
      children: [
        ...children,
        {
          path: '',
          component: AnswerStoresViewV1,
          data: {
            name: 'Answer stores view',
            component: AnswerStoresViewV1.getClassName(),
            description: 'Enables access to Answer stores view',
            actions: [
              {
                name: 'Add new answer store',
                component: 'answer-stores.view.add',
                description: 'Allows the creation of answer stores',
              },
              {
                name: 'Edit answer store',
                component: 'answer-stores.view.edit',
                description: 'Allows the ability to edit existing answer stores',
              },
              {
                name: 'Delete answer store',
                component: 'answer-stores.view.delete',
                description: 'Allows deletion of existing answer stores',
              },
              {
                name: 'Import answer store',
                component: 'answer-stores.view.import',
                description: 'Allows the import of answer stores',
              },
              {
                name: 'Export answer store',
                component: 'answer-stores.view.export',
                description: 'Allows the export of answer stores',
              },
              {
                name: 'Pull answer store',
                component: 'answer-stores.view.pull',
                description: 'Allows the pull of answer stores',
              }
            ]
          }
        },
      ],
      data: {
        breadcrumb: 'answer_stores_view_v1.route_data.breadcrumb',
      }
    };
    return RET_VAL;
  }
}
