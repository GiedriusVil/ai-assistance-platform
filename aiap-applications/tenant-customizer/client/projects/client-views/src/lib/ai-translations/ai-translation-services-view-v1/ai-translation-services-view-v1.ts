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
  selector: 'aiap-ai-translation-services-view-v1',
  templateUrl: './ai-translation-services-view-v1.html',
  styleUrls: ['./ai-translation-services-view-v1.scss'],
})
export class AiTranslationServicesViewV1 extends BaseViewV1 implements OnInit {

  static getClassName() {
    return 'AiTranslationServicesViewV1';
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
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, AiTranslationServicesViewV1.getClassName());
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.wbc = WBC;
      STATE_NEW.activatedRoute = this.activatedRoute;
      STATE_NEW.router = this.router;
      STATE_NEW.ngZone = this.ngZone;
      _debugX(AiTranslationServicesViewV1.getClassName(), `loadConfiguration`, {
        STATE_NEW,
        SESSION,
        WBC,
      });
      this.state = STATE_NEW;
    } catch (error) {
      _errorX(AiTranslationServicesViewV1.getClassName(), 'loadConfiguration', { error });
      throw error;
    }
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'ai-translation-services',
      children: [
        ...children,
        {
          path: '',
          component: AiTranslationServicesViewV1,
          data: {
            name: 'AI Translation Services',
            component: AiTranslationServicesViewV1.getClassName(),
            description: 'Enables access to AI Translation Services view',
            actions: [
              {
                name: 'Add AI Translation Service',
                component: 'ai-translation-services.view.add',
                description: 'Allows the creation of new AI Translation services',
              },
              {
                name: 'Edit AI Translation Service',
                component: 'ai-translation-services.view.edit',
                description: 'Allows the ability to edit existing AI Translation services',
              },
              {
                name: 'Delete AI Translation Service',
                component: 'ai-translation-services.view.delete',
                description: 'Allows deletion of existing AI Translation services',
              },
              {
                name: 'Import AI Translation Service',
                component: 'ai-translation-services.view.import',
                description: 'Allows the import of AI Translation services',
              },
              {
                name: 'Export AI Translation Service',
                component: 'ai-translation-services.view.export',
                description: 'Allows the export of AI Translation services',
              },
            ]
          }
        },
      ],
      data: {
        breadcrumb: 'ai_translation_services_view_v1.breadcrumb',
      }
    };
    return RET_VAL;
  }
}
