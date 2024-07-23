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
  selector: 'aiap-ai-translation-prompt-configuration-view-v1',
  templateUrl: './ai-translation-prompt-configuration-view-v1.html',
  styleUrls: ['./ai-translation-prompt-configuration-view-v1.scss'],
})
export class AiTranslationPromptConfigurationViewV1 extends BaseViewV1 implements OnInit {

  static getClassName() {
    return 'AiTranslationPromptConfigurationViewV1';
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
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, AiTranslationPromptConfigurationViewV1.getClassName());
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.wbc = WBC;
      STATE_NEW.activatedRoute = this.activatedRoute;
      STATE_NEW.router = this.router;
      STATE_NEW.ngZone = this.ngZone;
      _debugX(AiTranslationPromptConfigurationViewV1.getClassName(), `loadConfiguration`, {
        STATE_NEW,
        SESSION,
        WBC,
      });
      this.state = STATE_NEW;
    } catch (error) {
      _errorX(AiTranslationPromptConfigurationViewV1.getClassName(), 'loadConfiguration', { error });
      throw error;
    }
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'ai-translation-prompt-configuration',
      children: [
        ...children,
        {
          path: '',
          component: AiTranslationPromptConfigurationViewV1,
          data: {
            name: 'AI Translation Prompt Configuration',
            component: AiTranslationPromptConfigurationViewV1.getClassName(),
            description: 'Enables access to AI Translation Prompt Configuration view',
            actions: [
              {
                name: 'Add AI Translation Prompt',
                component: 'ai-translation-prompt-configuration.view.add',
                description: 'Allows the creation of new AI Translation prompt configuration',
              },
              {
                name: 'Edit AI Translation Prompt',
                component: 'ai-translation-prompt-configuration.view.edit',
                description: 'Allows the ability to edit existing AI Translation prompt configuration',
              },
              {
                name: 'Delete AI Translation Prompt',
                component: 'ai-translation-prompt-configuration.view.delete',
                description: 'Allows deletion of existing AI Translation prompt configuration',
              },
              {
                name: 'Import AI Translation Prompt',
                component: 'ai-translation-prompt-configuration.view.import',
                description: 'Allows the import of AI Translation prompt configuration',
              },
              {
                name: 'Export AI Translation Prompt',
                component: 'ai-translation-prompt-configuration.view.export',
                description: 'Allows the export of AI Translation prompt configuration',
              }
            ]
          }
        },
      ],
      data: {
        breadcrumb: 'ai_translation_prompt_configuration_view_v1.breadcrumb',
      }
    };
    return RET_VAL;
  }
}
