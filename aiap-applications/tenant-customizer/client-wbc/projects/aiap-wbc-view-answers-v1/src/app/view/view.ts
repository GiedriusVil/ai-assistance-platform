/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  DEFAULT_TABLE,
  OUTLETS,
} from 'client-utils';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  ActivatedRouteServiceV1,
  EventsServiceV1,
  QueryServiceV1,
  WbcLocationServiceV1,
  SessionServiceV1,
} from 'client-shared-services';

import {
  TableModel,
} from 'carbon-components-angular';

import {
  AnswerStoresServiceV1,
} from 'client-services';

import { BaseViewV1 } from 'client-shared-views';

import {
  AnswerDeleteModalV1,
  AnswerStoresImportModalV1,
  AnswersPullModalV1,
  AnswersRollbackModalV1
} from '../components';

@Component({
  selector: 'aiap-answers-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss'],
})
export class AnswersViewV1 extends BaseViewV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AnswersViewV1';
  }

  @ViewChild('answerDeleteModal') answerDeleteModal: AnswerDeleteModalV1;
  @ViewChild('answerStoreImportModal') answerStoreImportModal: AnswerStoresImportModalV1;
  @ViewChild('answersPullModal') answersPullModal: AnswersPullModalV1;
  @ViewChild('answersRollbackModal') answersRollbackModal: AnswersRollbackModalV1;

  outlet = OUTLETS.tenantCustomizer;

  model: TableModel;

  answerStoreId = undefined;
  answerStoreName = undefined;
  answerStoreDefaultLanguage = undefined;

  response: any = {
    items: [],
    total: 0,
    parent: {}
  };

  state: any = {
    isLoading: false,
    queryType: DEFAULT_TABLE.ANSWERS.TYPE,
    defaultSort: DEFAULT_TABLE.ANSWERS.SORT,
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

  answerStore: any = undefined;

  constructor(
    private activatedRouteServiceV1: ActivatedRouteServiceV1,
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
    private answerStoresService: AnswerStoresServiceV1,
    private wbcLocationService: WbcLocationServiceV1,
    private sessionService: SessionServiceV1,
  ) {
    super();
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngOnInit() {
    this.subscribeToQueryParams();
    this.initFilters();
  }

  ngAfterViewInit() {
    //
  }

  handleDateRangeChange(range: any) {
    this.filterData.dateRange = range;
    _debugX(AnswersViewV1.getClassName(), `handleDateRangeChange`, { range });
  }

  subscribeToQueryParams() {
    this.activatedRouteServiceV1.queryParams()
      .subscribe((params: any) => {
        _debugX(AnswersViewV1.getClassName(), 'subscribeToQueryParams', { params });
        this.answerStoreId = params.answerStoreId;
        this.answerStoreName = params.answerStoreName;
        this.answerStoreDefaultLanguage = params.answerStoreDefaultLanguage;
        this.loadAnswerStoreLite();
      });
  }

  loadAnswerStoreLite() {
    const QUERY = {
      filter: {
        id: this.answerStoreId,
      },
      sort: {
        field: 'id',
        direction: 'desc'
      },
      pagination: {
        page: 1,
        size: 1,
      }
    };
    _debugX(AnswersViewV1.getClassName(), `loadAiService`, { QUERY });
    this.state.isLoading = true;
    this.answerStoresService.findOneLiteById(this.answerStoreId).pipe(
      catchError((error: any) => this.handleFindOneLiteByIdError(error))
    ).subscribe((response: any) => {
      this.answerStore = response;
      this.state.isLoading = false;
    })
  }

  handleFindOneLiteByIdError(error: any) {
    _errorX(AnswersViewV1.getClassName(), `handleFindOneLiteByIdError`, { error });
    this.state.isLoading = false;

    return of();
  }

  showPullModal() {
    const ANSWER_STORE = {
      id: this.answerStoreId
    }
    _debugX(AnswersViewV1.getClassName(), 'showPullModal', { ANSWER_STORE });
    this.answersPullModal.show(ANSWER_STORE);
  }

  showRollbackModal() {
    const ANSWER_STORE = {
      id: this.answerStoreId
    }
    _debugX(AnswersViewV1.getClassName(), 'showRollbackModal', { ANSWER_STORE });
    this.answersRollbackModal.show(ANSWER_STORE);
  }

  import() {
    this.answerStoreImportModal.show(this.answerStoreId);
  }

  handleAnswerDeleteModal(answer: any = undefined) {
    _debugX(AnswersViewV1.getClassName(), `handleShowDeleteModal`, { answer });
    this.answerDeleteModal.show(this.answerStoreId, answer);
  }

  handleSearchClearEvent(event: any) {
    _debugX(AnswersViewV1.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchChangeEvent(event: any) {
    _debugX(AnswersViewV1.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleShowImportQueue(event: any) {
    _debugX(AnswersViewV1.getClassName(), `handleShowImportQueue`, { event });
    this.answerStoreImportModal.show(this.answerStoreId);
  }

  handleShowAnswerPlaceEvent(event: any): void {
    const NAVIGATION: any = {};
    try {
      NAVIGATION.path = '(tenantCustomizer:main-view/answer-stores/answers/answer)';
      NAVIGATION.extras = {
        queryParams: {
          answerStoreId: this.answerStoreId,
          answerStoreName: this.answerStoreName,
          answerStoreDefaultLanguage: this.answerStoreDefaultLanguage,
          answerKey: event?.value?.key || '',
        }
      };
      _debugX(AnswersViewV1.getClassName(), 'handleShowAnswerPlaceEvent', { event, NAVIGATION });
      if (!lodash.isEmpty(this.answerStoreId)) {
        this.wbcLocationService.navigateToPathByEnvironmentServiceV1(NAVIGATION.path, NAVIGATION.extras);
      }
    } catch (error) {
      _errorX(AnswersViewV1.getClassName(), 'handleShowAnswerPlaceEvent', { error, NAVIGATION });
    }
  }

  handleFilterPanelOpenEvent() {
    _debugX(AnswersViewV1.getClassName(), `handleFilterPanelOpenEvent`, this.filterConfig.isVisible);
    this.filterConfig.isVisible = !this.filterConfig.isVisible;
  }

  handleFilterChange() {
    const FILTER = {};
    FILTER[QueryServiceV1.FILTER_KEY.DATE_RANGE] = this.filterData.dateRange;
    this.queryService.setFilterItems(this.state.queryType, FILTER);
    this.setFilterIcon();

    _debugX(AnswersViewV1.getClassName(), `handleFilterChange`, { this_filterData: this.filterData, FILTER });
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleFilterReset() {
    this.filterData = lodash.cloneDeep(this.filterDataCopy);
    _debugX(AnswersViewV1.getClassName(), `handleFilterReset`, { this_filterData: this.filterData });
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
    const VIEW_CONFIG = SESSION?.application?.configuration?.views?.find((view) => view?.component === AnswersViewV1.getClassName());
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
