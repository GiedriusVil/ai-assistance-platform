/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, AfterViewInit, EventEmitter, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import * as lodash from 'lodash';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  ActivatedRouteServiceV1,
  SessionServiceV1,
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
  OUTLETS,
} from 'client-utils';

import {
  AiServicesServiceV1,
} from 'client-services';

import { BaseViewV1 } from 'client-shared-views';

@Component({
  selector: 'aiap-ai-service-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss'],
})
export class AiServiceViewV1 extends BaseViewV1 implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  static getClassName() {
    return 'AiServiceViewV1';
  }

  outlet = OUTLETS.tenantCustomizer;

  aiServiceId: string = undefined;
  assistantId: string = undefined;
  aiServiceName: string = undefined;
  pullConfiguration = true;

  state: any = {
    isLoading: false,
    queryType: DEFAULT_TABLE.AI_SKILLS_V1.TYPE,
    defaultSort: DEFAULT_TABLE.AI_SKILLS_V1.SORT
  }

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

  aiService: any = undefined;

  dateRangeChangeEmitter = new EventEmitter<any>();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private sessionService: SessionServiceV1,
    private activatedRouteServiceV1: ActivatedRouteServiceV1,
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
    private aiServicesService: AiServicesServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.subscribeToQueryParams();

    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    const QUERY = this.queryService.query(this.state.queryType);
    this.queryService.setPagination(this.state.queryType, QUERY.pagination);
    
    this.initFilters();

    _debugX(AiServiceViewV1.getClassName(), `ngOnInit`, {
      query: QUERY,
      this_state: this.state
    });
  }

  ngAfterViewInit() {
    //
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  ngOnDestroy(): void {
    this.superNgOnDestroy();
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  handleDateRangeChange(range: any) {
    this.filterData.dateRange = range;
    _debugX(AiServiceViewV1.getClassName(), `handleDateRangeChange`, { range });
  }

  private hasPullConfiguration() {
    let retVal = false;
    if (
      this.aiService?.pullConfiguration?.tenantId &&
      this.aiService?.pullConfiguration?.assistantId &&
      this.aiService?.pullConfiguration?.aiServiceId
    ) {
      retVal = true;
    }
    return retVal;
  }

  subscribeToQueryParams() {
    this.activatedRouteServiceV1.queryParams()
      .subscribe((params: any) => {
        _debugX(AiServiceViewV1.getClassName(), 'subscribeToQueryParams', { params });
        this.aiServiceId = params.aiServiceId;
        this.aiServiceName = params.aiServiceName;
        this.assistantId = params.assistantId;
        this.pullConfiguration = JSON.parse(params.pullConfiguration);
        this.loadAiService();
      });
  }

  loadAiService() {
    const QUERY = {
      filter: {
        id: this.aiServiceId,
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
    _debugX(AiServiceViewV1.getClassName(), `loadAiService`, { QUERY });
    this.state.isLoading = true;
    this.aiServicesService.findManyByQuery(QUERY)
      .pipe(
        catchError((error: any) => this.handleFindAiServicesByQueryError(error))
      ).subscribe((response: any) => {
        _debugX(AiServiceViewV1.getClassName(), `loadAiService`, { response });
        this.aiService = response?.items?.[0];
        this.state.isLoading = false;
      })
  }

  handleFindAiServicesByQueryError(error: any) {
    _errorX(AiServiceViewV1.getClassName(), `handleFindAiServicesByQueryError`, { error });
    this.state.isLoading = false;

    return of();
  }

  handleFilterPanelOpenEvent() {
    _debugX(AiServiceViewV1.getClassName(), `handleFilterPanelOpenEvent`, this.filterConfig.isVisible);
    this.filterConfig.isVisible = !this.filterConfig.isVisible;
  }

  handleFilterChange() {
    const FILTER = {};
    FILTER[QueryServiceV1.FILTER_KEY.DATE_RANGE] = this.filterData.dateRange;
    this.queryService.setFilterItems(this.state.queryType, FILTER);
    this.setFilterIcon();

    _debugX(AiServiceViewV1.getClassName(), `handleFilterChange`, { this_filterData: this.filterData, FILTER });
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleFilterReset() {
    this.filterData = lodash.cloneDeep(this.filterDataCopy);
    _debugX(AiServiceViewV1.getClassName(), `handleFilterReset`, { this_filterData: this.filterData });
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
    const VIEW_CONFIG = SESSION?.application?.configuration?.views?.find((view) => view?.component === AiServiceViewV1.getClassName());
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
