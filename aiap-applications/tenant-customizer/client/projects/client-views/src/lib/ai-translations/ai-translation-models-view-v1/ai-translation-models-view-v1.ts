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
import { WbcLocationServiceV1 } from 'client-shared-services';

import {
  BaseViewV1,
} from 'client-shared-views';

@Component({
  selector: 'aiap-ai-translation-models-view-v1',
  templateUrl: './ai-translation-models-view-v1.html',
  styleUrls: ['./ai-translation-models-view-v1.scss'],
})
export class AiTranslationModelsViewV1 extends BaseViewV1 implements OnInit {

  static getClassName() {
    return 'AiTranslationModelsViewV1';
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
    private wbcLocationService: WbcLocationServiceV1,
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
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, AiTranslationModelsViewV1.getClassName());
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.wbc = WBC;
      STATE_NEW.activatedRoute = this.activatedRoute;
      STATE_NEW.router = this.router;
      STATE_NEW.ngZone = this.ngZone;
      _debugX(AiTranslationModelsViewV1.getClassName(), `loadConfiguration`, {
        STATE_NEW,
        SESSION,
        WBC,
      });
      this.state = STATE_NEW;
    } catch (error) {
      _errorX(AiTranslationModelsViewV1.getClassName(), 'loadConfiguration', { error });
      throw error;
    }
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'ai-translation-models',
      children: [
        ...children,
        {
          path: '',
          component: AiTranslationModelsViewV1,
          data: {
            name: 'AI Translation Models',
            component: AiTranslationModelsViewV1.getClassName(),
            description: 'Enables access to AI Translation Models view',
            actions: [
              {
                name: 'Add AI Translation Model',
                component: 'ai-translation-models.view.add',
                description: 'Allows the creation of new AI Translation models',
              },
              {
                name: 'Edit AI Translation Model',
                component: 'ai-translation-models.view.edit',
                description: 'Allows the ability to edit existing AI Translation models',
              },
              {
                name: 'Delete AI Translation Model',
                component: 'ai-translation-models.view.delete',
                description: 'Allows deletion of existing AI Translation models',
              },
              {
                name: 'Import AI Translation Model',
                component: 'ai-translation-models.view.import',
                description: 'Allows the import of AI Translation models',
              },
              {
                name: 'Export AI Translation Model',
                component: 'ai-translation-models.view.export',
                description: 'Allows the export of AI Translation models',
              }
            ]
          }
        },
      ],
      data: {
        breadcrumb: 'ai_translation_models_view_v1.breadcrumb',
      }
    };
    return RET_VAL;
  }
}
