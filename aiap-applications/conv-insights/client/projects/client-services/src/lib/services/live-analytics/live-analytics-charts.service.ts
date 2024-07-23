/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import lodash from 'lodash';

import {
  _debugX,
  _errorX,
  ENUM_CHART_TYPE,
} from 'client-shared-utils';

import {
  ChartService,
} from '..';

@Injectable({
  providedIn: 'root'
})
export class LiveAnalyticsChartsService {

  static getClassName() {
    return 'LiveAnalyticsChartsService';
  }

  constructor(
    private chartService: ChartService,
  ) { }

  getChart(params: any) {
    let type: string;
    let retVal;
    try {
      _debugX(LiveAnalyticsChartsService.getClassName(), 'getChart', { params });
      type = params?.type

      switch (type) {
        case ENUM_CHART_TYPE.PIE:
          retVal = this.chartService.getChartPie(params);
          break;
        case ENUM_CHART_TYPE.LINE:
          retVal = this.chartService.getChartLine(params);
          break;
        case ENUM_CHART_TYPE.BAR:
          retVal = this.chartService.getChartBar(params);
          break;
        case ENUM_CHART_TYPE.BAR_STACKED:
          retVal = this.chartService.getChartMultiStackedBar(params);
          break;
        case ENUM_CHART_TYPE.BAR_HORIZONTAL:
          retVal = this.chartService.getChartHorizontalBar(params);
          break;
        case ENUM_CHART_TYPE.BAR_VERTICAL:
          retVal = this.chartService.getChartVerticalBar(params);
          break;
        case ENUM_CHART_TYPE.MIXED:
          retVal = this.chartService.getChartMixed(params);
          break;
        default:
          break;
      }
      return retVal;
    } catch (error: any) {
      _errorX(LiveAnalyticsChartsService.getClassName(), 'getChart', { error, params });
      throw error;
    }
  }
}
