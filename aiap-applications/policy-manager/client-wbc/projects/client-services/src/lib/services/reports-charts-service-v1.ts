/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import { ChartServiceV1 } from './chart-service-v1';

@Injectable({
  providedIn: 'root'
})
export class ReportsChartsServiceV1 {

  static getClassName() {
    return 'ReportsChartsServiceV1';
  }

  constructor(
    private chartService: ChartServiceV1
  ) { }

  getChart(type: string, canvasNativeEl, chartData) {
    switch (type) {
      case 'pie':
        return this.chartService.getPieChart(
          canvasNativeEl,
          chartData.x,
          chartData.y,
        );
      case 'line':
        return this.chartService.getLineChart(
          canvasNativeEl,
          chartData.x,
          chartData.y,
        );
      case 'bar':
        return this.chartService.getBarChart(
          canvasNativeEl,
          chartData.x,
          chartData.y,
        );
      case 'horizontalBar':
        return this.chartService.getHorizontalBarChart(
          canvasNativeEl,
          chartData.x,
          chartData.y,
        );
    }
  }
}
