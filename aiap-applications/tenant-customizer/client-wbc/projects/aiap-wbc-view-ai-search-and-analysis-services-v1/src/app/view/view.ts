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

import * as lodash from 'lodash';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
  WbcLocationServiceV1,
} from 'client-shared-services';

import {
  BaseViewV1,
} from 'client-shared-views';

import {
  OUTLETS,
  DEFAULT_TABLE,
} from 'client-utils';

import {
  AiSearchAndAnalysisServiceDeleteModalV1,
  AiSearchAndAnalysisServiceSaveModalV1,
  AiSearchAndAnalysisServiceImportModalV1,
} from '../components';


@Component({
  selector: 'aiap-ai-search-and-analysis-services-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class AiSearchAndAnalysisServicesViewV1 extends BaseViewV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiSearchAndAnalysisServicesViewV1';
  }

  @ViewChild('aiSearchAndAnalysisServiceDeleteModal') aiSearchAndAnalysisServiceDeleteModal: AiSearchAndAnalysisServiceDeleteModalV1;
  @ViewChild('aiSearchAndAnalysisServiceSaveModal') aiSearchAndAnalysisServiceSaveModal: AiSearchAndAnalysisServiceSaveModalV1;
  @ViewChild('aiSearchAndAnalysisServiceImportModal') aiSearchAndAnalysisServiceImportModal: AiSearchAndAnalysisServiceImportModalV1;

  outlet = OUTLETS.tenantCustomizer;

  constructor(
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
    _debugX(AiSearchAndAnalysisServicesViewV1.getClassName(), 'showAiSearchAndAnalysisServiceSaveModal',
      {
        event,
      });

    const AI_SEARCH_AND_ANALYSIS_SERVICE = event;
    this.aiSearchAndAnalysisServiceSaveModal.show(AI_SEARCH_AND_ANALYSIS_SERVICE);
  }

  handleShowPlaceEvent(event: any) {
    const NAVIGATION: any = {};
    try {
      _debugX(AiSearchAndAnalysisServicesViewV1.getClassName(), 'handleShowAiSearchAndAnalysisModelsPlaceEvent',
        {
          event,
        });

      NAVIGATION.extras = {
        queryParams: {
          aiSearchAndAnalysisServiceId: event?.id,
        }
      };
      NAVIGATION.path = '(tenantCustomizer:main-view/ai-search-and-analysis-services/ai-search-and-analysis-projects)';
      _debugX(AiSearchAndAnalysisServicesViewV1.getClassName(), 'handleShowAiSearchAndAnalysisModelsPlaceEvent',
        {
          event,
          NAVIGATION,
        });

      this.wbcLocationService.navigateToPath(NAVIGATION.path, NAVIGATION.extras);
      this.wbcLocationService.navigateToPathByEnvironmentServiceV1(NAVIGATION.path, NAVIGATION.extras);
    } catch (error) {
      _errorX(AiSearchAndAnalysisServicesViewV1.getClassName(), 'handleShowAiSearchAndAnalysisModelsPlaceEvent',
        {
          event,
          NAVIGATION,
        });
      throw error;
    }
  }

  handleShowImportModalEvent(event: any) {
    _debugX(AiSearchAndAnalysisServicesViewV1.getClassName(), 'showAiSearchAndAnalysisServiceImportModal',
      {
        event,
      });

    this.aiSearchAndAnalysisServiceImportModal.show();
  }

  handleShowRemovePlaceEvent(ids: any) {
    _debugX(AiSearchAndAnalysisServicesViewV1.getClassName(), `handleShowRemovePlaceEvent`,
      {
        ids,
      });

    this.aiSearchAndAnalysisServiceDeleteModal.show(ids);
  }

  handleSearchChangeEvent(event: any) {
    _debugX(AiSearchAndAnalysisServicesViewV1.getClassName(), `handleSearchChangeEvent`,
      {
        event,
      });

    this.queryService.setFilterItem(DEFAULT_TABLE.AI_SEARCH_AND_ANALYSIS_SERVICES_V1.TYPE, QueryServiceV1.FILTER_KEY.SEARCH, event);
    const QUERY = this.queryService.query(DEFAULT_TABLE.AI_SEARCH_AND_ANALYSIS_SERVICES_V1.TYPE);
    _debugX(AiSearchAndAnalysisServicesViewV1.getClassName(), `handleSearchChangeEvent`,
      {
        QUERY,
      });

    this.eventsService.filterEmit(QUERY);
  }

  handleSearchClearEvent(event: any) {
    _debugX(AiSearchAndAnalysisServicesViewV1.getClassName(), `handleSearchClearEvent`,
      {
        event,
      });
    this.queryService.setFilterItem(DEFAULT_TABLE.AI_SEARCH_AND_ANALYSIS_SERVICES_V1.TYPE, QueryServiceV1.FILTER_KEY.SEARCH, event);
    const QUERY = this.queryService.query(DEFAULT_TABLE.AI_SEARCH_AND_ANALYSIS_SERVICES_V1.TYPE);
    _debugX(AiSearchAndAnalysisServicesViewV1.getClassName(), `handleSearchClearEvent`,
      {
        QUERY,
      });

    this.eventsService.filterEmit(QUERY);
  }

}
