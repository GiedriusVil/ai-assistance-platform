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
  selector: 'aiap-answers-view-v1',
  templateUrl: './answers-view-v1.html',
  styleUrls: ['./answers-view-v1.scss'],
})
export class AnswersViewV1 extends BaseViewV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'AnswersViewV1';
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
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, AnswersViewV1.getClassName());
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.wbc = WBC;
      STATE_NEW.activatedRoute = this.activatedRoute;
      STATE_NEW.router = this.router;
      STATE_NEW.ngZone = this.ngZone;
      _debugX(AnswersViewV1.getClassName(), `loadConfiguration`, {
        STATE_NEW,
        SESSION,
        WBC,
      });
      this.state = STATE_NEW;
    } catch (error) {
      _errorX(AnswersViewV1.getClassName(), 'loadConfiguration', { error });
      throw error;
    }
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'answers',
      children: [
        ...children,
        {
          path: '',
          component: AnswersViewV1,
          data: {
            name: 'Answers',
            component: AnswersViewV1.getClassName(),
            description: 'Enables access to Answers view',
            actions: [
              {
                name: 'Add answer',
                component: 'answers.view.add',
                description: 'Allows the creation of new answers',
              },
              {
                name: 'Edit answer',
                component: 'answers.view.edit',
                description: 'Allows the ability to edit existing answers',
              },
              {
                name: 'Delete answer',
                component: 'answers.view.delete',
                description: 'Allows deletion of existing answers',
              },
              {
                name: 'Pull answers',
                component: 'answers.view.pull',
                description: 'Allows the ability to pull answers from pull source answer store',
              },
              {
                name: 'Rollback answers',
                component: 'answers.view.rollback',
                description: 'Allows the ability to rollback answers',
              },
              {
                name: 'Import answers',
                component: 'answers.view.import',
                description: 'Allows the import of answers',
              },
              {
                name: 'Export answers to XLSX',
                component: 'answers.view.export.xlsx',
                description: 'Allows the export of answers',
              },
              {
                name: 'Export answers to JSON',
                component: 'answers.view.export.json',
                description: 'Allows the export of answers',
              },
            ]
          }
        }
      ],
      data: {
        breadcrumb: 'answers_view_v1.route_data.breadcrumb',
      }
    };
    return RET_VAL
  }

}
