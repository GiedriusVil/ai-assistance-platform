/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';

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
export class TestWorkersService extends BaseServiceV1 {

  static getClassName() {
    return 'TestWorkersService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private httpClient: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  findManyByQuery(query: any) {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/test-cases/workers/find-many-by-query`;
    const REQUEST_BODY = { ...query };
    _debugX(TestWorkersService.getClassName(), 'findManyByQuery', { REQUEST_HEADERS, REQUEST_URL, REQUEST_BODY });
    return this.httpClient.post(REQUEST_URL, REQUEST_BODY, REQUEST_HEADERS);
  }

  findManyLiteByQuery(query: any) {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/test-cases/workers/find-many-lite-by-query`;
    const REQUEST_BODY = { ...query };
    _debugX(TestWorkersService.getClassName(), 'findManyLiteByQuery', { REQUEST_HEADERS, REQUEST_URL, REQUEST_BODY });
    return this.httpClient.post(REQUEST_URL, REQUEST_BODY, REQUEST_HEADERS);
  }

  saveOne(worker: any) {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/test-cases/workers/save-one`;
    const REQUEST = worker;
    _debugX(TestWorkersService.getClassName(), 'saveOne', { REQUEST_URL, REQUEST_HEADERS, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  deleteManyByIds(ids: any) {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/test-cases/workers/delete-many-by-ids`;
    const REQUEST = ids;
    _debugX(TestWorkersService.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST_HEADERS, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  findOneById(id: any) {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/test-cases/workers/find-one-by-id`;
    const REQUEST = { id };

    _debugX(TestWorkersService.getClassName(), 'findOneById', { REQUEST_URL, REQUEST_HEADERS, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  retrieveFormData(id: any) {
    _debugX(TestWorkersService.getClassName(), 'retrieveFormData', { id });
    const FORK_JOIN: any = {};
    if (
      lodash.isEmpty(id)
    ) {
      FORK_JOIN.worker = of(undefined);
    } else {
      FORK_JOIN.worker = this.findOneById(id);
    }
    const RET_VAL = forkJoin(FORK_JOIN);
    return RET_VAL;
  }
}
