/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
} from 'client-utils';

import {
  QueryServiceV1,
  EventsServiceV1,
} from 'client-shared-services';


@Component({
  selector: 'aiap-live-analytics-filters-panel-v2',
  templateUrl: './live-analytics-filters-panel-v2.html',
  styleUrls: ['./live-analytics-filters-panel-v2.scss'],
})
export class LiveAnalyticsFiltersPanelV2 implements OnInit, OnDestroy {

  static getClassName() {
    return 'LiveAnalyticsFiltersPanelV2';
  }

  @Input() configuration: any;

  _state: any = {
    query: undefined,
    queryType: undefined,
    dateRange: {},
  }

  state = lodash.cloneDeep(this._state);


  constructor(
    private queryService: QueryServiceV1,
    private eventsService: EventsServiceV1,
  ) { }

  ngOnInit(): void {
    const DASHBOARD_REF = this.configuration?.ref;
    this.state.queryType = DASHBOARD_REF;
    const QUERY = this.queryService.query(this.state.queryType);
    this.state.query = QUERY;
    this.state.dateRange = QUERY?.filter?.dateRange;
  }

  handleDateRangeChange(range: any) {
    _debugX(LiveAnalyticsFiltersPanelV2.getClassName(), `handleDateRangeChange`, { range });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.DATE_RANGE, range);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  ngOnDestroy(): void { }

}
