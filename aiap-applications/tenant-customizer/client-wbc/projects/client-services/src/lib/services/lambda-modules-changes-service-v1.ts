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
  UtilsServiceV1,
} from 'client-shared-services';

@Injectable()
export class LambdaModulesChangesServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'LambdaModulesChangesServiceV1';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private http: HttpClient,
    private utilsService: UtilsServiceV1,
  ) {
    super(environmentService, sessionService);
  }


  findManyByQuery(query: any) {
    const QUERY = lodash.cloneDeep(query);

    _debugX(LambdaModulesChangesServiceV1.getClassName(), 'findManyByQuery', { QUERY });
    const REQUEST_URL = `${this._hostUrl()}/api/v1/auditor/lambda-modules/find-many-by-query`;
    const REQUEST = {
      ...QUERY
    };
    return this.http.post(REQUEST_URL, REQUEST, this._requestOptions());
  }

}
