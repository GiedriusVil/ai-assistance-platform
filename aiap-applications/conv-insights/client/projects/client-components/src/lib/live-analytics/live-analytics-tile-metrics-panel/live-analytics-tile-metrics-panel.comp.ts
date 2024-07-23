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

@Component({
  selector: 'aca-live-analytics-tile-metrics-panel',
  templateUrl: './live-analytics-tile-metrics-panel.comp.html',
  styleUrls: ['./live-analytics-tile-metrics-panel.comp.scss'],
})
export class LiveAnalyticsTileMetricsPanel implements OnInit, OnChanges, OnDestroy {

  static getClassName() {
    return 'LiveAnalyticsTileMetricsPanel';
  }

  @Input() query: any;
  @Input() configuration: any;
  @Input() _cancelMetricsRequests$: Subject<void>;

  percentOfFalsePositiveInfo = 'The percentage is counted by deduction of action needed and false-positive utterances from all utterances.';

  _state = {
    isLoading: false,
  };
  state = lodash.cloneDeep(this._state);

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    _debugX(LiveAnalyticsTileMetricsPanel.getClassName(), 'ngOnChanges', {
      changes: changes,
      this_query: this.query,
      this_configuration: this.configuration,
    });
  }

  ngOnDestroy(): void { }

}
