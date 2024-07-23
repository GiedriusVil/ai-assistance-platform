/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
export class AiServicesChangesServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'AiServicesChangesServiceV1';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private http: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._host()}/api/v1/ai/services/changes`;
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const QUERY = lodash.cloneDeep(query);

    _debugX(AiServicesChangesServiceV1.getClassName(), 'findManyByQuery', { QUERY });
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = {
      query: QUERY
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

}
