/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';

import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  ActivatedRouteServiceV1,
  WbcLocationServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import { BaseViewV1 } from 'client-shared-views';

import {
  AiTranslationModelExampleDeleteModalV1,
  AiTranslationModelExampleSaveModalV1,
  AiTranslationModelExampleImportModalV1,
  AiTranslationModelTrainModalV1,
  AiTranslationModelTestModalV1,
} from '../components';

import {
  AiTranslationModelExamplesServiceV1,
  AiTranslationModelsServiceV1,
} from 'client-services';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  AI_TRANSLATION_MODEL_EXAMPLES_MESSAGES,
  OUTLETS,
  DEFAULT_TABLE,
} from 'client-utils';

@Component({
  selector: 'aiap-ai-translation-model-examples-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class AiTranslationModelExamplesViewV1 extends BaseViewV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiTranslationModelExamplesViewV1';
  }

  aiTranslationModelId: string;
  aiTranslationServiceId: string;
  aiTranslationModelStatus = 'DRAFT';
  aiTranslationModelSourceLanguage: string;
  aiTranslationModelTargetLanguage: string;

  @ViewChild('aiTranslationModelExampleDeleteModal') aiTranslationModelExampleDeleteModal: AiTranslationModelExampleDeleteModalV1;
  @ViewChild('aiTranslationModelExampleSaveModal') aiTranslationModelExampleSaveModal: AiTranslationModelExampleSaveModalV1;
  @ViewChild('aiTranslationModelExampleImportModal') aiTranslationModelExampleImportModal: AiTranslationModelExampleImportModalV1;
  @ViewChild('aiTranslationModelTrainModal') aiTranslationModelTrainModal: AiTranslationModelTrainModalV1;
  @ViewChild('aiTranslationModelTestModal') aiTranslationModelTestModal: AiTranslationModelTestModalV1;

  outlet = OUTLETS.tenantCustomizer;

  constructor(
    private ActivatedRouteServiceV1: ActivatedRouteServiceV1,
    private router: Router,
    private wbcLocationService: WbcLocationServiceV1,
    private notificationService: NotificationServiceV2,
    private aiTranslationModelExamplesService: AiTranslationModelExamplesServiceV1,
    private aiTranslationModelsService: AiTranslationModelsServiceV1,
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.subscribeToQueryParams();
    this.addFilterEventEventHandler();
  }

  subscribeToQueryParams() {
    this.ActivatedRouteServiceV1.queryParams()
      .subscribe((params: any) => {
        _debugX(AiTranslationModelExamplesViewV1.getClassName(), 'subscribeToQueryParams', { params: params });
        this.aiTranslationModelId = params.aiTranslationModelId;
        this.aiTranslationServiceId = params.aiTranslationServiceId;

      });
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleShowSavePlaceEvent(event: any) {
    _debugX(AiTranslationModelExamplesViewV1.getClassName(), 'showAiTranslationModelExampleSaveModal', { event });
    const AI_TRANSLATION_MODEL_EXAMPLE = event?.value;
    this.aiTranslationModelExampleSaveModal.show(AI_TRANSLATION_MODEL_EXAMPLE);
  }

  handleShowImportModalEvent(event: any) {
    _debugX(AiTranslationModelExamplesViewV1.getClassName(), 'showAiTranslationModelImportModal', { event });
    this.aiTranslationModelExampleImportModal.show();
  }

  handleShowRemovePlaceEvent(ids: any) {
    _debugX(AiTranslationModelExamplesViewV1.getClassName(), `handleShowRemovePlaceEvent`, { ids });
    this.aiTranslationModelExampleDeleteModal.show(ids);
  }

  handleTrainModel() {
    _debugX(AiTranslationModelExamplesViewV1.getClassName(), `handleTrainModel`);
    this.aiTranslationModelTrainModal.show(this.aiTranslationServiceId, this.aiTranslationModelId);
  }

  handleTestModel() {
    _debugX(AiTranslationModelExamplesViewV1.getClassName(), `handleTestModel`);
    this.aiTranslationModelTestModal.show(this.aiTranslationServiceId, this.aiTranslationModelId);
  }

  addFilterEventEventHandler() {
    this.eventsService.filterEmitter.pipe(
      switchMap((_) => {
        const QUERY = {
          filter: {
            aiTranslationServiceId: this.aiTranslationServiceId,
            aiTranslationModelId: this.aiTranslationModelId,
          },
          sort: {
            field: 'id',
            direction: 'desc'
          },
          pagination: {
            page: 1,
            size: 1,
          }
        }

        const OPTIONS = {
          refreshStatus: true,
        };

        return this.aiTranslationModelsService.findOneByQuery(QUERY, OPTIONS)
          .pipe(catchError(error => this.handleGetModelDetailsError(error)))
      }),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      this.aiTranslationModelStatus = response?.status;
      this.aiTranslationModelSourceLanguage = response?.source;
      this.aiTranslationModelTargetLanguage = response?.target;
    })
  }

  handleGetModelDetailsError(error: any) {
    _errorX(AiTranslationModelExamplesViewV1.getClassName(), `handleGetModelDetailsError`, { error });
    this.notificationService.showNotification(AI_TRANSLATION_MODEL_EXAMPLES_MESSAGES.ERROR.FIND_ONE_BY_QUERY);
    return of();
  }

  handleSearchChangeEvent(event: any) {
    _debugX(AiTranslationModelExamplesViewV1.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(DEFAULT_TABLE.AI_TRANSLATION_MODEL_EXAMPLES_V1.TYPE, QueryServiceV1.FILTER_KEY.SEARCH, event);

    const QUERY = this.queryService.query(DEFAULT_TABLE.AI_TRANSLATION_MODEL_EXAMPLES_V1.TYPE);

    _debugX(AiTranslationModelExamplesViewV1.getClassName(), `handleSearchChangeEvent`, { QUERY });
    this.eventsService.filterEmit(QUERY);
  }

  handleSearchClearEvent(event: any) {
    _debugX(AiTranslationModelExamplesViewV1.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.setFilterItem(DEFAULT_TABLE.AI_TRANSLATION_MODEL_EXAMPLES_V1.TYPE, QueryServiceV1.FILTER_KEY.SEARCH, event);

    const QUERY = this.queryService.query(DEFAULT_TABLE.AI_TRANSLATION_MODEL_EXAMPLES_V1.TYPE);

    _debugX(AiTranslationModelExamplesViewV1.getClassName(), `handleSearchClearEvent`, { QUERY });
    this.eventsService.filterEmit(QUERY);
  }
}
