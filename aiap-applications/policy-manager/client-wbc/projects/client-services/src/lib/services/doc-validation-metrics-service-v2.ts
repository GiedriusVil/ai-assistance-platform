/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  _debugW,
} from 'client-shared-utils';

import {
  BaseServiceV1,
  SessionServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

@Injectable()
export class DocValidationMetricsServiceV2 extends BaseServiceV1 {

  static getClassName() {
    return 'DocValidationMetricsServiceV2';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private httpClient: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._host()}/api/v1/doc-validation-metrics`;
    return RET_VAL;
  }

  getdata(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/total-validation-requests-by-day`;
    const REQUEST = {
      ...query
    };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugW(DocValidationMetricsServiceV2.getClassName(), 'getdata',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_HEADERS,
      });

    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  getfrequency(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/count-rule-frequency`;
    const REQUEST = {
      ...query
    };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugW(DocValidationMetricsServiceV2.getClassName(), 'getdata',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_HEADERS,
      });

    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }
}
