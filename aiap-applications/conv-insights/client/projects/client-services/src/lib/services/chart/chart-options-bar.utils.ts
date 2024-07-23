/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import { ChartOptions } from 'chart.js';

import {
  ensureOptionsPluginsLegend,
  ensureOptionsLayout,
  ensureOptionsColor,
} from './chart-options.utils';

export function getChartOptionsBar(chart: any, data: any) {
  const RET_VAL: ChartOptions = {};

  RET_VAL.maintainAspectRatio = false;
  RET_VAL.responsive = true;
  ensureOptionsPluginsLegend(RET_VAL, chart);
  ensureOptionsLayout(RET_VAL, chart);
  ensureOptionsColor(RET_VAL, chart, data);

  return RET_VAL;
}
