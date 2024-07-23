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
  AiSearchAndAnalysisProjectDeleteModalV1,
  AiSearchAndAnalysisProjectImportModalV1,
  AiSearchAndAnalysisProjectSaveModalV1,
} from '../components';

@Component({
  selector: 'aiap-ai-search-and-analysis-projects-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class AiSearchAndAnalysisProjectsViewV1 extends BaseViewV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiSearchAndAnalysisProjectsViewV1';
  }

  @ViewChild('aiSearchAndAnalysisProjectDeleteModal') aiSearchAndAnalysisProjectDeleteModal: AiSearchAndAnalysisProjectDeleteModalV1;
  @ViewChild('aiSearchAndAnalysisProjectSaveModal') aiSearchAndAnalysisProjectSaveModal: AiSearchAndAnalysisProjectSaveModalV1;
  @ViewChild('aiSearchAndAnalysisProjectImportModal') aiSearchAndAnalysisProjectImportModal: AiSearchAndAnalysisProjectImportModalV1;

  outlet = OUTLETS.tenantCustomizer;

  aiSearchAndAnalysisServiceId: string;

  constructor(
    private activatedRouteServiceV1: ActivatedRouteServiceV1,
    private wbcLocationService: WbcLocationServiceV1,
    private queryService: QueryServiceV1,
    private eventsService: EventsServiceV1,
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
        _debugX(AiSearchAndAnalysisProjectsViewV1.getClassName(), 'subscribeToQueryParams',
          {
            params
          });

        this.aiSearchAndAnalysisServiceId = params.aiSearchAndAnalysisServiceId;
      });
  }

  handleShowSavePlaceEvent(event: any) {
    _debugX(AiSearchAndAnalysisProjectsViewV1.getClassName(), 'showAiSearchAndAnalysisProjectSaveModal',
      {
        event,
      });

    const AI_SEARCH_AND_ANALYSIS_PROJECT = event;
    this.aiSearchAndAnalysisProjectSaveModal.show(AI_SEARCH_AND_ANALYSIS_PROJECT);
  }



  handleShowPlaceEvent(event: any) {
    const NAVIGATION: any = {};
    try {
      _debugX(AiSearchAndAnalysisProjectsViewV1.getClassName(), 'handleShowAiSearchAndAnalysisProjectsPlaceEvent',
        {
          event,
        });

      NAVIGATION.extras = {
        queryParams: {
          aiSearchAndAnalysisProjectId: event?.id,
          aiSearchAndAnalysisProjectType: event?.type,
          aiSearchAndAnalysisServiceId: this.aiSearchAndAnalysisServiceId,
        }
      };
      NAVIGATION.path = '(tenantCustomizer:main-view/ai-search-and-analysis-services/ai-search-and-analysis-projects/ai-search-and-analysis-collections)';
      _debugX(AiSearchAndAnalysisProjectsViewV1.getClassName(), 'handleShowAiSearchAndAnalysisProjectsPlaceEvent',
        {
          event,
          NAVIGATION,
        });

      this.wbcLocationService.navigateToPath(NAVIGATION.path, NAVIGATION.extras);
    } catch (error) {
      _errorX(AiSearchAndAnalysisProjectsViewV1.getClassName(), 'handleShowAiSearchAndAnalysisProjectsPlaceEvent',
        {
          event,
          NAVIGATION,
        });
      throw error;
    }
  }

  handleShowImportModalEvent(event: any) {
    _debugX(AiSearchAndAnalysisProjectsViewV1.getClassName(), 'showAiSearchAndAnalysisProjectImportModal',
      {
        event,
      });

    this.aiSearchAndAnalysisProjectImportModal.show();
  }

  handleShowRemovePlaceEvent(ids: any) {
    _debugX(AiSearchAndAnalysisProjectsViewV1.getClassName(), `handleShowRemovePlaceEvent`,
      {
        ids,
      });

    this.aiSearchAndAnalysisProjectDeleteModal.show(ids);
  }

  handleSearchChangeEvent(event: any) {
    _debugX(AiSearchAndAnalysisProjectsViewV1.getClassName(), `handleSearchChangeEvent`,
      {
        event,
      });

    this.queryService.setFilterItem(DEFAULT_TABLE.AI_SEARCH_AND_ANALYSIS_PROJECTS_V1.TYPE, QueryServiceV1.FILTER_KEY.SEARCH, event);
    const QUERY = this.queryService.query(DEFAULT_TABLE.AI_SEARCH_AND_ANALYSIS_PROJECTS_V1.TYPE);
    _debugX(AiSearchAndAnalysisProjectsViewV1.getClassName(), `handleSearchChangeEvent`,
      {
        QUERY,
      });

    this.eventsService.filterEmit(QUERY);
  }

  handleSearchClearEvent(event: any) {
    _debugX(AiSearchAndAnalysisProjectsViewV1.getClassName(), `handleSearchClearEvent`,
      {
        event,
      });

    this.queryService.setFilterItem(DEFAULT_TABLE.AI_SEARCH_AND_ANALYSIS_PROJECTS_V1.TYPE, QueryServiceV1.FILTER_KEY.SEARCH, event);
    const QUERY = this.queryService.query(DEFAULT_TABLE.AI_SEARCH_AND_ANALYSIS_PROJECTS_V1.TYPE);
    _debugX(AiSearchAndAnalysisProjectsViewV1.getClassName(), `handleSearchClearEvent`,
      {
        QUERY,
      });

    this.eventsService.filterEmit(QUERY);
  }


}
