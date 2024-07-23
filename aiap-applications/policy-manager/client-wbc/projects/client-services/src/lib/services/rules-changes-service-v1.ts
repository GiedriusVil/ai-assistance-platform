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
export class RulesChangesServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'RulesChangesServiceV1';
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

    _debugX(RulesChangesServiceV1.getClassName(), 'findManyByQuery', { QUERY });
    const REQUEST_URL = `${this._hostUrl()}/api/v1/auditor/rules/find-many-by-query`;
    const REQUEST = {
      ...QUERY
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

}
