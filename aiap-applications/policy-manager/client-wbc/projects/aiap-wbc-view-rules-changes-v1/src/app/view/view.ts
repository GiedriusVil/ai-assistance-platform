/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Subject, of } from 'rxjs';

import * as lodash from 'lodash';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
  StripTextPipe,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
  TimezoneServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  BaseViewWbcV1,
} from 'client-shared-views';

import { RuleChangeModalV1 } from './rule-change-modal-v1/rule-change-modal-v1';

@Component({
  selector: 'aiap-wbc-rules-changes-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss'],
  providers: [
    StripTextPipe
  ]
})
export class RulesChangesViewV1 extends BaseViewWbcV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'RulesChangesViewV1';
  }

  @ViewChild('ruleChangeModalV1') ruleChangeModalV1: RuleChangeModalV1;

  _state: any = {
    dateRange: {},
    search: '',
    query: {
      type: DEFAULT_TABLE.RULES_CHANGES_V1.TYPE,
      sort: DEFAULT_TABLE.RULES_CHANGES_V1.SORT,
    }
  };
  state = lodash.cloneDeep(this._state);

  constructor(
    // params-super
    protected notificationService: NotificationService,
    // params-native
    public timezoneService: TimezoneServiceV1,
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
  ) {
    super(notificationService);
  }

  ngOnInit(): void {
    this.queryService.setSort(this.state?.query?.type, this.state?.query?.sort);
    const QUERY = this.queryService.query(this.state?.query?.type);
    this.state.dateRange = QUERY?.filter?.dateRange;
    this.state.search = QUERY?.filter?.search || '';
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleDateRangeChange(range: any) {
    _debugX(RulesChangesViewV1.getClassName(), `handleDateRangeChange`, { range });
    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.DATE_RANGE, range);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleShowTransactionEvent(event: any) {
    _debugX(RulesChangesViewV1.getClassName(), `handleTransactionRowClick`, { event });
    this.ruleChangeModalV1.show(event?.value);
  }

  handleSearchEvent(event: any) {
    _debugX(RulesChangesViewV1.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  hanleClearSearchEvent(event: any) {
    _debugX(RulesChangesViewV1.getClassName(), `hanleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state?.query?.type.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

}
