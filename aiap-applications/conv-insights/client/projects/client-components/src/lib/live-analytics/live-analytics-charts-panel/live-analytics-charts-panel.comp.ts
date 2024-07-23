/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnChanges, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import { } from 'client-shared-services';

@Component({
  selector: 'aca-live-analytics-charts-panel',
  templateUrl: './live-analytics-charts-panel.comp.html',
  styleUrls: ['./live-analytics-charts-panel.comp.scss'],
})
export class LiveAnalyticsChartsPanel implements OnInit, OnChanges, OnDestroy {

  static getClassName() {
    return 'LiveAnalyticsChartsPanel';
  }

  @Input() configuration: any;
  @Input() query: any;
  @Input() _cancelMetricsRequests$: Subject<void>;

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void { }

  private load() {
    _debugX(LiveAnalyticsChartsPanel.getClassName(), 'loadData', {});
  }

  ngOnDestroy(): void { }

}
