/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { of, Subject, Subscription, forkJoin } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  QueryServiceV1,
  EventsServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  ChartsConfigurationsService,
  LiveAnalyticsService,
  LiveAnalyticsDataTransformationService,
  ChartsService,
} from 'client-services';


@Component({
  selector: 'aiap-live-analytics-chart-v2',
  templateUrl: './live-analytics-chart-v2.html',
  styleUrls: ['./live-analytics-chart-v2.scss'],
})
export class LiveAnalyticsChartV2 implements OnInit, OnDestroy {

  static getClassName() {
    return 'LiveAnalyticsChartV2';
  }

  private _destroyed$: Subject<void> = new Subject();

  @ViewChild('canvas') canvas;

  @Input() chartRef: any;
  @Input() configuration: any;

  chart: any;
  filtersSubscription: Subscription;
  _state: any = {
    query: undefined,
    intentSlider: false,
    isLoading: false,
    showRaw: false,
    error: undefined,
    errorMessage: 'Unable to load metrics data!',
    metricsSelected: [],
    response: undefined,
    data: undefined,
    chart: undefined,
    chartName: undefined
  }
  state: any = lodash.cloneDeep(this._state);

  constructor(
    private chartService: ChartsConfigurationsService,
    private liveAnalyticsService: LiveAnalyticsService,
    private liveAnalyticsDataTransformationService: LiveAnalyticsDataTransformationService,
    private chartsService: ChartsService,
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
    private translateHelperServiceV1: TranslateHelperServiceV1,
  ) { }

  ngOnInit(): void {
    this.addFilterEventHandler();
    this.loadChart();
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
    this.filtersSubscription.unsubscribe();
  }

  addFilterEventHandler() {
    const QUERY_TYPE = this.configuration?.ref;
    let defaultQuery = this.queryService.query(QUERY_TYPE);
    this.filtersSubscription = this.eventsService.filterEmitter.pipe(
      tap(() => {
        this.eventsService.loadingEmit(true);
        this.setLoading(true);
      }),
      switchMap((query: any) => {
        if (query) {
          defaultQuery = query;
        }
        this.state.query = defaultQuery;
        return this.chartService.findOneByRef(this.chartRef).pipe(
          catchError((error: any) => this.handleRetrieveDataByQueryError(error))
        );
      })
    ).subscribe((response: any) => {
      _debugX(LiveAnalyticsChartV2.getClassName(), 'filterEventHandler', { response });
      this.refreshChart(response);
      this.eventsService.loadingEmit(false);
    });
  }

  loadChart() {
    this.setLoading(true);
    const QUERY_TYPE = this.configuration?.ref;
    this.state.query = this.queryService.query(QUERY_TYPE);
    this.chartService.findOneByRef(this.chartRef).pipe(
      catchError((error: any) => this.handleRetrieveDataByQueryError(error))
    ).subscribe((response: any) => {
      _debugX(LiveAnalyticsChartV2.getClassName(), 'loadChart', { response });
      this.refreshChart(response);
    });
  }

  refreshChart(response) {
    this.chart = response?.value?.chart;
    this.state.chartName = response.name;
    this.refreshState();
    this.loadData();
  }

