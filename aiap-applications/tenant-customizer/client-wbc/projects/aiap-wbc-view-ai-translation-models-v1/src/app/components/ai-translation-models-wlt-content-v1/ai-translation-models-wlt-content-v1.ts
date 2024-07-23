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

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  WbcLocationServiceV1,
  QueryServiceV1,
  EventsServiceV1,
} from 'client-shared-services';

import {
  BaseViewV1,
} from 'client-shared-views';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  AiTranslationModelDeleteModalV1,
  AiTranslationModelSaveModalV1,
  AiTranslationModelImportModalV1,
  AiTranslationServiceIdentifyLanguageModalV1
} from '../';

@Component({
  selector: 'aiap-ai-translation-models-wlt-content-v1',
  templateUrl: './ai-translation-models-wlt-content-v1.html',
  styleUrls: ['./ai-translation-models-wlt-content-v1.scss'],
})
export class AiTranslationModelWLTContentV1 extends BaseViewV1 implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  static getClassName() {
    return 'AiTranslationModelWLTContentV1';
  }

  @ViewChild('aiTranslationModelDeleteModal') aiTranslationModelDeleteModal: AiTranslationModelDeleteModalV1;
  @ViewChild('aiTranslationModelSaveModal') aiTranslationModelSaveModal: AiTranslationModelSaveModalV1;
  @ViewChild('aiTranslationModelImportModal') aiTranslationModelImportModal: AiTranslationModelImportModalV1;
  @ViewChild('aiTranslationServiceIdentifyLanguageModal') aiTranslationServiceIdentifyLanguageModal: AiTranslationServiceIdentifyLanguageModalV1;
  
  @Input() aiTranslationServiceId: string;
  @Input() aiTranslationService: any;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
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
    _debugX(AiTranslationModelWLTContentV1.getClassName(), 'showAiTranslationModelsSaveModal', { event, aiTranslationService: this.aiTranslationService });
    const AI_TRANSLATION_MODEL = event?.value;
    this.aiTranslationModelSaveModal.show(AI_TRANSLATION_MODEL, this.aiTranslationService);
  }

  handleShowPlaceEvent(event: any) {
    const NAVIGATION: any = {};
    try {
      _debugX(AiTranslationModelWLTContentV1.getClassName(), 'handleShowPlaceEvent', { event });
      NAVIGATION.path = '(tenantCustomizer:main-view/ai-translation-services/ai-translation-models/ai-translation-model-examples)';
      NAVIGATION.extras = {
        queryParams: {
          aiTranslationModelId: event?.id,
          aiTranslationServiceId: this.aiTranslationServiceId,
        }
      };
      _debugX(AiTranslationModelWLTContentV1.getClassName(), 'handleShowPlaceEvent', { event, NAVIGATION });
      this.wbcLocationService.navigateToPathByEnvironmentServiceV1(NAVIGATION.path, NAVIGATION.extras);
    } catch (error) {
      _errorX(AiTranslationModelWLTContentV1.getClassName(), 'handleShowPlaceEvent', { event, NAVIGATION });
      throw error;
    }
  }

  handleShowImportModalEvent(event: any) {
    _debugX(AiTranslationModelWLTContentV1.getClassName(), 'showAiTranslationModelsSaveModal', { event });
    this.aiTranslationModelImportModal.show();
  }

  handleShowRemovePlaceEvent(ids: any) {
    _debugX(AiTranslationModelWLTContentV1.getClassName(), `handleShowRemovePlaceEvent`, { ids });
    this.aiTranslationModelDeleteModal.show(ids);
  }

  handleIdentifyLanguagePlaceEvent(event: any) {
    _debugX(AiTranslationModelWLTContentV1.getClassName(), `handleIdentifyLanguagePlaceEvent`, { event });
    this.aiTranslationServiceIdentifyLanguageModal.show(this.aiTranslationServiceId);
  }

  handleSearchChangeEvent(event: any) {
    _debugX(AiTranslationModelWLTContentV1.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(DEFAULT_TABLE.AI_TRANSLATION_MODELS_V1.TYPE, QueryServiceV1.FILTER_KEY.SEARCH, event);

    const QUERY = this.queryService.query(DEFAULT_TABLE.AI_TRANSLATION_MODELS_V1.TYPE);

    _debugX(AiTranslationModelWLTContentV1.getClassName(), `handleSearchChangeEvent`, { QUERY });
    this.eventsService.filterEmit(QUERY);
  }

  handleSearchClearEvent(event: any) {
    _debugX(AiTranslationModelWLTContentV1.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.setFilterItem(DEFAULT_TABLE.AI_TRANSLATION_MODELS_V1.TYPE, QueryServiceV1.FILTER_KEY.SEARCH, event);

    const QUERY = this.queryService.query(DEFAULT_TABLE.AI_TRANSLATION_MODELS_V1.TYPE);

    _debugX(AiTranslationModelWLTContentV1.getClassName(), `handleSearchClearEvent`, { QUERY });
    this.eventsService.filterEmit(QUERY);
  }
}
