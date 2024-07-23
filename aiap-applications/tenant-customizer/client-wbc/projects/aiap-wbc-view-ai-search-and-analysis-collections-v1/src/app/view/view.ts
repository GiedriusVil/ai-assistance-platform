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
  ActivatedRouteServiceV1,
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
  AiSearchAndAnalysisCollectionDeleteModalV1,
  AiSearchAndAnalysisCollectionImportModalV1,
  AiSearchAndAnalysisCollectionSaveModalV1,
  AiSearchAndAnalysisCollectionsQueryModalV1,
} from '../components';

@Component({
  selector: 'aiap-ai-search-and-analysis-collections-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class AiSearchAndAnalysisCollectionsViewV1 extends BaseViewV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiSearchAndAnalysisCollectionsViewV1';
  }

  @ViewChild('aiSearchAndAnalysisCollectionDeleteModal') aiSearchAndAnalysisCollectionDeleteModal: AiSearchAndAnalysisCollectionDeleteModalV1;
  @ViewChild('aiSearchAndAnalysisCollectionSaveModal') aiSearchAndAnalysisCollectionSaveModal: AiSearchAndAnalysisCollectionSaveModalV1;
  @ViewChild('aiSearchAndAnalysisCollectionImportModal') aiSearchAndAnalysisCollectionImportModal: AiSearchAndAnalysisCollectionImportModalV1;
  @ViewChild('aiSearchAndAnalysisCollectionQueryModal') aiSearchAndAnalysisCollectionQueryModal: AiSearchAndAnalysisCollectionsQueryModalV1;

  outlet = OUTLETS.tenantCustomizer;

  aiSearchAndAnalysisServiceId: string;
  aiSearchAndAnalysisProjectId: string;
  aiSearchAndAnalysisProjectType: string;

  constructor(
    private activatedRouteServiceV1: ActivatedRouteServiceV1,
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
    private wbcLocationService: WbcLocationServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscribeToQueryParams();
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  subscribeToQueryParams() {
    this.activatedRouteServiceV1.queryParams()
      .subscribe((params: any) => {
        _debugX(AiSearchAndAnalysisCollectionsViewV1.getClassName(), 'subscribeToQueryParams',
          {
            params,
          });

        this.aiSearchAndAnalysisServiceId = params.aiSearchAndAnalysisServiceId;
        this.aiSearchAndAnalysisProjectId = params.aiSearchAndAnalysisProjectId;
        this.aiSearchAndAnalysisProjectType = params.aiSearchAndAnalysisProjectType;
      });
  }

  handleShowSavePlaceEvent(event: any) {
    _debugX(AiSearchAndAnalysisCollectionsViewV1.getClassName(), 'showAiSearchAndAnalysisCollectionSaveModal',
      {
        event,
      });

    const AI_SEARCH_AND_ANALYSIS_COLLECTION = event;
    this.aiSearchAndAnalysisCollectionSaveModal.show(AI_SEARCH_AND_ANALYSIS_COLLECTION);
  }

  handleShowPlaceEvent(event: any) {
    const NAVIGATION: any = {};
    try {
      _debugX(AiSearchAndAnalysisCollectionsViewV1.getClassName(), 'handleShowAiSearchAndAnalysisCollectionPlaceEvent',
        {
          event,
        });

      NAVIGATION.extras = {
        queryParams: {
          aiSearchAndAnalysisCollectionId: event?.id,
          aiSearchAndAnalysisServiceId: this.aiSearchAndAnalysisServiceId,
          aiSearchAndAnalysisProjectId: this.aiSearchAndAnalysisProjectId,
        }
      };
      NAVIGATION.path = '(tenantCustomizer:main-view/ai-search-and-analysis-services/ai-search-and-analysis-projects/ai-search-and-analysis-collections/ai-search-and-analysis-documents)';
      _debugX(AiSearchAndAnalysisCollectionsViewV1.getClassName(), 'handleShowAiSearchAndAnalysisCollectionPlaceEvent',
        {
          event,
          NAVIGATION,
        });
      this.wbcLocationService.navigateToPath(NAVIGATION.path, NAVIGATION.extras);
    } catch (error) {
      _errorX(AiSearchAndAnalysisCollectionsViewV1.getClassName(), 'handleShowAiSearchAndAnalysisCollectionPlaceEvent',
        {
          event,
          NAVIGATION,
        });

      throw error;
    }
  }

  handleShowImportModalEvent(event: any) {
    _debugX(AiSearchAndAnalysisCollectionsViewV1.getClassName(), 'showAiSearchAndAnalysisCollectionImportModal',
      {
        event,
      });

    this.aiSearchAndAnalysisCollectionImportModal.show();
  }

  handleShowRemovePlaceEvent(ids: any) {
    _debugX(AiSearchAndAnalysisCollectionsViewV1.getClassName(), `handleShowRemovePlaceEvent`,
      {
        ids,
      });

    this.aiSearchAndAnalysisCollectionDeleteModal.show(ids);
  }

  handleSearchChangeEvent(event: any) {
    _debugX(AiSearchAndAnalysisCollectionsViewV1.getClassName(), `handleSearchChangeEvent`,
      {
        event,
      });

    this.queryService.setFilterItem(DEFAULT_TABLE.AI_SEARCH_AND_ANALYSIS_COLLECTIONS_V1.TYPE, QueryServiceV1.FILTER_KEY.SEARCH, event);
    const QUERY = this.queryService.query(DEFAULT_TABLE.AI_SEARCH_AND_ANALYSIS_COLLECTIONS_V1.TYPE);

    _debugX(AiSearchAndAnalysisCollectionsViewV1.getClassName(), `handleSearchChangeEvent`,
      {
        QUERY,
      });

    this.eventsService.filterEmit(QUERY);
  }

  handleSearchClearEvent(event: any) {
    _debugX(AiSearchAndAnalysisCollectionsViewV1.getClassName(), `handleSearchClearEvent`,
      {
        event,
      });

    this.queryService.setFilterItem(DEFAULT_TABLE.AI_SEARCH_AND_ANALYSIS_COLLECTIONS_V1.TYPE, QueryServiceV1.FILTER_KEY.SEARCH, event);
    const QUERY = this.queryService.query(DEFAULT_TABLE.AI_SEARCH_AND_ANALYSIS_COLLECTIONS_V1.TYPE);

    _debugX(AiSearchAndAnalysisCollectionsViewV1.getClassName(), `handleSearchClearEvent`,
      {
        QUERY,
      });
    this.eventsService.filterEmit(QUERY);
  }

  handleShowQueryPlaceEvent(ids: any) {
    _debugX(AiSearchAndAnalysisCollectionsViewV1.getClassName(), `handleShowQueryPlaceEvent`,
      {
        ids,
      });

    this.aiSearchAndAnalysisCollectionQueryModal.show(ids);
  }

}
