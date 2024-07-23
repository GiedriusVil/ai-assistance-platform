/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import { ChartOptions } from 'chart.js';
import * as lodash from 'lodash';
import * as ramda from 'ramda';

export function ensureOptionsPlugins(target: ChartOptions, chart: any) {
  if (
    lodash.isEmpty(target)
  ) {
    return;
  }
  if (
    lodash.isEmpty(target?.plugins)
  ) {
    target.plugins = {};
  }
  if (
    !lodash.isEmpty(chart?.chartjs?.plugins?.zoom)
  ) {
    target.plugins.zoom = chart?.chartjs?.plugins?.zoom;
  }
  if (
    !lodash.isEmpty(chart?.chartjs?.plugins?.datalabels)
  ) {
    target.plugins.datalabels = chart.chartjs.plugins.datalabels;
    target.plugins.datalabels.display = (context: any) => {
      const INDEX = context?.dataIndex;
      const DATA = context?.dataset?.data;
      let value;
      if (
        lodash.isArray(DATA) &&
        INDEX < DATA.length
      ) {
        value = DATA[INDEX];
      }
      let retVal = false;
      if (
        value > 0
      ) {
        retVal = true;
      }
      return retVal;
    }
  }
}

export function ensureOptionsPluginsLegend(target: ChartOptions, chart: any) {
  if (
    lodash.isEmpty(target)
  ) {
    return;
  }
  if (
    lodash.isEmpty(target?.plugins)
  ) {
    target.plugins = {};
  }
  target.plugins.legend = {
    display: true,
    position: 'bottom',
  }
  if (
    !lodash.isEmpty(chart?.chartjs?.plugins?.legend)
  ) {
    target.plugins.legend = chart.chartjs.plugins.legend;
  }
}

function _getAxeMaxValue(params) {
  const DATA = params?.data;
  const TARGET_PERCENTAGE = params?.targetPercentage;
  const CHART = params?.chart;
  const IS_CHART_STACKED_BAR = CHART?.chartjs?.scales?.x?.stacked;
  let retVal;
  if (
    !lodash.isEmpty(DATA) &&
    lodash.isArray(DATA)
  ) {
    let maxAxeValue: any = 0;
    DATA.forEach(metric => {
      if (
        !lodash.isEmpty(metric.metric_data) &&
        lodash.isArray(metric.metric_data)
      ) {
        if (
          IS_CHART_STACKED_BAR
        ) {
          const MAX_METRIC_DATA = lodash.max(metric.metric_data);
            maxAxeValue += MAX_METRIC_DATA;
        } else {
          metric.metric_data.forEach(metricValue => {
            if (metricValue > maxAxeValue) {
              maxAxeValue = metricValue;
            }
          });
        }
      }
    });
    if (maxAxeValue > 0) {
      retVal = Math.ceil(maxAxeValue + ((maxAxeValue * TARGET_PERCENTAGE) / 100));
    }
  } else {
    return;
  }
  return retVal;
}

function _getAxeStepSize(data: any) {
  let retVal;
  if (
    !lodash.isEmpty(data) &&
    lodash.isArray(data)
  ) {
    const DIFFERENCE_BETWEEN_POINTS = data.slice(1).map((x, i) => x - data[i]);
    retVal = lodash.mean(DIFFERENCE_BETWEEN_POINTS);
  }
  return retVal;
}

export function ensureOptionsScales(target: ChartOptions, chart: any, data: any) {
  if (
    lodash.isEmpty(target)
  ) {
    return;
  }
  if (
    lodash.isEmpty(target?.scales)
  ) {
    target.scales = {};
  }
  const TARGET_PERCENTAGE = 10;
  const MAX_PARAMS = {
    targetPercentage: TARGET_PERCENTAGE,
    data: data,
    chart: chart
  };
  target.scales.x = {
    ticks: {
      font: {
        size: 20
      }
    },
  }
  target.scales.y = {
    ticks: {
      font: {
        size: 20
      },
      stepSize: _getAxeStepSize(data)
    },
    max: _getAxeMaxValue(MAX_PARAMS)
  }
  if (
    !lodash.isEmpty(chart?.chartjs?.scales?.x)
  ) {
    target.scales.x = ramda.mergeDeepRight(target.scales.x, chart.chartjs.scales.x)
  }
  if (
    !lodash.isEmpty(chart?.chartjs?.scales?.y)
  ) {
    target.scales.y = ramda.mergeDeepRight(target.scales.y, chart.chartjs.scales.y)
  }
}

export function ensureOptionsLayout(target: ChartOptions, chart: any) {
  if (
    lodash.isEmpty(target)
  ) {
    return;
  }
  target.layout = {
    padding: 20
  };
  if (
    !lodash.isEmpty(chart?.chartjs?.layout)
  ) {
    target.layout = chart.chartjs.layout;
  }
}

function _getColorsSlice(colors: any, length: number) {
  colors.reverse();
  return colors.slice(0, length);
}

export function ensureOptionsColor(target: ChartOptions, chart: any, data: any) {
  const DEFAULT_COLOR = '#0328fc';
  let colors;
  if (
    lodash.isEmpty(target)
  ) {
    return;
  }
  if (
    !lodash.isEmpty(chart?.chartjs?.colors?.colors) &&
    lodash.isArray(chart?.chartjs?.colors?.colors)
  ) {
    colors = chart.chartjs.colors.colors;
  } else {
    colors = DEFAULT_COLOR;
  }
  if (lodash.isArray(colors)) {
    target.backgroundColor = _getColorsSlice(colors, data.length);
  } else {
    target.backgroundColor = colors;
  }
}

export function ensureOptionsBorderColor(target: ChartOptions, chart: any) {
  if (
    lodash.isEmpty(target)
  ) {
    return;
  }
  const DEFAULT_BORDER_COLOR = '#ffffff';
  target.borderColor = DEFAULT_BORDER_COLOR;
  if (!lodash.isEmpty(chart.borderColor)) {
    target.borderColor = chart.borderColor
  }
}
