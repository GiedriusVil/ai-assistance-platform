/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, of } from 'rxjs';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

import {
  TestWorkersService,
  TestCasesService,
} from '.';

@Injectable()
export class TestExecutionsService extends BaseServiceV1 {

  static getClassName() {
    return 'TestExecutionsService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private httpClient: HttpClient,
    private testWorkersService: TestWorkersService,
    private testCasesService: TestCasesService,
  ) {
    super(environmentService, sessionService);
  }

  findManyByQuery(query: any) {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/test-cases/executions/find-many-by-query`;
    const REQUEST = {
      ...query
    };
    _debugX(TestExecutionsService.getClassName(), 'findManyByQuery', { REQUEST_HEADERS, REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  saveOne(instance: any) {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/test-cases/executions/save-one`;
    const REQUEST = instance;
    _debugX(TestExecutionsService.getClassName(), 'saveOne', { REQUEST_HEADERS, REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  saveMany(instances: Array<any>) {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/test-cases/executions/save-many`;
    const REQUEST = instances;
    _debugX(TestExecutionsService.getClassName(), 'saveMany', { REQUEST_HEADERS, REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  generateMany(params: any) {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/test-cases/executions/generate-many`;
    const REQUEST = params;
    _debugX(TestExecutionsService.getClassName(), 'saveMany', { REQUEST_HEADERS, REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  deleteManyByIds(keys: any) {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/test-cases/executions/delete-many-by-ids`;
    const REQUEST = keys;
    _debugX(TestExecutionsService.getClassName(), 'deleteManyByIds', { REQUEST_HEADERS, REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  findOneById(id: any) {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/test-cases/executions/find-one-by-id`;
    const REQUEST = { id };
    _debugX(TestExecutionsService.getClassName(), 'findOneById', { REQUEST_HEADERS, REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  retrieveFormData(id: any) {
    _debugX(TestExecutionsService.getClassName(), 'retrieveFormData', { id });
    const TEST_CASES_DEFAULT_QUERY = {
      sort: {
        field: 'id',
        direction: 'asc'
      }
    };
    const TEST_WORKERS_DEFAULT_QUERY = {
      sort: {
        field: 'id',
        direction: 'asc'
      }
    };
    const FORK_JOIN: any = {
      testCases: this.testCasesService.findManyByQuery(TEST_CASES_DEFAULT_QUERY),
      workers: this.testWorkersService.findManyLiteByQuery(TEST_WORKERS_DEFAULT_QUERY),
    };
    if (
      lodash.isEmpty(id)
    ) {
      FORK_JOIN.execution = of(undefined);
    } else {
      FORK_JOIN.execution = this.findOneById(id);
    }
    const RET_VAL: any = forkJoin(FORK_JOIN);
    return RET_VAL;
  }
}
