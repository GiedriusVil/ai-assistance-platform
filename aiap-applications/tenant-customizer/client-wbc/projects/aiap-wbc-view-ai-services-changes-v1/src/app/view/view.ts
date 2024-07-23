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
  AiServiceChangeViewV1
} from '../components';

@Component({
  selector: 'aiap-ai-services-changes-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss'],
  providers: [StripTextPipe]
})
export class AiServicesChangesViewV1 extends BaseView implements OnInit, OnDestroy {

  static getClassName() {
    return 'AiServicesChangesViewV1';
  }

  @ViewChild('AiServiceChangeViewV1') aiServiceChangeView: AiServiceChangeViewV1;

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
    _debugX(AiServicesChangesViewV1.getClassName(), `ngOnInit`, {
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
    _debugX(AiServicesChangesViewV1.getClassName(), `handleDateRangeChange`,
      {
        range,
      });

    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.DATE_RANGE, range,);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleShowTransactionEvent(event: any) {
    _debugX(AiServicesChangesViewV1.getClassName(), `handleTransactionRowClick`,
      {
        event,
      });

    this.aiServiceChangeView.show(event?.value);
  }

  handleSearchChangeEvent(event: any) {
    _debugX(AiServicesChangesViewV1.getClassName(), `handleSearchChangeEvent`,
      {
        event,
      });

    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchClearEvent(event: any) {
    _debugX(AiServicesChangesViewV1.getClassName(), `handleSearchClearEvent`,
      {
        event,
      });

    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }
}
