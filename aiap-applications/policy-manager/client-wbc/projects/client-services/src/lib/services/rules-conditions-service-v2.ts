/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX
} from 'client-shared-utils';

import {
  BaseServiceV1,
  SessionServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

@Injectable()
export class RulesConditionsServiceV2 extends BaseServiceV1 {

  static getClassName() {
    return 'RulesConditionsServiceV2';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private httpClient: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/rules-v2/conditions`;
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = {
      ...query
    };
    _debugX(RulesConditionsServiceV2.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
  }

  findOneById(id: string) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-id`;
    const REQUEST = {
      id
    };
    _debugX(RulesConditionsServiceV2.getClassName(), 'findOneById', { REQUEST_URL, REQUEST });
    const RET_VAL = this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
    return RET_VAL;
  }

  saveOne(condition: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    const REQUEST = {
      ...condition
    };
    _debugX(RulesConditionsServiceV2.getClassName(), 'saveOne', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
  }

  deleteManyByIds(ids: string[]) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = { ids };
    _debugX(RulesConditionsServiceV2.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
  }

}
