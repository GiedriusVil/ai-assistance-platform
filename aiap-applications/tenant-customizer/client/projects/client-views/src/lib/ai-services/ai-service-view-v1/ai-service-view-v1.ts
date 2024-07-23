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
  BaseView
} from 'client-shared-views';

@Component({
  selector: 'aiap-ai-service-view-v1',
  templateUrl: './ai-service-view-v1.html',
  styleUrls: ['./ai-service-view-v1.scss'],
})
export class AiServiceViewV1 extends BaseView implements OnInit {

  static getClassName() {
    return 'AiServiceViewV1';
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
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, AiServiceViewV1.getClassName());
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.wbc = WBC;
      STATE_NEW.activatedRoute = this.activatedRoute;
      STATE_NEW.router = this.router;
      STATE_NEW.ngZone = this.ngZone;
      _debugX(AiServiceViewV1.getClassName(), `loadConfiguration`, {
        STATE_NEW,
        SESSION,
        WBC,
      });
      this.state = STATE_NEW;
    } catch (error) {
      _errorX(AiServiceViewV1.getClassName(), 'loadConfiguration', { error });
      throw error;
    }
  }

  
static route() {
  const RET_VAL = {
    path: 'aiservice',
    component: AiServiceViewV1,
    data: {
      name: 'ai_service_view_v1.name',
      breadcrumb: 'ai_service_view_v1.breadcrumb',
      component: AiServiceViewV1.getClassName(),
      description: 'Enables access to AI Service view',
      actions: [
        {
          name: 'Run AI Test',
          component: 'ai-service.view.run-test',
          description: 'Allows to run AI Test on skill',
        },
        {
          name: 'Pull AI Skill',
          component: 'ai-service.view.pull',
          description: 'Allows the ability to pull an AI Skill from pull source AI Service',
        },
        {
          name: 'Delete AI Skill',
          component: 'ai-service.view.delete',
          description: 'Allows deletion of existing AI Skills',
        },
        {
          name: 'Synchronise AI Skills by file',
          component: 'ai-service.view.sync-by-file',
          description: 'Allows the synchronisation of AI Skills from a file',
        },
        {
          name: 'Synchronise AI Skills',
          component: 'ai-service.view.synchronise',
          description: 'Allows the synchronisation of AI Skills',
        },
        {
          name: 'View AI Skill dialog tree',
          component: 'ai-service.view.view-dialog-tree',
          description: 'Allows the ability to view AI Skill dialog trees',
        }
      ]
    }
  };
  return RET_VAL;
}
}
