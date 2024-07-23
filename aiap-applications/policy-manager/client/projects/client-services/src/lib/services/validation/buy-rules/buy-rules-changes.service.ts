/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { forkJoin, of } from 'rxjs';

import * as ramda from 'ramda';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EnvironmentServiceV1,
  BaseServiceV1,
} from 'client-shared-services';

import {
  BUY_RULES_CHANGES_DOC_TYPE_FILTER_OPTIONS,
} from '../../../utils/validation';

@Injectable()
export class BuyRulesChangesService extends BaseServiceV1 {

  static getClassName() {
    return 'BuyRulesChangesService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private httpClient: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._host()}/api/v1/buy-rules-audits`;
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = {
      ...query
    };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(BuyRulesChangesService.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  exportMany(query: any) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);

    const REQUEST_URL = `${this._hostAndBasePath()}/export-many?` //
      + `size=${PAGINATION_SIZE}&`
      + `page=${PAGINATION_PAGE}&`
      + `field=${SORT_FIELD}&`
      + `sort=${SORT_DIRECTION}&`;

    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(BuyRulesChangesService.getClassName(), 'exportMany', { REQUEST_URL, REQUEST_HEADERS });
    return this.httpClient.post(REQUEST_URL, null, {
      ...REQUEST_HEADERS,
      responseType: 'blob'
    });
  }

  loadFilterOptions() {
    const FORK_JOIN: any = {};

    // FORK_JOIN.actions = of(CHANGES_ACTION_FILTER_OPTIONS);
    FORK_JOIN.docTypes = of(BUY_RULES_CHANGES_DOC_TYPE_FILTER_OPTIONS);

    return forkJoin(FORK_JOIN);
  }
}
