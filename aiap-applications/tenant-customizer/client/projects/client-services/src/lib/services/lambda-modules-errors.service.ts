/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

@Injectable()
export class LambdaModulesErrorsService extends BaseServiceV1 {

  static getClassName() {
    return 'LambdaModulesErrorsService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private http: HttpClient,
  ) {
    super(environmentService, sessionService);
  }


  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/auditor/lambda-modules-errors/find-many-by-query`;
    const REQUEST = {
      ...query
    };
    return this.http.post(REQUEST_URL, REQUEST, this._requestOptions());
  }

}
