/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, AfterViewChecked, ChangeDetectorRef, Input } from '@angular/core';
import { of } from 'rxjs';

import { catchError, takeUntil, tap } from 'rxjs/operators';

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
  AiSearchAndAnalysisCollectionsServiceV1,
} from 'client-services';

import {
  AI_SEARCH_AND_ANALYSIS_COLLECTIONS_MESSAGES,
} from '../../messages';

@Component({
  selector: 'aiap-ai-search-and-analysis-collection-save-modal-v1',
  templateUrl: './ai-search-and-analysis-collection-save-modal-v1.html',
  styleUrls: ['./ai-search-and-analysis-collection-save-modal-v1.scss']
})
export class AiSearchAndAnalysisCollectionSaveModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  static getClassName() {
    return 'AiSearchAndAnalysisCollectionSaveModalV1';
  }

  @Input() aiSearchAndAnalysisServiceId: string;
  @Input() aiSearchAndAnalysisProjectId: string;

  _selections = {
    languages: [],
  };

  _aiSearchAndAnalysisCollection = {
    id: null,
    description: null,
    name: null,
    language: null
  };

  selections = lodash.cloneDeep(this._selections);
  aiSearchAndAnalysisCollection = lodash.cloneDeep(this._aiSearchAndAnalysisCollection);

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private aiSearchAndAnalysisCollectionsService: AiSearchAndAnalysisCollectionsServiceV1,
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

  refreshFormData() {
    _debugX(AiSearchAndAnalysisCollectionSaveModalV1.getClassName(), 'refreshFormData');
    this.eventsService.loadingEmit(true);
    this.aiSearchAndAnalysisCollectionsService.loadAiSearchAndAnalysisCollectionsFormData()
      .pipe(
        tap(),
        catchError((error) => this.handleLoadFormDataError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(AiSearchAndAnalysisCollectionSaveModalV1.getClassName(), 'refreshFormData',
          {
            response,
          });

        const NEW_SELECTIONS = lodash.cloneDeep(this._selections);

        this.setSelectionsLanguages(NEW_SELECTIONS, response);

        _debugX(AiSearchAndAnalysisCollectionSaveModalV1.getClassName(), 'refreshFormData',
          {
            NEW_SELECTIONS,
          });

        this.selections = NEW_SELECTIONS;
        this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_COLLECTIONS_MESSAGES.SUCCESS.FIND_ONE_BY_ID);
        this.eventsService.loadingEmit(false);
        this.isOpen = true;
      });
  }

  handleLoadFormDataError(error: any) {
    _errorX(AiSearchAndAnalysisCollectionSaveModalV1.getClassName(), 'refreshFormData',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_COLLECTIONS_MESSAGES.ERROR.FIND_ONE_BY_ID);
    return of();
  }

  _sanitizedSearchAndAnalysisCollection() {
    const RET_VAL = lodash.cloneDeep(this.aiSearchAndAnalysisCollection);

    return RET_VAL;
  }

  save() {
    const AI_SEARCH_AND_ANALYSIS_COLLECTION = this._sanitizedSearchAndAnalysisCollection();
    _debugX(AiSearchAndAnalysisCollectionSaveModalV1.getClassName(), 'save',
      {
        AI_SEARCH_AND_ANALYSIS_COLLECTION,
      });

    this.eventsService.loadingEmit(true);
    const PARAMS = {
      aiSearchAndAnalysisServiceId: this.aiSearchAndAnalysisServiceId,
      aiSearchAndAnalysisProjectId: this.aiSearchAndAnalysisProjectId,
    };
    this.aiSearchAndAnalysisCollectionsService.saveOne(AI_SEARCH_AND_ANALYSIS_COLLECTION, PARAMS)
      .pipe(
        catchError((error) => this.handleSaveOneError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(AiSearchAndAnalysisCollectionSaveModalV1.getClassName(), 'save',
          {
            response,
          });

        this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_COLLECTIONS_MESSAGES.SUCCESS.SAVE_ONE);
        this.eventsService.filterEmit(undefined)
        this.isOpen = false;
      });
  }

  show(aiSearchAndAnalysisCollection: any = null) {
    this.selections = lodash.cloneDeep(this._selections);

    let newAiSearchAndAnalysisCollection;
    if (
      lodash.isEmpty(aiSearchAndAnalysisCollection?.id)
    ) {
      newAiSearchAndAnalysisCollection = lodash.cloneDeep(this._aiSearchAndAnalysisCollection);
    } else {
      newAiSearchAndAnalysisCollection = lodash.cloneDeep(aiSearchAndAnalysisCollection);
    }

    this.aiSearchAndAnalysisCollection = newAiSearchAndAnalysisCollection;

    this.isOpen = true;
    this.refreshFormData();
  }

  handleSaveOneError(error: any) {
    _errorX(AiSearchAndAnalysisCollectionSaveModalV1.getClassName(), 'handleSaveOneError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_COLLECTIONS_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

  onLanguageSelected(event: any) {
    const LANGUAGE = event?.item;
    this.aiSearchAndAnalysisCollection.language = LANGUAGE?.code;
    _debugX(AiSearchAndAnalysisCollectionSaveModalV1.getClassName(), 'onLanguageSelected',
      {
        LANGUAGE: LANGUAGE,
        this_aiSearchAndAnalysisCollection: this.aiSearchAndAnalysisCollection,
        this_selections: this.selections,
      });
  }

  setSelectionsLanguages(selections: any, languages: any[]) {
    const LANG_DROPDOWN_ITEMS = [];

    if (
      languages?.length > 0
    ) {
      languages.forEach((language: any) => {
        const TMP_LANGUAGE = this._transformLanguageIntoDropDownItem(language);
        if (
          TMP_LANGUAGE
        ) {
          LANG_DROPDOWN_ITEMS.push(TMP_LANGUAGE);

          if (
            TMP_LANGUAGE.selected
          ) {
            selections.language = TMP_LANGUAGE;
          }
        }
      });
    }

    selections.languages = LANG_DROPDOWN_ITEMS;
  }

  _transformLanguageIntoDropDownItem(language: any) {
    let retVal;
    if (
      language &&
      language.name &&
      language.code
    ) {
      const LANG_NAME = language.name;
      const isSelected = this.aiSearchAndAnalysisCollection?.language === language.code;
      retVal = {
        content: `${LANG_NAME}`,
        selected: isSelected,
        code: language.code,
      }
    }
    return retVal;
  }

  handleEventSave(event: any) {
    _debugX(AiSearchAndAnalysisCollectionSaveModalV1.getClassName(), 'handleEventSave',
      {
        event,
      });

    this.save();
  }

}
