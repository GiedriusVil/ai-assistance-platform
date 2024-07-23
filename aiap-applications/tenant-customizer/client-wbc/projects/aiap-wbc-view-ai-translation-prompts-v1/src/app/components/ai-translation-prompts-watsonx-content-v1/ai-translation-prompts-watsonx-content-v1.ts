/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  AfterViewChecked,
  Input,
} from '@angular/core';

import { Router } from '@angular/router';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  ActivatedRouteServiceV1,
  WbcLocationServiceV1,
  QueryServiceV1,
  EventsServiceV1,
} from 'client-shared-services';

import {
  BaseViewV1,
} from 'client-shared-views';

import {
  OUTLETS,
  DEFAULT_TABLE,
} from 'client-utils';

import {
  AiTranslationPromptDeleteModalV1,
  AiTranslationPromptSaveModalV1,
  AiTranslationPromptImportModalV1,
} from '..';

@Component({
  selector: 'aiap-ai-translation-prompts-watsonx-content-v1',
  templateUrl: './ai-translation-prompts-watsonx-content-v1.html',
  styleUrls: ['./ai-translation-prompts-watsonx-content-v1.scss'],
})
export class AiTranslationPromptsWatsonxContentV1 extends BaseViewV1 implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  static getClassName() {
    return 'AiTranslationPromptsWatsonxContentV1';
  }

  @ViewChild('aiTranslationPromptDeleteModal') aiTranslationPromptDeleteModal: AiTranslationPromptDeleteModalV1;
  @ViewChild('aiTranslationPromptSaveModal') aiTranslationPromptSaveModal: AiTranslationPromptSaveModalV1;
  @ViewChild('aiTranslationPromptImportModal') aiTranslationPromptImportModal: AiTranslationPromptImportModalV1;
  
  @Input() aiTranslationServiceId: string;
  @Input() aiTranslationService: any;

  query: any = {
    filter: {},
    sort: {
      field: 'id',
      direction: 'desc'
    },
    pagination: {
      page: 1,
      size: 10,
    }
  };

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private ActivatedRouteServiceV1: ActivatedRouteServiceV1,
    private router: Router,
    private wbcLocationService: WbcLocationServiceV1,
    private queryService: QueryServiceV1,
    private eventsService: EventsServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    //
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  handleShowSavePlaceEvent(event: any) {
    _debugX(AiTranslationPromptsWatsonxContentV1.getClassName(), 'handleShowSavePlaceEvent', { event, aiTranslationService: this.aiTranslationService });
    const AI_TRANSLATION_PROMPT = event?.value;
    this.aiTranslationPromptSaveModal.show(AI_TRANSLATION_PROMPT, this.aiTranslationService);
  }

  handleShowPlaceEvent(event: any) {
    const NAVIGATION: any = {};
    try {
      _debugX(AiTranslationPromptsWatsonxContentV1.getClassName(), 'handleShowPlaceEvent', { event });
      NAVIGATION.path = '(tenantCustomizer:main-view/ai-translation-services/ai-translation-prompts/ai-translation-prompt-configuration)';
      NAVIGATION.extras = {
        queryParams: {
          aiTranslationPromptId: event?.id,
          aiTranslationServiceId: this.aiTranslationServiceId,
        }
      };
      _debugX(AiTranslationPromptsWatsonxContentV1.getClassName(), 'handleShowPlaceEvent', { event, NAVIGATION });
      this.wbcLocationService.navigateToPathByEnvironmentServiceV1(NAVIGATION.path, NAVIGATION.extras);
    } catch (error) {
      _errorX(AiTranslationPromptsWatsonxContentV1.getClassName(), 'handleShowPlaceEvent', { event, NAVIGATION });
      throw error;
    }
  }

  handleShowImportModalEvent(event: any) {
    _debugX(AiTranslationPromptsWatsonxContentV1.getClassName(), 'handleShowImportModalEvent', { event });
    this.aiTranslationPromptImportModal.show();
  }

  handleShowRemovePlaceEvent(ids: any) {
    _debugX(AiTranslationPromptsWatsonxContentV1.getClassName(), `handleShowRemovePlaceEvent`, { ids });
    this.aiTranslationPromptDeleteModal.show(ids);
  }

  handleSearchChangeEvent(event: any) {
    _debugX(AiTranslationPromptsWatsonxContentV1.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(DEFAULT_TABLE.AI_TRANSLATION_PROMPTS_V1.TYPE, QueryServiceV1.FILTER_KEY.SEARCH, event);

    const QUERY = this.queryService.query(DEFAULT_TABLE.AI_TRANSLATION_PROMPTS_V1.TYPE);

    _debugX(AiTranslationPromptsWatsonxContentV1.getClassName(), `handleSearchChangeEvent`, { QUERY });
    this.eventsService.filterEmit(QUERY);
  }

  handleSearchClearEvent(event: any) {
    _debugX(AiTranslationPromptsWatsonxContentV1.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.setFilterItem(DEFAULT_TABLE.AI_TRANSLATION_PROMPTS_V1.TYPE, QueryServiceV1.FILTER_KEY.SEARCH, event);

    const QUERY = this.queryService.query(DEFAULT_TABLE.AI_TRANSLATION_PROMPTS_V1.TYPE);

    _debugX(AiTranslationPromptsWatsonxContentV1.getClassName(), `handleSearchClearEvent`, { QUERY });
    this.eventsService.filterEmit(QUERY);
  }
}
