/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import {
  ENUMERATIONS_CHART_TYPE,
} from 'client-utils'

import {
  DocValidationMetricsServiceV1
} from './doc-validation-metrics-service-v1';

import {
  DocValidationMetricsServiceV2
} from './doc-validation-metrics-service-v2';

@Injectable({
  providedIn: 'root'
})
export class ReportsDataServiceV1 {

  static getClassName() {
    return 'ReportsDataServiceV1';
  }

  constructor(
    private docValidationMetricsServiceV1: DocValidationMetricsServiceV1,
    private docValidationMetricsServiceV2: DocValidationMetricsServiceV2
  ) { }

  getData(name, query) {
    let retVal;
    switch (name) {
      case 'totalPurchaseRequests':
        retVal = this.docValidationMetricsServiceV1.retrievePRCountByDay(query);
        return retVal;
      //
      case 'countPurchaseRequestValidations':
        retVal = this.docValidationMetricsServiceV1.retrievePRValidationCount(query);
        return retVal;
      //
      case ENUMERATIONS_CHART_TYPE.TOTAL_VALIDATION_COUNT:
        retVal = this.docValidationMetricsServiceV2.getdata(query);
        return retVal;
      //
      case ENUMERATIONS_CHART_TYPE.CATALOG_RULES_FREQUENCY:
        query.filter.ruleType = 'CATALOG_RULES';
        retVal = this.docValidationMetricsServiceV2.getfrequency(query);
        return retVal;
      //
      case ENUMERATIONS_CHART_TYPE.CLASSIFICATION_RULES_FREQUENCY:
        query.filter.ruleType = 'CLASSIFICATION_RULES';
        retVal = this.docValidationMetricsServiceV2.getfrequency(query);
        return retVal;
      //
      case ENUMERATIONS_CHART_TYPE.BUY_RULES_FREQUENCY:
        query.filter.ruleType = 'BUY_RULES';
        retVal = this.docValidationMetricsServiceV2.getfrequency(query);
        return retVal;
      //
    }
  }
}
