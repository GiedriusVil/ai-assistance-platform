/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy } from '@angular/core';

import * as lodash from 'lodash';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugW,
} from 'client-shared-utils';

import {
  QueryServiceV1,
  EventsServiceV1,
} from 'client-shared-services';

import {
  BaseViewWbcV1,
} from 'client-shared-views';

import {
  DEFAULT_TABLE,
  ENUMERATIONS_CHART_TYPE
} from 'client-utils';

@Component({
  selector: 'aiap-wbc-doc-validation-metrics-view-v2',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class DocValidationMetricsViewV2 extends BaseViewWbcV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'DocValidationMetricsViewV2';
  }

  get ENUMERATIONS_CHART_TYPE() {
    return ENUMERATIONS_CHART_TYPE;
  }

  _state: any = {
    dateRange: {},
    query: {
      type: DEFAULT_TABLE.DOC_VALIDATIONS_METRICS_V2.TYPE,
    }
  };
  state = lodash.cloneDeep(this._state);

  constructor(
    // params-super
    protected notificationService: NotificationService,
    // params-native
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
  ) {
    super(notificationService);
  }

  ngOnInit(): void {
    const QUERY = this.queryService.query(this.state?.query?.type);
    this.state.dateRange = QUERY?.filter?.dateRange;
    _debugW(DocValidationMetricsViewV2.getClassName(), `ngOnInit`, {
      query: QUERY,
      this_state: this.state
    });

    this.queryService.refreshState(this.state?.query?.type);
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngAfterViewInit(): void {
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleRefreshClick() {
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleDateRangeChange(range: any) {
    _debugW(DocValidationMetricsViewV2.getClassName(), `handleDateRangeChange`,
      {
        range
      });

    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.DATE_RANGE, range);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

}
