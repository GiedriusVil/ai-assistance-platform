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
  selector: 'aiap-ai-translation-services-changes-view-v1',
  templateUrl: './ai-translation-services-changes-view-v1.html',
  styleUrls: ['./ai-translation-services-changes-view-v1.scss'],
})
export class AiTranslationServicesChangesViewV1 extends BaseViewV1 implements OnInit {

  static getClassName() {
    return 'AiTranslationServicesChangesViewV1';
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
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, AiTranslationServicesChangesViewV1.getClassName());
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.wbc = WBC;
      STATE_NEW.activatedRoute = this.activatedRoute;
      STATE_NEW.router = this.router;
      STATE_NEW.ngZone = this.ngZone;
      _debugX(AiTranslationServicesChangesViewV1.getClassName(), `loadConfiguration`, {
        STATE_NEW,
        SESSION,
        WBC,
      });
      this.state = STATE_NEW;
    } catch (error) {
      _errorX(AiTranslationServicesChangesViewV1.getClassName(), 'loadConfiguration', { error });
      throw error;
    }
  }

  static route() {
    const RET_VAL = {
      path: 'ai-translation-services-changes-v1',
      component: AiTranslationServicesChangesViewV1,
      data: {
        name: 'ai_translation_services_changes_view_v1.name',
        breadcrumb: 'ai_translation_services_changes_view_v1.breadcrumb',
        component: AiTranslationServicesChangesViewV1.getClassName(),
        description: 'ai_translation_services_changes_view_v1.description',
        actions: [
          {
            name: 'View AI Translation Service change',
            component: 'ai_translation_services_changes.view.actions.view',
            description: 'Allows viewing of AI Translation Services changes',
          }
        ]
      }
    };
    return RET_VAL;
  }
}
