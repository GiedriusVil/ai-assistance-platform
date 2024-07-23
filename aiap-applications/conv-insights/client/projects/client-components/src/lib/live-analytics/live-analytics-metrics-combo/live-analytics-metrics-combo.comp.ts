/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { EventEmitter, Output, Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as lodash from 'lodash';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

@Component({
  selector: 'aca-live-analytics-metrics-combo',
  templateUrl: './live-analytics-metrics-combo.comp.html',
  styleUrls: ['./live-analytics-metrics-combo.comp.scss']
})
export class LiveAnalyticsMetricsCombo implements OnInit, OnChanges {

  static getClassName() {
    return 'LiveAnalyticsMetricsCombo';
  }

  @Input() disabled: boolean;
  @Input() metrics: any;
  @Input() metricsSelected: any;

  @Output() onMetricsSelected = new EventEmitter<any>();

  _state = {
    metrics: [],
    metricsSelected: [],
    metricsSelectedCache: [],
  }
  state = lodash.cloneDeep(this._state);

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    _debugX(LiveAnalyticsMetricsCombo.getClassName(), 'ngOnChanges', { changes });
    this.refreshMetrics();
  }

  private refreshMetrics() {
    const NEW_STATE = lodash.cloneDeep(this.state);
    const NEW_METRICS = [];
    if (
      lodash.isArray(this.metrics) &&
      !lodash.isEmpty(this.metrics)
    ) {
      for (let metric of this.metrics) {
        NEW_METRICS.push({
          content: `${metric?.name}`,
          value: metric,
        });
      }
    }
    NEW_STATE.metrics = NEW_METRICS;
    const NEW_METRICS_SELECTED = [];
    if (
      lodash.isArray(this.metricsSelected) &&
      !lodash.isEmpty(this.metricsSelected)
    ) {
      for (let metric of this.metricsSelected) {
        NEW_METRICS_SELECTED.push({
          content: `${metric?.name}`,
          selected: true,
          value: metric,
        });
      }
    }
    NEW_STATE.metricsSelected = NEW_METRICS_SELECTED;
    NEW_STATE.metricsSelectedCache = NEW_METRICS_SELECTED;
    _debugX(LiveAnalyticsMetricsCombo.getClassName(), 'ngOnChanges', {
      this_state: this.state,
      new_state: NEW_STATE,
    });
    this.state = NEW_STATE;
  }

  handleMetricsSearchEvent(event: any) {
    _debugX(LiveAnalyticsMetricsCombo.getClassName(), 'handleMetricsSearchEvent', {
      event
    });
  }

  handleCloseEvent(event: any) {
    let isSelectionSame = lodash.isEqual(this.state.metricsSelectedCache, this.state.metricsSelected);
    _debugX(LiveAnalyticsMetricsCombo.getClassName(), 'handleCloseEvent', {
      event,
      this_metrics_selected_cache: this.state.metricsSelectedCache,
      this_metrics_selected: this.state.metricsSelected,
      isSelectionSame
    });
    if (
      !isSelectionSame
    ) {
      this.state.metricsSelectedCache = lodash.cloneDeep(this.state.metricsSelected);
      const SELECTED_METRICS = this.state.metricsSelected.map((item: any) => item?.value);
      this.onMetricsSelected.emit(SELECTED_METRICS);
    }
  }

}
