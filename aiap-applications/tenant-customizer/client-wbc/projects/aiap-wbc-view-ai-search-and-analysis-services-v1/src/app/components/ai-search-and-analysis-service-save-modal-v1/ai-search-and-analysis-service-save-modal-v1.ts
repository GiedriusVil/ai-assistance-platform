/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  ChangeDetectorRef,
} from '@angular/core';

import { of } from 'rxjs';
import {
  catchError,
  takeUntil,
} from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  BaseModal,
} from 'client-shared-views';

import {
  AiSearchAndAnalysisServicesServiceV1,
} from 'client-services';

import {
  AI_SEARCH_AND_ANALYSIS_SERVICES_MESSAGES,
} from '../../messages';

@Component({
  selector: 'aiap-ai-search-and-analysis-service-save-modal-v1',
  templateUrl: './ai-search-and-analysis-service-save-modal-v1.html',
  styleUrls: ['./ai-search-and-analysis-service-save-modal-v1.scss']
})
export class AiSearchAndAnalysisServiceSaveModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  static getClassName() {
    return 'AiSearchAndAnalysisServiceSaveModalV1';
  }

  _selections: any = {
    types: [
      {
        content: 'Watson Discovery Service',
        type: 'WDS',
        selected: false
      },
    ],
    type: null,
    authTypes: [ // this probably should go to wlt component
      { type: 'iam', content: 'IAM', selected: false },
    ],
    authType: null,
    isPasswordShown: false,
  };

  _aiSearchAndAnalysisService = {
    id: null,
    type: 'WDS',
    name: null,
    external: {
      version: null,
      url: null,
      authType: null,
      username: null,
      password: null,
    },
  };

  selections: any = lodash.cloneDeep(this._selections);
  aiSearchAndAnalysisService: any = lodash.cloneDeep(this._aiSearchAndAnalysisService);

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private aiSearchAndAnalysisServicesService: AiSearchAndAnalysisServicesServiceV1,
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
  ) {
    super();
  }

  ngOnInit() {
    this.superNgOnInit(this.eventsService);
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit() {
    //
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleLoadFormDataError(error: any) {
    _errorX(AiSearchAndAnalysisServiceSaveModalV1.getClassName(), 'refreshFormData',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_SERVICES_MESSAGES.ERROR.FIND_ONE_BY_ID);
    return of();
  }

  _sanitizedSearchAndAnalysisService() {
    const RET_VAL = lodash.cloneDeep(this.aiSearchAndAnalysisService);

    return RET_VAL;
  }

  save() {
    const AI_SEARCH_AND_ANALYSIS_SERVICE = this._sanitizedSearchAndAnalysisService();
    _debugX(AiSearchAndAnalysisServiceSaveModalV1.getClassName(), 'save',
      {
        AI_SEARCH_AND_ANALYSIS_SERVICE,
      });

    this.eventsService.loadingEmit(true);
    this.aiSearchAndAnalysisServicesService.saveOne(AI_SEARCH_AND_ANALYSIS_SERVICE)
      .pipe(
        catchError((error) => this.handleSaveOneError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(AiSearchAndAnalysisServiceSaveModalV1.getClassName(), 'save',
          {
            response,
          });

        this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_SERVICES_MESSAGES.SUCCESS.SAVE_ONE);
        this.eventsService.filterEmit(undefined)
        this.isOpen = false;
      });
  }

  show(aiSearchAndAnalysisService: any = null) {
    this.selections = lodash.cloneDeep(this._selections);

    this.setSearchAndAnalysisServiceType(this.selections, aiSearchAndAnalysisService);
    this.setAuthType(this.selections, aiSearchAndAnalysisService);

    let newAiSearchAndAnalysisService;
    if (
      lodash.isEmpty(aiSearchAndAnalysisService?.id)
    ) {
      newAiSearchAndAnalysisService = lodash.cloneDeep(this._aiSearchAndAnalysisService);
    } else {
      newAiSearchAndAnalysisService = lodash.cloneDeep(aiSearchAndAnalysisService);
    }
    if (
      lodash.isEmpty(newAiSearchAndAnalysisService?.external)
    ) {
      newAiSearchAndAnalysisService.external = lodash.cloneDeep(this._aiSearchAndAnalysisService?.external);
    }
    this.aiSearchAndAnalysisService = newAiSearchAndAnalysisService;

    this.isOpen = true;
  }

  setSearchAndAnalysisServiceType(selections: any, aiSearchAndAnalysisService: any) {
    if (lodash.isEmpty(aiSearchAndAnalysisService)) {
      return;
    }
    const NEW_SELECTIONS = lodash.cloneDeep(selections);
    if (aiSearchAndAnalysisService.type) {
      for (const TYPE of NEW_SELECTIONS.types) {
        if (
          TYPE.type === aiSearchAndAnalysisService.type
        ) {
          TYPE.selected = true;
          NEW_SELECTIONS.type = TYPE;
        }
      }
    }
    this.selections = lodash.cloneDeep(NEW_SELECTIONS);
  }

  setAuthType(selections: any, aiSearchAndAnalysisService: any) {
    if (lodash.isEmpty(aiSearchAndAnalysisService)) {
      return;
    }
    const NEW_SELECTIONS = lodash.cloneDeep(selections);
    if (aiSearchAndAnalysisService?.external?.authType) {
      for (const AUTH_TYPE of NEW_SELECTIONS.authTypes) {
        if (
          AUTH_TYPE.type === aiSearchAndAnalysisService?.external?.authType
        ) {
          AUTH_TYPE.selected = true;
          NEW_SELECTIONS.authType = AUTH_TYPE;
        }
      }
    }
    this.selections = NEW_SELECTIONS;
  }

  handleSaveOneError(error: any) {
    _errorX(AiSearchAndAnalysisServiceSaveModalV1.getClassName(), 'handleSaveOneError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_SERVICES_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

  onTypeSelected() {
    this.aiSearchAndAnalysisService.type = this.selections?.type?.type;
    _debugX(AiSearchAndAnalysisServiceSaveModalV1.getClassName(), 'onTypeSelected',
      {
        this_aiSearchAndAnalysisService: this.aiSearchAndAnalysisService,
        this_selections: this.selections,
      });
  }

  handleEventSave(event: any) {
    _debugX(AiSearchAndAnalysisServiceSaveModalV1.getClassName(), 'handleEventSave',
      {
        event,
      });

    this.save();
  }

}
