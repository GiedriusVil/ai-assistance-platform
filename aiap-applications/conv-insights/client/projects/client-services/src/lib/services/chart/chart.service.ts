/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import { Chart, ChartConfiguration, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {
  _debugX, _errorX,
} from 'client-shared-utils';

import { getChartOptionsMixed } from './chart-options-mixed.utils';
import { getChartOptionsLine } from './chart-options-line.utils';
import { getChartOptionsPie } from './chart-options-pie.utils';
import { getChartOptionsBar } from './chart-options-bar.utils';

import { getChartOptionsBarHorizontal } from './chart-options-bar-horizontal.utils';
import { getChartOptionsBarVertical } from './chart-options-bar-vertical.utils';
import { getChartOptionsBarStacked } from './chart-options-bar-stacked.utils';

@Injectable()
export class ChartService {

  static getClassName() {
    return 'ChartService';
  }

  constructor() {
    Chart.register(...registerables);
    Chart.register(zoomPlugin);
    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = '"ibm-plex-sans", Helvetica Neue, Arial, sans-serif';
    Chart.defaults.color = '#152935';
  }

  getChartPie(params: any) {
    let chart: any;
    let canvasNativeElement: any;
    let labels: any;
    let data: any;
    try {
      chart = params?.chart;
      labels = params?.data?.x;
      data = params?.data?.y;
      canvasNativeElement = params?.canvas?.nativeElement;
      const CHART_TYPE = 'pie';
      const CHART_DATA = {
        labels: labels,
        datasets: [
          {
            data: data,
          }
        ]
      };
      const CHART_OPTIONS = getChartOptionsPie(chart, data);
      _debugX(ChartService.getClassName(), 'getChartPie', { params, CHART_TYPE, CHART_DATA, CHART_OPTIONS });
      const RET_VAL = new Chart(canvasNativeElement, {
        type: CHART_TYPE,
        data: CHART_DATA,
        options: CHART_OPTIONS,
      });
      return RET_VAL;
    } catch (error: any) {
      _errorX(ChartService.getClassName(), 'getChartPie', { error, params });
      throw error;
    }
  }

  getChartLine(params: any) {
    let chart: any;
    let canvasNativeElement: any;
    let labels: any;
    let data: any;
    try {
      chart = params?.chart;
      labels = params?.data?.x;
      data = params?.data?.y;
      canvasNativeElement = params?.canvas?.nativeElement;
      const CHART_TYPE = 'line';
      const CHART_DATA = {
        labels: labels,
        datasets: [
          {
            data: data,
            borderColor: '#41d6c3',
            fill: false
          }
        ]
      };
      const CHART_OPTIONS = getChartOptionsLine(chart, data);
      _debugX(ChartService.getClassName(), 'getChartLine', { params, CHART_TYPE, CHART_DATA, CHART_OPTIONS });
      const RET_VAL = new Chart(canvasNativeElement, {
        type: CHART_TYPE,
        data: CHART_DATA,
        options: CHART_OPTIONS,
      });
      return RET_VAL;
    } catch (error: any) {
      _errorX(ChartService.getClassName(), 'getChartLine', { error, params });
      throw error;
    }
  }

  getChartBar(params: any) {
    let chart: any;
    let canvasNativeElement: any;
    let labels: any;
    let data: any;
    try {
      chart = params?.chart;
      labels = params?.data?.x;
      data = params?.data?.y;
      canvasNativeElement = params?.canvas?.nativeElement;
      const CHART_TYPE = 'bar';
      const CHART_DATA = {
        datasets: this.makeDataSets(data, labels, chart)
      };
      const CHART_OPTIONS = getChartOptionsBar(chart, data);
      _debugX(ChartService.getClassName(), 'getChartBar', { params, CHART_TYPE, CHART_DATA, CHART_OPTIONS });
      const RET_VAL = new Chart(canvasNativeElement, {
        type: CHART_TYPE,
        data: CHART_DATA,
        options: CHART_OPTIONS,
      });
      return RET_VAL;
    } catch (error: any) {
      _errorX(ChartService.getClassName(), 'getChartBar', { error, params });
      throw error;
    }
  }

  getChartStackedBar(params: any) {
    let chart: any;
    let canvasNativeElement: any;
    let labels: any;
    let data: any;
    try {
      chart = params?.chart;
      labels = params?.data?.x;
      data = params?.data?.y;
      canvasNativeElement = params?.canvas?.nativeElement;
      const CHART_TYPE = 'bar';
      const CHART_DATA = {
        labels: labels,
        datasets: [
          {
            data: data,
            borderColor: '#ffffff',
          }
        ]
      };
      const CHART_OPTIONS = getChartOptionsBarStacked(chart, data);
      _debugX(ChartService.getClassName(), 'getChartStackedBar', { params, CHART_TYPE, CHART_DATA, CHART_OPTIONS });
      const RET_VAL = new Chart(canvasNativeElement, {
        type: CHART_TYPE,
        data: CHART_DATA,
        options: CHART_OPTIONS,
      });
      return RET_VAL;
    } catch (error: any) {
      _errorX(ChartService.getClassName(), 'getChartStackedBar', { error, params });
      throw error;
    }
  }

  getChartMultiStackedBar(params: any) {
    let chart: any;
    let canvasNativeElement: any;
    let labels: any;
    let data: any;
    try {
      chart = params?.chart;
      labels = params?.data?.x;
      data = params?.data?.y;
      canvasNativeElement = params?.canvas?.nativeElement;
      const CHART_TYPE = 'bar';
      const CHART_DATA = {
        labels: labels,
        datasets: this.makeGroupedDataSets(params),
      };
      const CHART_OPTIONS = getChartOptionsBarStacked(chart, data);
      _debugX(ChartService.getClassName(), 'getChartMultiStackedBar', { params, CHART_TYPE, CHART_DATA, CHART_OPTIONS });

      const RET_VAL = new Chart(canvasNativeElement, {
        type: CHART_TYPE,
        data: CHART_DATA,
        options: CHART_OPTIONS,
      });
      return RET_VAL;
    } catch (error: any) {
      _errorX(ChartService.getClassName(), 'getChartMultiStackedBar', { error, params });
      throw error;
    }
  }

  getChartVerticalBar(params: any) {
    let chart: any;
    let canvasNativeElement: any;
    let labels: any;
    let data: any;
    try {
      chart = params?.chart;
      labels = params?.data?.x;
      data = params?.data?.y;
      canvasNativeElement = params?.canvas?.nativeElement;
      const CHART_TYPE = 'bar';
      const CHART_DATA = {
        labels: labels,
        datasets: this.makeGroupedDataSets(params),
      };
      const CHART_OPTIONS = getChartOptionsBarVertical(chart, data);
      _debugX(ChartService.getClassName(), 'getChartVerticalBar', { params, CHART_TYPE, CHART_DATA, CHART_OPTIONS });
      const RET_VAL = new Chart(canvasNativeElement, {
        type: CHART_TYPE,
        data: CHART_DATA,
        options: CHART_OPTIONS,
      });
      return RET_VAL;
    } catch (error: any) {
      _errorX(ChartService.getClassName(), 'getChartVerticalBar', { error, params });
      throw error;
    }
  }

  getChartHorizontalBar(params: any) {
    let chart: any;
    let canvasNativeElement: any;
    let labels: any;
    let data: any;
    try {
      chart = params?.chart;
      labels = params?.data?.x;
      data = params?.data?.y;
      canvasNativeElement = params?.canvas?.nativeElement;
      const CHART_TYPE = 'bar';
      const CHART_DATA = {
        labels: labels,
        datasets: this.makeGroupedDataSets(params),
      };
      const CHART_OPTIONS = getChartOptionsBarHorizontal(chart, data);
      _debugX(ChartService.getClassName(), 'getChartHorizontalBar', { params, CHART_TYPE, CHART_DATA, CHART_OPTIONS });
      const RET_VAL = new Chart(canvasNativeElement, {
        type: CHART_TYPE,
        data: CHART_DATA,
        options: CHART_OPTIONS,
      });
      return RET_VAL;
    } catch (error: any) {
      _errorX(ChartService.getClassName(), 'getChartHorizontalBar', { error, params });
      throw error;
    }
  }

  getChartMixed(params: any) {
    let chart: any;
    let canvasNativeElement: any;
    let labels: any;
    let data: any;
    try {
      chart = params?.chart;
      labels = params?.data?.x;
      data = params?.data?.y;
      canvasNativeElement = params?.canvas?.nativeElement;
      const CHART_DATA = {
        datasets: this.makeGroupedDataSetsForMixedChart(params),
        labels: labels,
      };
      const CHART_OPTIONS = getChartOptionsMixed(chart, data);
      const CHART_CONFIGURATION: ChartConfiguration = {
        type: 'bar',
        data: CHART_DATA,
        options: CHART_OPTIONS,
      };

      _debugX(ChartService.getClassName(), 'getChartMixed', { params, CHART_DATA, CHART_OPTIONS });
      const RET_VAL = new Chart(canvasNativeElement, CHART_CONFIGURATION);
      return RET_VAL;
    } catch (error: any) {
      _errorX(ChartService.getClassName(), 'getChartMixed', { error, params });
      throw error;
    }
  }

  private makeGroupedDataSets(params) {
    const DEFAULT_COLOR = '#0328fc';
    const DATA = params?.data?.y;
    const COLORS = params?.chart?.chartjs?.colors?.colors;
    const RET_VAL = [];
    for (let i = 0; i < DATA.length; i++) {
      RET_VAL.push({
        label: DATA[i].name,
        backgroundColor: COLORS[i] || DEFAULT_COLOR,
        data: DATA[i].metric_data,
      });
    }
    return RET_VAL;
  }

  private makeGroupedDataSetsForMixedChart(params: any) {
    const DEFAULT_COLOR = '#0328fc';
    const DATA = params?.data?.y;
    const COLORS = params?.chart?.chartjs?.colors?.colors;
    const RET_VAL = [];
    for (let i = 0; i < DATA.length; i++) {
      RET_VAL.push({
        type: DATA[i].type,
        label: DATA[i].name,
        fill: false,
        backgroundColor: COLORS[i] || DEFAULT_COLOR,
        data: DATA[i].metric_data,
      });
    }
    return RET_VAL;
  }

  private makeDataSets(data, labels, chart) {
    const DEFAULT_COLOR = '#0328fc';
    const COLORS = chart?.chartjs?.colors?.colors;
    const RET_VAL = [];
    for (let i = 0; i < data.length; i++) {
      RET_VAL.push({
        label: labels[i],
        backgroundColor: COLORS[i] || DEFAULT_COLOR,
        data: [data[i]]
      });
    }
    return RET_VAL;
  }
}
