/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  _debugX,
  _errorX,
  ENUM_CHART_TYPE,
  ENUM_LIVE_METRIC_ID,
} from 'client-shared-utils';

import { DEFAULT_TABLE } from 'client-utils';

import {
  LiveAnalyticsMetricsDataService,
  LiveAnalyticsMetricsDataTransformationService,
  LiveAnalyticsChartsService
} from 'client-services';


@Component({
  selector: 'aca-live-analytics-chart',
  templateUrl: './live-analytics-chart.comp.html',
  styleUrls: ['./live-analytics-chart.comp.scss'],
})
export class LiveAnalyticsChart implements OnInit, OnChanges {

  static getClassName() {
    return 'LiveAnalyticsChart';
  }

  private _destroyed$: Subject<void> = new Subject();

  @ViewChild('canvas') canvas;

  @Input() chart: any;
  @Input() query: any;
  @Input() configuration: any;
  @Input() _cancelMetricsRequests$: Subject<void>;

  _state = {
    intentSlider: false,
    isLoading: false,
    showRaw: false,
    queryType: DEFAULT_TABLE.LIVE_METRICS.TYPE,
    error: undefined,
    errorMessage: 'Unable to load metrics data!',
    metricsSelected: [],
    response: undefined,
    data: undefined,
    chart: undefined,
  }
  state: any = lodash.cloneDeep(this._state);

  constructor(
    private liveAnalyticsMetricsDataService: LiveAnalyticsMetricsDataService,
    private liveAnalyticsMetricsDataTransformationService: LiveAnalyticsMetricsDataTransformationService,
    private liveAnalyticsChartsService: LiveAnalyticsChartsService,
  ) { }

  ngOnInit(): void {
    this.refreshState();
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    _debugX(LiveAnalyticsChart.getClassName(), 'ngOnChanges', {
      changes: changes,
      this_query: this.query,
      this_configuration: this.configuration,
    });
  }

  ngOnDestroy(): void {
    if (lodash.isFunction(this.state?.chart?.destroy)) {
      this.state.chart.destroy();
    }
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  retrieveDefaultMetrics(metrics) {
    const RET_VAL = [];
    if (
      lodash.isArray(metrics) &&
      !lodash.isEmpty(metrics)
    ) {
      for (let metric of metrics) {
        const DEFAULT_METRIC = metric?.isDefault;
        if (DEFAULT_METRIC) {
          RET_VAL.push(metric);
        }
      }
    }
    return RET_VAL;
  }

  private refreshState() {
    const NEW_STATE = lodash.cloneDeep(this.state);
    let defaultMetrics;
    if (
      !lodash.isEmpty(this.chart?.metrics) &&
      lodash.isArray(this.chart?.metrics) &&
      this.chart?.metrics.length === 1
    ) {
      defaultMetrics = this.retrieveDefaultMetrics(this.chart.metrics);
      NEW_STATE.metricsSelected = [...defaultMetrics];
    }
    if (
      lodash.isEmpty(this.state?.metricsSelected) &&
      !lodash.isEmpty(this.chart?.metrics) &&
      lodash.isArray(this.chart?.metrics)
    ) {
      defaultMetrics = this.retrieveDefaultMetrics(this.chart.metrics);
      NEW_STATE.metricsSelected = defaultMetrics;
    }
    if (this.chart?.id === ENUM_LIVE_METRIC_ID.LOW_CONFIDENCE_INTENTS_V1) {
      NEW_STATE.intentSlider = true;
      if (!lodash.isNumber(this.query?.filter?.confidence)) {
        this.query.filter.confidence = 0.5;
      }
    }

    _debugX(LiveAnalyticsChart.getClassName(), 'refreshState', {
      this_state: this.state,
      new_state: NEW_STATE
    });
    this.state = NEW_STATE;
  }

  private loadData() {
    const NEW_STATE = lodash.cloneDeep(this.state);
    this.chart.enableMetricsSelection = true;
    if (this.state?.chart) {
      this.state.chart.destroy();
      NEW_STATE.chart = undefined;
    }
    if (this.state?.response) {
      NEW_STATE.response = undefined;
    }
    NEW_STATE.isLoading = true;
    NEW_STATE.error = undefined;
    this.state = NEW_STATE;
    const PARAMS = {
      query: this.query,
      metrics: this.state.metricsSelected,
      configuration: this.configuration,
    }
    _debugX(LiveAnalyticsChart.getClassName(), 'loadData', { this_chart: this.chart, PARAMS });
    this.liveAnalyticsMetricsDataService.retrieveMetricsData(PARAMS).pipe(
      catchError((error: any) => this.handleRetrieveDataByQueryError(error)),
      takeUntil(this._cancelMetricsRequests$),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(LiveAnalyticsChart.getClassName(), 'loadData', { response });
      this.state.response = response;
      this.transformResponseToChart(PARAMS?.query, response);
    });
  }