  retrieveDefaultMetrics(metrics) {
    const RET_VAL = [];
    if (
      lodash.isArray(metrics) &&
      !lodash.isEmpty(metrics)
    ) {
      for (const metric of metrics) {
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

    NEW_STATE.metricsSelected.forEach((metric) => {
      if (metric?.name) {
        metric.name = this.translateHelperServiceV1.instant(metric.name);
      }
    });
    
    _debugX(LiveAnalyticsChartV2.getClassName(), 'refreshState', {
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
    NEW_STATE.error = undefined;
    this.state = NEW_STATE;
    const PARAMS = {
      query: this.state.query,
      metrics: this.state.metricsSelected,
      configuration: this.configuration,
    }
    _debugX(LiveAnalyticsChartV2.getClassName(), 'loadData', { this_chart: this.chart, PARAMS });
    this.retrieveMetricsData(PARAMS).pipe(
      catchError((error: any) => this.handleRetrieveDataByQueryError(error))
    ).subscribe((response: any) => {
      _debugX(LiveAnalyticsChartV2.getClassName(), 'loadDataResponse', { response });
      this.state.response = response;
      this.transformResponseToChart(PARAMS?.query, response);
    });
  }

  retrieveMetricsData(params: any) {
    let metrics;
    try {
      _debugX(LiveAnalyticsService.getClassName(), 'retrieveMetricsData', { params });
      metrics = params?.metrics;
      const FORK_JOIN_SOURCES: any = {};
      if (
        !lodash.isEmpty(metrics) &&
        lodash.isArray(metrics)
      ) {
        for (const metric of metrics) {
          const QUERY = lodash.cloneDeep(params?.query);
          const MERGED_FILTERS = this.mergeMetricFilters(params, metric);
          if (
            !lodash.isEmpty(metric?.id) &&
            !lodash.isEmpty(metric?.queryRef)
          ) {
            const PARAMS = {
              ref: metric?.queryRef,
              query: QUERY,
              filters: MERGED_FILTERS,
            }
            _debugX(LiveAnalyticsService.getClassName(), 'retrieveMetricsData', { PARAMS });
            FORK_JOIN_SOURCES[metric.id] = this.liveAnalyticsService.executeOne(PARAMS);
          }
        }
      }
      const RET_VAL = forkJoin(FORK_JOIN_SOURCES);
      return RET_VAL;
    } catch (error) {
      _errorX(LiveAnalyticsService.getClassName(), 'retrieveMetricsDataByQuery', { params });
      throw error;
    }
  }

  private mergeChartsFilters() {
    const DASHBOARD_FILTERS = lodash.cloneDeep(this.configuration?.elements?.filters);
    const CHART_FILTERS = lodash.cloneDeep(this.chart?.filters);
    let retVal;
    if (
      lodash.isArray(DASHBOARD_FILTERS) &&
      lodash.isArray(CHART_FILTERS)
    ) {
      retVal = lodash.concat(DASHBOARD_FILTERS, CHART_FILTERS);
    } else if (
      lodash.isArray(DASHBOARD_FILTERS)
    ) {
      retVal = DASHBOARD_FILTERS;
    } else if (
      lodash.isArray(CHART_FILTERS)
    ) {
      retVal = CHART_FILTERS;
    }
    _debugX(LiveAnalyticsService.getClassName(), 'mergeChartsFilters', { retVal });
    return retVal;
  }

  handleExportDataEvent() {
    const QUERY = lodash.cloneDeep(this.state.query);
    const MERGED_FILTERS = this.mergeChartsFilters();
    const REF = this.chart?.metrics?.[0]?.queryRef;
    const PARAMS = {
      ref: REF,
      query: QUERY,
      filters: MERGED_FILTERS,
      export: true
    };
    _debugX(LiveAnalyticsChartV2.getClassName(), 'handleExportDataEvent', PARAMS);
    this.liveAnalyticsService.exportOne(PARAMS)
      .pipe(
        catchError((error: any) => this.handleRetrieveDataByQueryError({error}))
      ).subscribe((response: any) => {
        _debugX(LiveAnalyticsChartV2.getClassName(), 'handleExportDataEvent', { response });
        const blob = new Blob([response], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${REF}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
  }

  private mergeMetricFilters(params: any, metric: any) {
    const DASHBOARD_FILTERS = lodash.cloneDeep(params?.configuration?.elements?.filters);
    const METRIC_FILTERS = lodash.cloneDeep(metric?.filters);
    let retVal;
    if (
      lodash.isArray(DASHBOARD_FILTERS) &&
      lodash.isArray(METRIC_FILTERS)
    ) {
      retVal = lodash.concat(DASHBOARD_FILTERS, METRIC_FILTERS);
    } else if (
      lodash.isArray(DASHBOARD_FILTERS)
    ) {
      retVal = DASHBOARD_FILTERS;
    } else if (
      lodash.isArray(METRIC_FILTERS)
    ) {
      retVal = METRIC_FILTERS;
    }
    _debugX(LiveAnalyticsService.getClassName(), 'mergeMetricFilters', { retVal });
    return retVal;
  }

  private transformResponseToChart(query: any, response: any): void {
    try {
      _debugX(LiveAnalyticsChartV2.getClassName(), 'transformResponseToChart', {
        this_chart: this.chart,
        query: query,
        response: response
      });
      const DATA = this.liveAnalyticsDataTransformationService.transfromMetricsData(query, this.chart, response);
      const NEW_STATE = lodash.cloneDeep(this.state);
      NEW_STATE.data = DATA;
      _debugX(LiveAnalyticsChartV2.getClassName(), 'transformResponseToChart', { NEW_STATE });
      if (
        !lodash.isEmpty(this.chart?.chartjs) &&
        !lodash.isEmpty(this.configuration?.configurations?.chartjs)
      ) {
        this.chart.chartjs = ramda.mergeDeepRight(
          this.configuration?.configurations?.chartjs,
          this.chart.chartjs,
        );
      } else if (
        !lodash.isEmpty(this.configuration?.configurations?.chartjs)
      ) {
        this.chart.chartjs = this.configuration?.configurations?.chartjs;
      }

      const CHART_PARAMS = {
        chart: this.chart,
        canvas: this.canvas,
        data: NEW_STATE.data
      };
      NEW_STATE.chart = this.chartsService.getChart(CHART_PARAMS);
      this.state = NEW_STATE;
      this.setLoading(false)
    } catch (error: any) {
      _errorX(LiveAnalyticsChartV2.getClassName(), 'transformResponseToChart', { error });
      throw error;
    }
  }

  handleMetricsSelectionEvent(metrics: any) {
    _debugX(LiveAnalyticsChartV2.getClassName(), 'handleMetricsSelectionEvent', { metrics });
    this.state.metricsSelected = metrics;
    this.loadData();
  }

  handleReloadClick(event: any) {
    _debugX(LiveAnalyticsChartV2.getClassName(), 'handleReloadClick', { event });
    this.loadData();
  }

  handleShowRawChangeEvent(event: any) {
    _debugX(LiveAnalyticsChartV2.getClassName(), 'handleRetrieveDataByQueryError', { event });
    this.state.showRaw = event?.checked;
  }

  private handleRetrieveDataByQueryError(error: any) {
    _errorX(LiveAnalyticsChartV2.getClassName(), 'handleRetrieveDataByQueryError', { error });
    const NEW_STATE = lodash.cloneDeep(this.state);
    NEW_STATE.error = error;
    this.state = NEW_STATE;
    return of();
  }

  private setLoading(value: boolean) {
    const NEW_STATE = lodash.cloneDeep(this.state);
    NEW_STATE.isLoading = value;
    this.state = NEW_STATE;
  }
}
