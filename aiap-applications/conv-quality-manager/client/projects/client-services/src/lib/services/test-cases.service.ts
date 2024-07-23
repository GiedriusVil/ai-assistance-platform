/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of, map } from 'rxjs';
import { Buffer } from 'buffer';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BrowserServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

import {
  encodeScriptWithBase64,
} from 'client-utils'

import {
  TestWorkersService,
} from '.';

@Injectable()
export class TestCasesService extends BaseServiceV1 {

  static getClassName() {
    return 'TestCasesService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private httpClient: HttpClient,
    private testWorkersService: TestWorkersService,
    private browserService: BrowserServiceV1,
  ) {
    super(environmentService, sessionService);
  }

  findManyByQuery(query: any) {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/test-cases/find-many-by-query`;
    const REQUEST = { ...query };
    _debugX(TestCasesService.getClassName(), 'findManyByQuery', { REQUEST_HEADERS, REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  saveOne(instance: any) {
    encodeScriptWithBase64(instance);
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/test-cases/save-one`;
    const REQUEST = {
      ...instance
    };
    _debugX(TestCasesService.getClassName(), 'saveOne', { REQUEST_HEADERS, REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  deleteManyByIds(keys: any) {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/test-cases/delete-many-by-ids`;
    const REQUEST = keys;
    _debugX(TestCasesService.getClassName(), 'deleteManyByIds', { REQUEST_HEADERS, REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  findOneById(id: any) {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/test-cases/find-one-by-id`;
    const REQUEST = { id };
    _debugX(TestCasesService.getClassName(), 'findOneById', { REQUEST_HEADERS, REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }



  exportMany(query: any) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);

    const REQUEST_URL = `${this._hostUrl()}/api/v1/test-cases-export?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` // 
      + `field=${SORT_FIELD}&` // 
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}`;

    this.browserService.openInNewTab(REQUEST_URL);
  }

  importFromFile(file: File) {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST: FormData = new FormData();
    REQUEST.append('testCasesFile', file, file.name);
    const REQUEST_URL = `${this._hostUrl()}/api/v1/test-cases-import`;
    _debugX(TestCasesService.getClassName(), 'importFromFile', { REQUEST_HEADERS, REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  retrieveFormData(id: any) {
    _debugX(TestCasesService.getClassName(), 'retrieveFormData', { id });
    const DEFAULT_FIND_WORKERS_QUERY = {
      sort: {
        field: 'id',
        direction: 'asc',
      }
    };
    const FORK_JOIN: any = {
      workers: this.testWorkersService.findManyLiteByQuery(DEFAULT_FIND_WORKERS_QUERY),
    };
    if (
      lodash.isEmpty(id)
    ) {
      FORK_JOIN.testCase = of(undefined);
    } else {
      FORK_JOIN.testCase = this.findOneById(id);
    }
    const RET_VAL = forkJoin(FORK_JOIN);
    return RET_VAL;
  }
}
