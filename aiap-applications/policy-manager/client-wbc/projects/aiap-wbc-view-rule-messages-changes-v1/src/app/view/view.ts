/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

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
  QueryServiceV1,
  TimezoneServiceV1,
} from 'client-shared-services';

import {
  BaseViewWbcV1,
} from 'client-shared-views';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import { RuleMessageChangesModalV1 } from './rule-message-changes-modal-v1/rule-message-changes-modal-v1';

@Component({
  selector: 'aiap-wbc-rule-messages-changes-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss'],
  providers: [
    StripTextPipe
  ]
})
export class RuleMessagesChangesViewV1 extends BaseViewWbcV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'RuleMessagesChangesViewV1';
  }

  @ViewChild('changesModal') changesModal: RuleMessageChangesModalV1;

  _state: any = {
    dateRange: {},
    search: '',
    query: {
      type: DEFAULT_TABLE.RULE_MESSAGES_CHANGES_V1.TYPE,
      sort: DEFAULT_TABLE.RULE_MESSAGES_CHANGES_V1.SORT,
    }
  };
  state = lodash.cloneDeep(this._state);

  constructor(
    // params-super
    protected notificationService: NotificationService,
    // params-native
    public eventsService: EventsServiceV1,
    public timezoneService: TimezoneServiceV1,
    public queryService: QueryServiceV1,
  ) {
    super(notificationService);
  }

  ngOnInit(): void {
    this.queryService.setSort(this.state?.query?.type, this.state?.query?.sort);
    const QUERY = this.queryService.query(this.state?.query?.type);
    this.state.dateRange = QUERY?.filter?.dateRange;
    this.state.search = QUERY?.filter?.search || '';
    _debugW(RuleMessagesChangesViewV1.getClassName(), `ngOnInit`, {
      query: QUERY,
      this_state: this.state
    });
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleDateRangeChange(range: any) {
    _debugW(RuleMessagesChangesViewV1.getClassName(), `handleDateRangeChange`,
      {
        range
      });

    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.DATE_RANGE, range);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleShowTransactionEvent(event: any) {
    _debugW(RuleMessagesChangesViewV1.getClassName(), `handleTransactionRowClick`,
      {
        event
      });

    this.changesModal.show(event?.value);
  }

  handleSearchChangeEvent(event: any) {
    _debugW(RuleMessagesChangesViewV1.getClassName(), `handleSearchChangeEvent`,
      {
        event
      });

    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleSearchClearEvent(event: any) {
    _debugW(RuleMessagesChangesViewV1.getClassName(), `handleSearchClearEvent`,
      {
        event
      });

    this.queryService.deleteFilterItems(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

}
