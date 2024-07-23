/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import { Chart, ChartConfiguration, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import lodash from 'lodash';
import * as ramda from 'ramda';

import {
  _debugX,
  _errorX,
} from 'client-utils';

import { getChartOptionsMixed } from './chart-options-mixed.utils';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {

  static getClassName() {
    return 'LiveAnalyticsChartsService';
  }

  constructor(
  ) {
    Chart.register(...registerables);
    Chart.register(zoomPlugin);
    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = '"ibm-plex-sans", Helvetica Neue, Arial, sans-serif';
    Chart.defaults.color = '#152935';
  }

  getChart(params: any) {
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
      console.log('getChartOptionsMixed', params);
      const CHART_OPTIONS = getChartOptionsMixed(chart, data);
      const CHART_CONFIGURATION: ChartConfiguration = {
        type: 'bar',
        data: CHART_DATA,
        options: CHART_OPTIONS,
      };

      _debugX(ChartsService.getClassName(), 'getChartMixed', { params, CHART_DATA, CHART_OPTIONS });
      const RET_VAL = new Chart(canvasNativeElement, CHART_CONFIGURATION);
      return RET_VAL;


    } catch (error: any) {
      _errorX(ChartsService.getClassName(), 'getChart', { error, params });
      throw error;
    }
  }

  private makeGroupedDataSetsForMixedChart(params: any) {
    const DEFAULT_COLOR = '#0328fc';
    const DATA = params?.data?.y;
    const COLORS = params?.chart?.chartjs?.colors?.colors;
    const RET_VAL = [];
    for (let i = 0; i < DATA.length; i++) {
      const COLOR = ramda.path([i], COLORS);
      RET_VAL.push({
        type: DATA[i].type,
        label: DATA[i].name,
        fill: false,
        backgroundColor: COLOR || DEFAULT_COLOR,
        data: DATA[i].metric_data,
      });
    }
    return RET_VAL;
  }
}
