/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { ActivatedRoute } from '@angular/router';

import {
  IViewStateV1,
  _debugX,
  _errorX,
  retrieveViewWBCConfigurationFromSession
} from 'client-shared-utils';

import {
  EventsServiceV1,
  SessionServiceV1,
} from 'client-shared-services';

import {
  BaseView
} from 'client-shared-views';

@Component({
  selector: 'aiap-topic-modeling-view-v1',
  templateUrl: './topic-modeling.view-v1.html',
  styleUrls: ['./topic-modeling.view-v1.scss']
})
export class TopicModelingViewV1 extends BaseView implements OnInit {

  static getClassName() {
    return 'TopicModelingViewV1';
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
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, TopicModelingViewV1.getClassName());
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.wbc = WBC;
      STATE_NEW.activatedRoute = this.activatedRoute;
      _debugX(TopicModelingViewV1.getClassName(), `loadConfiguration`, {
        STATE_NEW,
        SESSION,
        WBC,
      });
      this.state = STATE_NEW;
    } catch (error) {
      _errorX(TopicModelingViewV1.getClassName(), 'loadConfiguration', { error });
      throw error;
    }
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'topic-modeling-view-v1',
      children: [
        ...children,
        {
          path: '',
          component: TopicModelingViewV1,
          data: {
            breadcrumb: 'topic_modelling_view_v1.breadcrumb',
            name: 'topic_modelling_view_v1.name',
            component: TopicModelingViewV1.getClassName(),
            description: 'topic_modelling_view_v1.description',
            actions: [
              {
                name: 'topic_modelling_view_v1.actions.add.name',
                component: 'topic-modeling.view.add',
                description: 'topic_modelling_view_v1.actions.add.description',
              },
              {
                name: 'topic_modelling_view_v1.actions.edit.name',
                component: 'topic-modeling.view.edit',
                description: 'topic_modelling_view_v1.actions.edit.description',
              },
              {
                name: 'topic_modelling_view_v1.actions.delete.name',
                component: 'topic-modeling.view.delete',
                description: 'topic_modelling_view_v1.actions.delete.description',
              },
              {
                name: 'topic_modelling_view_v1.actions.import.name',
                component: 'topic-modeling.view.import',
                description: 'topic_modelling_view_v1.actions.import.description',
              },
              {
                name: 'topic_modelling_view_v1.actions.export.name',
                component: 'topic-modeling.view.export',
                description: 'topic_modelling_view_v1.actions.export.description',
              }
            ]
          }
        }
      ],
      data: {
        breadcrumb: 'topic_modelling_view_v1.breadcrumb',
      }
    };
    return RET_VAL;
  }
}
