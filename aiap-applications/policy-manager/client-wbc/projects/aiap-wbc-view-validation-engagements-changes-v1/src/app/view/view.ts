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
  ValidationEngagementsChangesModalV1,
} from '.';

@Component({
  selector: 'aiap-wbc-validation-engagegments-changes-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss'],
  providers: [
    StripTextPipe,
  ]
})
export class ValidationEngagementsChangesViewV1 extends BaseViewWbcV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'ValidationEngagementsChangesViewV1';
  }

  @ViewChild('validationEngagementsChangesModalV1') validationEngagementsChangesModalV1: ValidationEngagementsChangesModalV1;

  _state: any = {
    dateRange: {},
    search: '',
    query: {
      type: DEFAULT_TABLE.VALIDATION_ENGAGEMENTS_CHANGES_V1.TYPE,
      sort: DEFAULT_TABLE.VALIDATION_ENGAGEMENTS_CHANGES_V1.SORT,
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
    this.state.search = QUERY?.filter?.search;

    _debugW(ValidationEngagementsChangesViewV1.getClassName(), `ngOnInit`, {
      query: QUERY,
      this_state: this.state
    });
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleDateRangeChange(range: any) {
    _debugW(ValidationEngagementsChangesViewV1.getClassName(), this.handleDateRangeChange.name, { range });
    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.DATE_RANGE, range);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleShowTransactionEvent(event: any) {
    _debugW(ValidationEngagementsChangesViewV1.getClassName(), this.handleShowTransactionEvent.name, { event });
    this.validationEngagementsChangesModalV1.show(event?.value);
  }

  handleSearchEvent(event: any) {
    _debugW(ValidationEngagementsChangesViewV1.getClassName(), this.handleSearchEvent.name, { event });
    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  hanleClearSearchEvent(event: any) {
    _debugW(ValidationEngagementsChangesViewV1.getClassName(), this.hanleClearSearchEvent.name, { event });
    this.queryService.deleteFilterItems(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }
}
