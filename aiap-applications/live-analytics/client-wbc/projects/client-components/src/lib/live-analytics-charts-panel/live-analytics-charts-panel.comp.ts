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
  selector: 'aca-live-analytics-charts-panel',
  templateUrl: './live-analytics-charts-panel.comp.html',
  styleUrls: ['./live-analytics-charts-panel.comp.scss'],
})
export class LiveAnalyticsChartsPanel implements OnInit, OnDestroy {

  static getClassName() {
    return 'LiveAnalyticsChartsPanel';
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
