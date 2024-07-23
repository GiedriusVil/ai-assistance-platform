/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

@Injectable()
export class LiveAnalyticsMetricsService extends BaseServiceV1 {

  static getClassName() {
    return 'LiveAnalyticsMetricsService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    protected httpClient: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  retrieveMetricsByQuery(query: any) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/analytics-live/metrics`;
    const REQUEST = { query }
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(LiveAnalyticsMetricsService.getClassName(), 'retrieveMetricsByQuery', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }
}
