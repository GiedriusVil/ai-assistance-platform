/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import * as lodash from 'lodash';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugW,
  _errorW,
  StripTextPipe,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  TimezoneServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  BaseViewWbcV1,
} from 'client-shared-views';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  RulesChangesModalV2,
} from '.';

@Component({
  selector: 'aiap-wbc-rules-changes-view-v2',
  templateUrl: './view.html',
  styleUrls: ['./view.scss'],
  providers: [
    StripTextPipe,
  ]
})
export class RulesChangesViewV2 extends BaseViewWbcV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'RulesChangesViewV2';
  }

  @ViewChild('rulesChangesModalV2') rulesChangesModalV2: RulesChangesModalV2;

  state: any = {
    dateRange: {},
    search: '',
  }

  queryState: any = {
    queryType: DEFAULT_TABLE.RULES_CHANGES_V2.TYPE,
    defaultSort: DEFAULT_TABLE.RULES_CHANGES_V2.SORT,
  };

  constructor(
    // params-super
    protected notificationService: NotificationService,
    // params-native
    public timezoneService: TimezoneServiceV1,
    public eventsService: EventsServiceV1,
    public queryService: QueryServiceV1,
  ) {
    super(notificationService);
  }

  ngOnInit(): void {
    this.queryService.setSort(this.queryState.queryType, this.queryState.defaultSort);
    const QUERY = this.queryService.query(this.queryState.queryType);
    this.state.dateRange = QUERY?.filter?.dateRange;
    this.state.search = QUERY?.filter?.search;
    _debugW(RulesChangesViewV2.getClassName(), `ngOnInit`, {
      query: QUERY,
      this_state: this.state
    });
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleDateRangeChange(range: any) {
    _debugW(RulesChangesViewV2.getClassName(), this.handleDateRangeChange.name, { range });
    this.queryService.setFilterItem(this.queryState.queryType, QueryServiceV1.FILTER_KEY.DATE_RANGE, range);
    this.eventsService.filterEmit(this.queryService.query(this.queryState.queryType));
  }

  handleShowTransactionEvent(event: any) {
    _debugW(RulesChangesViewV2.getClassName(), this.handleShowTransactionEvent.name, { event });
    this.rulesChangesModalV2.show(event?.value);
  }

  handleSearchEvent(event: any) {
    _debugW(RulesChangesViewV2.getClassName(), this.handleSearchEvent.name, { event });
    this.queryService.setFilterItem(this.queryState.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.queryState.queryType));
  }

  hanleClearSearchEvent(event: any) {
    _debugW(RulesChangesViewV2.getClassName(), this.hanleClearSearchEvent.name, { event });
    this.queryService.deleteFilterItems(this.queryState.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.queryState.queryType));
  }

}
