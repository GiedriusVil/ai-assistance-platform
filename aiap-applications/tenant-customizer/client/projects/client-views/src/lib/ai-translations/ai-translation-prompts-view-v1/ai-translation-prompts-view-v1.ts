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
  selector: 'aiap-ai-translation-prompts-view-v1',
  templateUrl: './ai-translation-prompts-view-v1.html',
  styleUrls: ['./ai-translation-prompts-view-v1.scss'],
})
export class AiTranslationPromptsViewV1 extends BaseViewV1 implements OnInit {

  static getClassName() {
    return 'AiTranslationPromptsViewV1';
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
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, AiTranslationPromptsViewV1.getClassName());
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.wbc = WBC;
      STATE_NEW.activatedRoute = this.activatedRoute;
      STATE_NEW.router = this.router;
      STATE_NEW.ngZone = this.ngZone;
      _debugX(AiTranslationPromptsViewV1.getClassName(), `loadConfiguration`, {
        STATE_NEW,
        SESSION,
        WBC,
      });
      this.state = STATE_NEW;
    } catch (error) {
      _errorX(AiTranslationPromptsViewV1.getClassName(), 'loadConfiguration', { error });
      throw error;
    }
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'ai-translation-prompts',
      children: [
        ...children,
        {
          path: '',
          component: AiTranslationPromptsViewV1,
          data: {
            name: 'AI Translation Prompts',
            component: AiTranslationPromptsViewV1.getClassName(),
            description: 'Enables access to AI Translation Prompts view',
            actions: [
              {
                name: 'Add AI Translation Prompt',
                component: 'ai-translation-prompts.view.add',
                description: 'Allows the creation of new AI Translation prompts',
              },
              {
                name: 'Edit AI Translation Prompt',
                component: 'ai-translation-prompts.view.edit',
                description: 'Allows the ability to edit existing AI Translation prompts',
              },
              {
                name: 'Delete AI Translation Prompt',
                component: 'ai-translation-prompts.view.delete',
                description: 'Allows deletion of existing AI Translation prompts',
              },
              {
                name: 'Import AI Translation Prompt',
                component: 'ai-translation-prompts.view.import',
                description: 'Allows the import of AI Translation prompts',
              },
              {
                name: 'Export AI Translation Prompt',
                component: 'ai-translation-prompts.view.export',
                description: 'Allows the export of AI Translation prompts',
              }
            ]
          }
        },
      ],
      data: {
        breadcrumb: 'ai_translation_prompts_view_v1.breadcrumb',
      }
    };
    return RET_VAL;
  }
}
