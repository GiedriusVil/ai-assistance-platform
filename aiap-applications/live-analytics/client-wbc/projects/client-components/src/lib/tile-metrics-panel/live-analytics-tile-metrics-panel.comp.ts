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
  selector: 'aca-live-analytics-tile-metrics-panel',
  templateUrl: './live-analytics-tile-metrics-panel.comp.html',
  styleUrls: ['./live-analytics-tile-metrics-panel.comp.scss'],
})
export class LiveAnalyticsWbcTileMetricsPanel implements OnInit, OnDestroy {

  static getClassName() {
    return 'LiveAnalyticsTileMetricsPanel';
  }

  @Input() configuration: any;

  _state = {
    queryType: undefined,
  };
  state = lodash.cloneDeep(this._state);

  constructor(
    private queryService: QueryServiceV1,
  ) { }

  ngOnInit(): void { }

  ngOnDestroy(): void { }

}
