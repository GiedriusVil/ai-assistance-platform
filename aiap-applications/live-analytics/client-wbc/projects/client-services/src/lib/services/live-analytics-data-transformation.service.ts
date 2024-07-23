/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX, _errorX,
} from 'client-utils';

@Injectable({
  providedIn: 'root'
})
export class LiveAnalyticsDataTransformationService {

  static getClassName() {
    return 'LiveAnalyticsDataTransformationService';
  }

  constructor() { }

  public transfromMetricsData(query: any, chart: any, response: any) {
    const RESPONSE_TRANSFORMED = {};
    let metricIds;
    try {
      metricIds = Object.keys(response);
      if (
        !lodash.isEmpty(metricIds) &&
        lodash.isArray(metricIds)
      ) {
        for (let id of metricIds) {
          if (
            !lodash.isEmpty(id)
          ) {
            let data = response[id];
            RESPONSE_TRANSFORMED[id] = this.transformMetricData({ query, chart, metric: { id, data } });
          }
        }
      }
      const RET_VAL = this.mergeMetricsData(RESPONSE_TRANSFORMED);
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsDataTransformationService.getClassName(), 'transfromMetricsData', { error });
      throw error;
    }
  }


  private mergeMetricsData(metricsData: any) {
    let metricIds;
    let metricId;
    let retVal;
    try {
      _debugX(LiveAnalyticsDataTransformationService.getClassName(), 'mergeMetricsData', { metricsData });
      metricIds = Object.keys(metricsData);
      if (
        !lodash.isEmpty(metricIds) &&
        lodash.isArray(metricIds)
      ) {
        if (
          metricIds.length == 1
        ) {
          metricId = metricIds[0];
          retVal = metricsData[metricId];
        } else if (
          metricIds.length > 1
        ) {
          retVal = {
            y: []
          };
          for (let tmpMetricId of metricIds) {
            let tmpMetricData = metricsData[tmpMetricId];
            if (
              lodash.isEmpty(retVal?.x) &&
              !lodash.isEmpty(tmpMetricData?.x)
            ) {
              retVal.x = tmpMetricData?.x;
            }
            if (
              !lodash.isEmpty(tmpMetricData?.y) &&
              lodash.isArray(tmpMetricData?.y)
            ) {
              retVal.y.push(tmpMetricData.y[0]);
            }
          }
        }
      }
      _debugX(LiveAnalyticsDataTransformationService.getClassName(), 'mergeMetricsData', {
        metricsData,
        metricIds,
        retVal,
      });
      return retVal;
    } catch (error: any) {
      _errorX(LiveAnalyticsDataTransformationService.getClassName(), 'mergeMetricsData', { error, metricsData });
      throw error;
    }
  }

  private transformMetricData(params: any) {
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      metricId = params?.metric?.id;
      metricData = params?.metric?.data;
      if (
        !lodash.isEmpty(metricId) &&
        !lodash.isEmpty(metricData)
      ) {
        chart = params?.chart;
        metricId = params?.metric?.id;
        metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
        metricData = params?.metric?.data;
        const RET_VAL: any = {};
        const LABELS = params?.metric?.data?.labels;
        const DATASET = params?.metric?.data?.dataset;

        RET_VAL.x = LABELS;
        RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
        _debugX(LiveAnalyticsDataTransformationService.getClassName(), 'transformMetricData', { RET_VAL, params });
        return RET_VAL;
      }

    } catch (error: any) {
      _errorX(LiveAnalyticsDataTransformationService.getClassName(), 'transformMetricData', { error, params });
      throw error;
    }
  }

  private retrieveMetricDefinitionFromChart(params: any) {
    let metricId: any;
    let metrics: any;

    let retVal: any;
    try {
      metricId = params?.metricId;
      metrics = params?.chart?.metrics;
      if (
        !lodash.isEmpty(metrics) &&
        lodash.isArray(metrics)
      ) {
        retVal = metrics.find((tmpItem: any) => tmpItem.id === metricId);
      }
      return retVal;
    } catch (error: any) {
      _errorX(LiveAnalyticsDataTransformationService.getClassName(), 'retrieveMetricDefinitionFromChart', { error, params });
      throw error;
    }
  }

}
