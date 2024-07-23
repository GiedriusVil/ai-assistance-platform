/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import {
  _debugX,
  StripTextPipe,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  TimezoneServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  BaseView
} from 'client-shared-views';

import {
  DEFAULT_TABLE,
  OUTLETS,
} from 'client-utils';

import {
  AiServiceChangeRequestModalV1,
  AiServicesChangeRequestDeleteModalV1
} from '../components';

@Component({
  selector: 'aiap-ai-services-changes-request-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss'],
  providers: [StripTextPipe]
})
export class AiServicesChangesRequestViewV1 extends BaseView implements OnInit, OnDestroy {

  static getClassName() {
    return 'AiServicesChangesRequestViewV1';
  }

  @ViewChild('aiServiceChangeRequestModalV1') aiServiceChangeRequestModalV1: AiServiceChangeRequestModalV1;
  @ViewChild('aiServiceChangeRequestDeleteModalV1') aiServiceChangeRequestDeleteModalV1: AiServicesChangeRequestDeleteModalV1;

  outlet = OUTLETS.tenantCustomizer;

  state: any = {
    dateRange: {},
    search: '',
    queryType: DEFAULT_TABLE.AI_SERVICES_CHANGES_V1.TYPE,
    defaultSort: DEFAULT_TABLE.AI_SERVICES_CHANGES_V1.SORT
  }

  constructor(
    public timezoneService: TimezoneServiceV1,
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    const QUERY = this.queryService.query(this.state.queryType);
    this.queryService.setPagination(this.state.queryType, QUERY.pagination);
    this.state.dateRange = QUERY?.filter?.dateRange;
    this.state.search = QUERY?.filter?.search;
    _debugX(AiServicesChangesRequestViewV1.getClassName(), `ngOnInit`, {
      query: QUERY,
      this_state: this.state
    });
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleDateRangeChange(range: any) {
    _debugX(AiServicesChangesRequestViewV1.getClassName(), `handleDateRangeChange`,
      {
        range,
      });

    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.DATE_RANGE, range,);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleShowChangeRequestModal(event: any) {
    _debugX(AiServicesChangesRequestViewV1.getClassName(), `handleShowChangeRequestModal`,
      {
        event,
      });

    this.aiServiceChangeRequestModalV1.show(event?.value);
  }

  handleSearchChangeEvent(event: any) {
    _debugX(AiServicesChangesRequestViewV1.getClassName(), `handleSearchChangeEvent`,
      {
        event,
      });

    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleShowDeleteModal(event: any) {
    _debugX(AiServicesChangesRequestViewV1.getClassName(), `handleShowDeleteModal`, { event });
    this.aiServiceChangeRequestDeleteModalV1.show(event);
  }

  handleSearchClearEvent(event: any) {
    _debugX(AiServicesChangesRequestViewV1.getClassName(), `handleSearchClearEvent`,
      {
        event,
      });

    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }
}
