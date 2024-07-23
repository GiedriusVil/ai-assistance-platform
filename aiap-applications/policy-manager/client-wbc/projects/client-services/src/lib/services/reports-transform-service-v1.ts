/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import {
  _debugW,
} from 'client-shared-utils';

import {
  ENUMERATIONS_CHART_TYPE,
} from 'client-utils';

@Injectable({
  providedIn: 'root'
})
export class ReportsTransformServiceV1 {

  static getClassName() {
    return 'ReportsTransformServiceV1';
  }

  constructor() { }

  public transformData(name, data) {
    switch (name) {
      case 'totalPurchaseRequests':
        return this.transformPRByDay(data);
      case 'countPurchaseRequestValidations':
        return this.transformPRValidationCount(data);
      case ENUMERATIONS_CHART_TYPE.TOTAL_VALIDATION_COUNT:
        return this.transformTotalValidationCounts(data);
      case ENUMERATIONS_CHART_TYPE.CATALOG_RULES_FREQUENCY:
      case ENUMERATIONS_CHART_TYPE.CLASSIFICATION_RULES_FREQUENCY:
      case ENUMERATIONS_CHART_TYPE.BUY_RULES_FREQUENCY:
        return this.transformFrequencyData(data);
    }
  }

  private transformPRByDay(data) {
    return {
      x: data.map(record => record.day),
      y: data.map(record => record.total),
    };
  }

  private transformPRValidationCount(data) {
    return {
      x: data.map(record => record.name),
      y: data.map(record => record.count),
    };
  }

  private transformTotalValidationCounts(data) {
    let labels = new Set();
    let validationsReceived = {};
    for (const RULE_TYPE of data) {
      for (const REQUEST of RULE_TYPE.requests) {
        if (validationsReceived[RULE_TYPE._id] === undefined) {
          validationsReceived[RULE_TYPE._id] = {};
        }
        validationsReceived[RULE_TYPE._id][REQUEST.day] = REQUEST.total;
        labels.add(REQUEST.day);
      }
    }

    let values = [];
    let labelArray = Array.from(labels).sort();

    for (let ruleType of Object.keys(validationsReceived)) {
      let ruleValues = [];
      for (let label of labelArray) {
        ruleValues.push(validationsReceived[ruleType][label] || 0);
      }
      values.push({
        label: `${ruleType}`,
        values: ruleValues,
      })
    }


    const RET_VAL = {
      x: labelArray,
      y: values,
    };
    _debugW(ReportsTransformServiceV1.getClassName(), 'transformTotalValidationCounts',
      {
        RET_VAL
      })
    return RET_VAL;
  }

  private transformFrequencyData(data) {
    return {
      x: data.map(record => record._id),
      y: data.map(record => record.count),
    };
  }
}
