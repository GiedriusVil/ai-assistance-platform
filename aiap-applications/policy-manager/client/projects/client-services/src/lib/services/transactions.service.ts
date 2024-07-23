/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

@Injectable()
export class TransactionsService extends BaseServiceV1 {

  static getClassName() {
    return 'TransactionsService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private http: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  findManyByQuery(query: any) {
    const QUERY = lodash.cloneDeep(query);

    _debugX(TransactionsService.getClassName(), 'findManyByQuery', { QUERY });
    const REQUEST_URL = `${this._hostUrl()}/api/v1/purchase-requests/find-many-by-query`;
    const REQUEST = {
      ...QUERY
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  retriveMetrics(query: any) {
    const QUERY = lodash.cloneDeep(query);

    _debugX(TransactionsService.getClassName(), 'retrieveMetrics', { QUERY });
    const REQUEST_URL = `${this._hostUrl()}/api/metrics/purchase-requests/calculations`;
    const REQUEST = {
      ...QUERY
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  retrievePRCountByDay(query: any) {
    const QUERY = lodash.cloneDeep(query);

    _debugX(TransactionsService.getClassName(), 'retrievePRCountByDay', { QUERY });
    const REQUEST_URL = `${this._hostUrl()}/api/metrics/purchase-requests/count-by-day`;
    const REQUEST = {
      ...QUERY
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  retrievePRValidationCount(query: any) {
    const QUERY = lodash.cloneDeep(query);

    _debugX(TransactionsService.getClassName(), 'retrievePRCountByDay', { QUERY });
    const REQUEST_URL = `${this._hostUrl()}/api/metrics/purchase-requests/count-by-validations`;
    const REQUEST = {
      ...QUERY
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  retriveValidationFrequency(query: any) {
    const QUERY = lodash.cloneDeep(query);

    _debugX(TransactionsService.getClassName(), 'retriveValidationFrequency', { QUERY });
    const REQUEST_URL = `${this._hostUrl()}/api/metrics/purchase-requests/validation-frequency`;
    const REQUEST = {
      ...QUERY
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

}
