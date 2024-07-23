/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BrowserServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

@Injectable()
export class ApplicationsChangesServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'ApplicationsChangesServiceV1';
  }

  constructor(
    protected browserService: BrowserServiceV1,
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private httpClient: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._hostUrl()}api/v1/app`;
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/applications/changes/find-many-by-query`;
    const REQUEST = {
      query,
    };
    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(ApplicationsChangesServiceV1.getClassName(), 'findManyByQuery',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.httpClient.post(
      REQUEST_URL,
      REQUEST,
      REQUEST_OPTIONS,
    );
    return RET_VAL;
  }

}
