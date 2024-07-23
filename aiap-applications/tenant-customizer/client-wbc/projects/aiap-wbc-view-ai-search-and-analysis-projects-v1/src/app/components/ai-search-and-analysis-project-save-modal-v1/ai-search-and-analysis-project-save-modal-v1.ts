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
  Input,
} from '@angular/core';

import { of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

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
  AiSearchAndAnalysisProjectsServiceV1,
} from 'client-services';

import {
  AI_SEARCH_AND_ANALYSIS_PROJECTS_MESSAGES,
} from '../../messages';

@Component({
  selector: 'aiap-ai-search-and-analysis-project-save-modal-v1',
  templateUrl: './ai-search-and-analysis-project-save-modal-v1.html',
  styleUrls: ['./ai-search-and-analysis-project-save-modal-v1.scss']
})
export class AiSearchAndAnalysisProjectSaveModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  static getClassName() {
    return 'AiSearchAndAnalysisProjectSaveModalV1';
  }

  @Input() aiSearchAndAnalysisServiceId: string;

  _selections = {
    types: [
      {
        content: 'Document Retrieval',
        type: 'documentRetrieval',
        selected: false
      },
      {
        content: 'Conversational Search',
        type: 'conversationalSearch',
        selected: false
      },
    ],
    type: null,
  };

  _aiSearchAndAnalysisProject = {
    id: null,
    type: null,
    name: null,
  };

  selections = lodash.cloneDeep(this._selections);
  aiSearchAndAnalysisProject = lodash.cloneDeep(this._aiSearchAndAnalysisProject);

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private aiSearchAndAnalysisProjectsService: AiSearchAndAnalysisProjectsServiceV1,
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
    _errorX(AiSearchAndAnalysisProjectSaveModalV1.getClassName(), 'refreshFormData',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_PROJECTS_MESSAGES.ERROR.FIND_ONE_BY_ID);
    return of();
  }

  _sanitizedSearchAndAnanysisProject() {
    const RET_VAL = lodash.cloneDeep(this.aiSearchAndAnalysisProject);

    return RET_VAL;
  }

  save() {
    const AI_SEARCH_AND_ANALYSIS_PROJECT = this._sanitizedSearchAndAnanysisProject();
    _debugX(AiSearchAndAnalysisProjectSaveModalV1.getClassName(), 'save',
      {
        AI_SEARCH_AND_ANALYSIS_PROJECT,
      });

    this.eventsService.loadingEmit(true);
    const PARAMS = {
      aiSearchAndAnalysisServiceId: this.aiSearchAndAnalysisServiceId,
    };
    this.aiSearchAndAnalysisProjectsService.saveOne(AI_SEARCH_AND_ANALYSIS_PROJECT, PARAMS)
      .pipe(
        catchError((error) => this.handleSaveOneError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(AiSearchAndAnalysisProjectSaveModalV1.getClassName(), 'save',
          {
            response,
          });

        this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_PROJECTS_MESSAGES.SUCCESS.SAVE_ONE);
        this.eventsService.filterEmit(undefined)
        this.isOpen = false;
      });
  }

  show(aiSearchAndAnalysisProject: any = null) {
    this.selections = lodash.cloneDeep(this._selections);

    this.setSearchAndAnalysisProjectType(this.selections, aiSearchAndAnalysisProject);

    let newAiSearchAndAnalysisProject;
    if (
      lodash.isEmpty(aiSearchAndAnalysisProject?.id)
    ) {
      newAiSearchAndAnalysisProject = lodash.cloneDeep(this._aiSearchAndAnalysisProject);
    } else {
      newAiSearchAndAnalysisProject = lodash.cloneDeep(aiSearchAndAnalysisProject);
    }

    this.aiSearchAndAnalysisProject = newAiSearchAndAnalysisProject;

    this.isOpen = true;
  }

  setSearchAndAnalysisProjectType(selections: any, aiSearchAndAnalysisProject: any) {
    if (lodash.isEmpty(aiSearchAndAnalysisProject)) {
      return;
    }
    const NEW_SELECTIONS = lodash.cloneDeep(selections);
    if (aiSearchAndAnalysisProject.type) {
      for (const TYPE of NEW_SELECTIONS.types) {
        if (
          TYPE.type === aiSearchAndAnalysisProject.type
        ) {
          TYPE.selected = true;
          NEW_SELECTIONS.type = TYPE;
        }
      }
    }
    this.selections = lodash.cloneDeep(NEW_SELECTIONS);
  }

  handleSaveOneError(error: any) {
    _errorX(AiSearchAndAnalysisProjectSaveModalV1.getClassName(), 'handleSaveOneError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_PROJECTS_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

  onTypeSelected() {
    this.aiSearchAndAnalysisProject.type = this.selections?.type?.type;
    _debugX(AiSearchAndAnalysisProjectSaveModalV1.getClassName(), 'onTypeSelected',
      {
        this_aiSearchAndAnalysisProject: this.aiSearchAndAnalysisProject,
        this_selections: this.selections,
      });
  }


  handleEventSave(event: any) {
    _debugX(AiSearchAndAnalysisProjectSaveModalV1.getClassName(), 'handleEventSave',
      {
        event,
      });

    this.save();
  }

}
