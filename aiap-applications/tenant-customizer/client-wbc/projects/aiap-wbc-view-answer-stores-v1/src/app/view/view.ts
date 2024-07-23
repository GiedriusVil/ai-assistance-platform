/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
  sanitizeIBMOverflowMenuPaneElement,
} from 'client-shared-utils';

import {
  WbcLocationServiceV1,
  EventsServiceV1,
  QueryServiceV1,
  SessionServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
  OUTLETS,
} from 'client-utils';

import { BaseViewV1 } from 'client-shared-views';

import {
  AnswerStoresImportModalV1,
  AnswerStoresSaveModalV1,
  AnswerStoresDeleteModalV1,
  AnswerStoresPullModalV1,
} from '../components';

@Component({
  selector: 'aiap-answer-stores-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss'],
})
export class AnswerStoresViewV1 extends BaseViewV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AnswerStoresViewV1';
  }

  @ViewChild('answerStoreSaveModal') answerStoreSaveModal: AnswerStoresSaveModalV1;
  @ViewChild('answersStoresPullModal') answerStoresPullModal: AnswerStoresPullModalV1;
  @ViewChild('answerStoreDeleteModal') answerStoreDeleteModal: AnswerStoresDeleteModalV1;
  @ViewChild('answersStoresImportModal') answersStoresImportModal: AnswerStoresImportModalV1;

  outlet = OUTLETS.tenantCustomizer;

  state: any = {
    queryType: DEFAULT_TABLE.ANSWER_STORES.TYPE,
    defaultSort: DEFAULT_TABLE.ANSWER_STORES.SORT,
  };

  tableConfig = {
    filterIcon: 'assets/carbon-icons/16/operations/filter.svg',
    filterConfigEnabled: false,
  };

  filterConfig = {
    isVisible: false,
    isLoading: true,
  };
  filterData = {
    dateRange: {
      from: null,
      to: null,
      mode: null,
    }
  };
  disabledFilterData = {
    dateRange: {
      from: null,
      to: null,
      mode: null,
    },
  }
  filterDataCopy = lodash.cloneDeep(this.filterData);

  constructor(
    private wbcLocationService: WbcLocationServiceV1,
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
    private sessionService: SessionServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.initFilters();
  }

  ngAfterViewInit() {
    //
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
    sanitizeIBMOverflowMenuPaneElement(AnswerStoresViewV1.getClassName(), document);
  }

  handleDateRangeChange(range: any) {
    this.filterData.dateRange = range;
    _debugX(AnswerStoresViewV1.getClassName(), `handleDateRangeChange`, { range });
  }

  handleAnswerStoreSaveModal(store: any = undefined) {
    _debugX(AnswerStoresViewV1.getClassName(), 'handleAnswerStoreSaveModal', { store });
    this.answerStoreSaveModal.show(store);
  }

  handleShowAnswerStorePlaceEvent(event: any): void {
    const NAVIGATION: any = {};
    let answerStoreId;
    let answerStoreName;
    let answerStoreDefaultLanguage;

    try {
      answerStoreId = event?.id;
      answerStoreName = event?.name;
      answerStoreDefaultLanguage = event?.configurations?.language;
      NAVIGATION.path = '(tenantCustomizer:main-view/answer-stores/answers)';
      NAVIGATION.extras = {
        queryParams: {
          answerStoreId, answerStoreName, answerStoreDefaultLanguage
        }
      };
      _debugX(AnswerStoresViewV1.getClassName(), 'handleAnswerStoreRowClick', { event, NAVIGATION });
      if (
        !lodash.isEmpty(answerStoreId)
      ) {
        this.wbcLocationService.navigateToPathByEnvironmentServiceV1(NAVIGATION.path, NAVIGATION.extras);
      }
    } catch (error) {
      _errorX(AnswerStoresViewV1.getClassName(), 'handleShowAnswerStorePlaceEvent', { error, NAVIGATION });
    }
  }

  handleAnswerStoreDeleteModal(store: any = undefined) {
    _debugX(AnswerStoresViewV1.getClassName(), `handleShowDeleteModal`, { store });
    this.answerStoreDeleteModal.show(store);
  }

  handleSearchClearEvent(event: any) {
    _debugX(AnswerStoresViewV1.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleShowPullPlaceEvent(event: any) {
    _debugX(AnswerStoresViewV1.getClassName(), 'handleShowPullPlaceEvent', { event });
    this.answerStoresPullModal.show(event);
  }

  handleSearchChangeEvent(event: any) {
    _debugX(AnswerStoresViewV1.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleShowImportQueue(event: any) {
    _debugX(AnswerStoresViewV1.getClassName(), `handleShowImportQueue`, { event });
    this.answersStoresImportModal.show();
  }

  handleFilterPanelOpenEvent() {
    _debugX(AnswerStoresViewV1.getClassName(), `handleFilterPanelOpenEvent`, this.filterConfig.isVisible);
    this.filterConfig.isVisible = !this.filterConfig.isVisible;
  }

  handleFilterChange() {
    const FILTER = {};
    FILTER[QueryServiceV1.FILTER_KEY.DATE_RANGE] = this.filterData.dateRange;
    this.queryService.setFilterItems(this.state.queryType, FILTER);
    this.setFilterIcon();

    _debugX(AnswerStoresViewV1.getClassName(), `handleFilterChange`, { this_filterData: this.filterData, FILTER });
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleFilterReset() {
    this.filterData = lodash.cloneDeep(this.filterDataCopy);
    _debugX(AnswerStoresViewV1.getClassName(), `handleFilterReset`, { this_filterData: this.filterData });
  }

  initFilters() {
    const FILTERS_ENABLED = this.isFiltersEnabled();
    if (FILTERS_ENABLED) {
      this.tableConfig.filterConfigEnabled = FILTERS_ENABLED;
      const QUERY = this.queryService.query(this.state.queryType);
      this.initFilterValues(QUERY);
      this.filterConfig.isLoading = false;
    } else {
      this.queryService.setFilterItems(this.state.queryType, this.disabledFilterData);
    }
  }

  initFilterValues(query: any) {
    this.filterData.dateRange = query?.filter?.dateRange;
    //
    this.filterDataCopy = lodash.cloneDeep(this.filterData);
  }

  setFilterIcon() {
    const IS_EQUAL = lodash.isEqual(this.filterData, this.filterDataCopy);
    this.tableConfig.filterIcon = IS_EQUAL ? 'assets/carbon-icons/16/operations/filter.svg' : 'assets/carbon-icons/16/operations/filter--edit.svg';
    const TABLE_CONFIG = lodash.cloneDeep(this.tableConfig);
    this.tableConfig = TABLE_CONFIG;
  }

  isFiltersEnabled() {
    let retVal = false;

    const SESSION = this.sessionService.getSession();
    const VIEW_CONFIG = SESSION?.application?.configuration?.views?.find((view) => view?.component === AnswerStoresViewV1.getClassName());
    const VIEW_CONFIGURATION_FILTERS = VIEW_CONFIG?.configuration?.filters;

    if (lodash.isBoolean(VIEW_CONFIGURATION_FILTERS)) {
      retVal = VIEW_CONFIGURATION_FILTERS;
    }
    if (lodash.isObject(VIEW_CONFIGURATION_FILTERS) && !lodash.isEmpty(VIEW_CONFIGURATION_FILTERS)) {
      retVal = true;
    }

    return retVal;
  }
}
