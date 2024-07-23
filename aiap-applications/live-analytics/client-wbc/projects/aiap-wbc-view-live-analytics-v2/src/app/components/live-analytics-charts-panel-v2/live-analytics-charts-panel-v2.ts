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
} from 'client-services';

@Component({
  selector: 'aiap-live-analytics-charts-panel-v2',
  templateUrl: './live-analytics-charts-panel-v2.html',
  styleUrls: ['./live-analytics-charts-panel-v2.scss'],
})
export class LiveAnalyticsChartsPanelV2 implements OnInit, OnDestroy {

  static getClassName() {
    return 'LiveAnalyticsChartsPanelV2';
  }

  @Input() configuration: any;

  _state = {
    queryType: undefined,
  }
  state = lodash.cloneDeep(this._state);

  constructor(
    private queryService: QueryServiceV1,
  ) { }

  ngOnInit(): void { }

  ngOnDestroy(): void { }

}
