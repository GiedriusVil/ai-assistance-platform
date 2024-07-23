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
} from '@angular/core';

import { Router } from '@angular/router';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  WbcLocationServiceV1,
  QueryServiceV1,
  EventsServiceV1,
} from 'client-shared-services';

import { BaseViewV1 } from 'client-shared-views';

import {
  OUTLETS,
  DEFAULT_TABLE,
} from 'client-utils';

import {
  AiTranslationServiceDeleteModalV1,
  AiTranslationServiceSaveModalV1,
  AiTranslationServiceImportModalV1,
} from '../components';


@Component({
  selector: 'aiap-ai-translation-services-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class AiTranslationServicesViewV1 extends BaseViewV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiTranslationServicesViewV1';
  }

  @ViewChild('aiTranslationServiceDeleteModal') aiTranslationServiceDeleteModal: AiTranslationServiceDeleteModalV1;
  @ViewChild('aiTranslationServiceSaveModal') aiTranslationServiceSaveModal: AiTranslationServiceSaveModalV1;
  @ViewChild('aiTranslationServiceImportModal') aiTranslationServiceImportModal: AiTranslationServiceImportModalV1;

  outlet = OUTLETS.tenantCustomizer;

  constructor(
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

  handleShowSavePlaceEvent(event: any) {
    _debugX(AiTranslationServicesViewV1.getClassName(), 'showAiTranslationServiceSaveModal', { event });
    const AI_TRANSLATION_SERVICE = event?.value;
    this.aiTranslationServiceSaveModal.show(AI_TRANSLATION_SERVICE);
  }

  handleShowPlaceEvent(event: any) {
    const NAVIGATION: any = {};
    try {
      _debugX(AiTranslationServicesViewV1.getClassName(), 'handleShowAiTranslationModelsPlaceEvent', { event });
      NAVIGATION.extras = {
        queryParams: {
          aiTranslationServiceId: event?.id,
        }
      };
      switch (event?.type) {
        case 'WATSONX':
          NAVIGATION.path = '(tenantCustomizer:main-view/ai-translation-services/ai-translation-prompts)';
          break;
        case 'WLT':
          NAVIGATION.path = '(tenantCustomizer:main-view/ai-translation-services/ai-translation-models)';
          break;
      }
      _debugX(AiTranslationServicesViewV1.getClassName(), 'handleShowAiTranslationModelsPlaceEvent', { event, NAVIGATION });
      this.wbcLocationService.navigateToPathByEnvironmentServiceV1(NAVIGATION.path, NAVIGATION.extras);
    } catch (error) {
      _errorX(AiTranslationServicesViewV1.getClassName(), 'handleShowAiTranslationModelsPlaceEvent', { event, NAVIGATION });
      throw error;
    }
  }

  handleShowImportModalEvent(event: any) {
    _debugX(AiTranslationServicesViewV1.getClassName(), 'showAiTranslationServiceImportModal', { event });
    this.aiTranslationServiceImportModal.show();
  }

  handleShowRemovePlaceEvent(ids: any) {
    _debugX(AiTranslationServicesViewV1.getClassName(), `handleShowRemovePlaceEvent`, { ids });
    this.aiTranslationServiceDeleteModal.show(ids);
  }

  handleSearchChangeEvent(event: any) {
    _debugX(AiTranslationServicesViewV1.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(DEFAULT_TABLE.AI_TRANSLATION_SERVICES_V1.TYPE, QueryServiceV1.FILTER_KEY.SEARCH, event);

    const QUERY = this.queryService.query(DEFAULT_TABLE.AI_TRANSLATION_SERVICES_V1.TYPE);

    _debugX(AiTranslationServicesViewV1.getClassName(), `handleSearchChangeEvent`, { QUERY });
    this.eventsService.filterEmit(QUERY);
  }

  handleSearchClearEvent(event: any) {
    _debugX(AiTranslationServicesViewV1.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.setFilterItem(DEFAULT_TABLE.AI_TRANSLATION_SERVICES_V1.TYPE, QueryServiceV1.FILTER_KEY.SEARCH, event);

    const QUERY = this.queryService.query(DEFAULT_TABLE.AI_TRANSLATION_SERVICES_V1.TYPE);

    _debugX(AiTranslationServicesViewV1.getClassName(), `handleSearchClearEvent`, { QUERY });
    this.eventsService.filterEmit(QUERY);
  }
}
