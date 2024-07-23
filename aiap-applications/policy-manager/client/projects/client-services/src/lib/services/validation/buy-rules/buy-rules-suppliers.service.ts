/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { _debugX } from 'client-shared-utils';

import { SessionServiceV1, EnvironmentServiceV1, BaseServiceV1 } from 'client-shared-services';

import {
  BuyRulesExternalSuppliersService,
} from '.'

@Injectable()
export class BuyRulesSuppliersService extends BaseServiceV1 {

  static getClassName() {
    return 'BuyRulesSuppliersService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    protected buyRulesExternalSuppliersService: BuyRulesExternalSuppliersService,
    private httpClient: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._host()}/api/v1/buy-rules-suppliers`;
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = {
      ...query
    };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(BuyRulesSuppliersService.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  findOneById(id: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-id`;
    const REQUEST = { id };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(BuyRulesSuppliersService.getClassName(), 'findOneById', { REQUEST_URL, REQUEST, REQUEST_HEADERS });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  loadSaveModalData(id: any) {
    _debugX(BuyRulesSuppliersService.getClassName(), 'loadSaveModalData', { id });
    const FORK_JOIN: any = {};
    if (
      !lodash.isEmpty(id)
    ) {
      FORK_JOIN.value = this.findOneById(id);
    } else {
      FORK_JOIN.value = of(undefined);
    }
    return forkJoin(FORK_JOIN);
  }

  saveOne(value: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    const REQUEST = { value };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(BuyRulesSuppliersService.getClassName(), 'saveOne', { REQUEST_URL, REQUEST, REQUEST_HEADERS });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  deleteManyByIds(ids: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = { ids };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(BuyRulesSuppliersService.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST, REQUEST_HEADERS });

    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  export(params: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/export`;
    return this.httpClient.post(REQUEST_URL, params, {
      headers: {
        ['Authorization']: `Bearer ${this._token()}`,
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      },
      responseType: "blob",
    });
  }
}
