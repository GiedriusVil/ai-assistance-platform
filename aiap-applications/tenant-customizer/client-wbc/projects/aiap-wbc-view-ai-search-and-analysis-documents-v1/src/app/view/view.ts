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
  AiSearchAndAnalysisDocumentDeleteModalV1,
} from '../components';

@Component({
  selector: 'aiap-ai-search-and-analysis-documents-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class AiSearchAndAnalysisDocumentsViewV1 extends BaseViewV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiSearchAndAnalysisDocumentsViewV1';
  }

  @ViewChild('aiSearchAndAnalysisDocumentDeleteModal') aiSearchAndAnalysisDocumentDeleteModal: AiSearchAndAnalysisDocumentDeleteModalV1;

  outlet = OUTLETS.tenantCustomizer;

  aiSearchAndAnalysisServiceId: string;
  aiSearchAndAnalysisProjectId: string;
  aiSearchAndAnalysisCollectionId: string;

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
        _debugX(AiSearchAndAnalysisDocumentsViewV1.getClassName(), 'subscribeToQueryParams',
          {
            params,
          });

        this.aiSearchAndAnalysisServiceId = params.aiSearchAndAnalysisServiceId;
        this.aiSearchAndAnalysisProjectId = params.aiSearchAndAnalysisProjectId;
        this.aiSearchAndAnalysisCollectionId = params.aiSearchAndAnalysisCollectionId;
      });
  }

  handleShowPlaceEvent(event: any) {
    _debugX(AiSearchAndAnalysisDocumentsViewV1.getClassName(), 'handleShowAiSearchAndAnalysisDocumentPlaceEvent',
      {
        event,
      });

    const DOCUMENTS = [event];
    this.aiSearchAndAnalysisDocumentDeleteModal.show(DOCUMENTS);
  }

  handleShowRemovePlaceEvent(documents: any) {
    _debugX(AiSearchAndAnalysisDocumentsViewV1.getClassName(), `handleShowRemovePlaceEvent`,
      {
        documents,
      });

    this.aiSearchAndAnalysisDocumentDeleteModal.show(documents);
  }

  handleSearchChangeEvent(event: any) {
    _debugX(AiSearchAndAnalysisDocumentsViewV1.getClassName(), `handleSearchChangeEvent`,
      {
        event,
      });

    this.queryService.setFilterItem(DEFAULT_TABLE.AI_SEARCH_AND_ANALYSIS_DOCUMENTS_V1.TYPE, QueryServiceV1.FILTER_KEY.SEARCH, event);
    const QUERY = this.queryService.query(DEFAULT_TABLE.AI_SEARCH_AND_ANALYSIS_DOCUMENTS_V1.TYPE);
    _debugX(AiSearchAndAnalysisDocumentsViewV1.getClassName(), `handleSearchChangeEvent`,
      {
        QUERY,
      });

    this.eventsService.filterEmit(QUERY);
  }

  handleSearchClearEvent(event: any) {
    _debugX(AiSearchAndAnalysisDocumentsViewV1.getClassName(), `handleSearchClearEvent`,
      {
        event,
      });
    this.queryService.setFilterItem(DEFAULT_TABLE.AI_SEARCH_AND_ANALYSIS_DOCUMENTS_V1.TYPE, QueryServiceV1.FILTER_KEY.SEARCH, event);
    const QUERY = this.queryService.query(DEFAULT_TABLE.AI_SEARCH_AND_ANALYSIS_DOCUMENTS_V1.TYPE);
    _debugX(AiSearchAndAnalysisDocumentsViewV1.getClassName(), `handleSearchClearEvent`,
      {
        QUERY,
      });

    this.eventsService.filterEmit(QUERY);
  }

}