  private transformResponseToChart(query: any, response: any): void {
    try {
      _debugX(LiveAnalyticsChart.getClassName(), 'transformResponseToChart', {
        this_chart: this.chart,
        query: query,
        response: response
      });
      const DATA = this.liveAnalyticsMetricsDataTransformationService.transfromMetricsData(query, this.chart, response);
      const NEW_STATE = lodash.cloneDeep(this.state);
      NEW_STATE.data = DATA;
      _debugX(LiveAnalyticsChart.getClassName(), 'transformResponseToChart', { NEW_STATE });
      if (
        !lodash.isEmpty(this.chart?.chartjs) &&
        !lodash.isEmpty(this.configuration?.chartjs)
      ) {
        this.chart.chartjs = ramda.mergeDeepRight(
          this.configuration.chartjs,
          this.chart.chartjs,
        );
      }

      const CHART_PARAMS = {
        type: ENUM_CHART_TYPE.MIXED,
        chart: this.chart,
        canvas: this.canvas,
        data: NEW_STATE.data
      };
      NEW_STATE.chart = this.liveAnalyticsChartsService.getChart(CHART_PARAMS);
      NEW_STATE.isLoading = false;
      this.state = NEW_STATE;
    } catch (error: any) {
      _errorX(LiveAnalyticsChart.getClassName(), 'transformResponseToChart', { error });
      throw error;
    }
  }

  handleMetricsSelectionEvent(metrics: any) {
    _debugX(LiveAnalyticsChart.getClassName(), 'handleMetricsSelectionEvent', { metrics });
    this.state.metricsSelected = metrics;
    this.loadData();
  }

  handleReloadClick(event: any) {
    _debugX(LiveAnalyticsChart.getClassName(), 'handleReloadClick', { event });
    this.loadData();
  }

  handleShowRawChangeEvent(event: any) {
    _debugX(LiveAnalyticsChart.getClassName(), 'handleRetrieveDataByQueryError', { event });
    this.state.showRaw = event?.checked;
  }

  canvasClassNames() {
    let retVal = 'canvas';
    if (
      this.state.isLoading
    ) {
      retVal = 'canvas-hidden';
    }
    return retVal;
  }

  acaJsonEditorClassNames() {
    let retVal = '';
    if (
      this.state.isLoading ||
      !this.state.showRaw
    ) {
      retVal = 'aca-json-editor-hidden';
    }
    return retVal;
  }

  private handleRetrieveDataByQueryError(error: any) {
    _errorX(LiveAnalyticsChart.getClassName(), 'handleRetrieveDataByQueryError', { error });
    const NEW_STATE = lodash.cloneDeep(this.state);
    NEW_STATE.error = error;
    this.state = NEW_STATE;
    return of();
  }

  onConfidenceChange(confidence: number) {
    this.query.filter.confidence = confidence;
  }
}
