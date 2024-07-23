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
  UtilsServiceV1,
  EnvironmentServiceV1,
  BaseServiceV1,
} from 'client-shared-services';

@Injectable()
export class ConnectionsServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'ConnectionsServiceV1';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private utilsService: UtilsServiceV1,
    private http: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  testMongoConnection(configuration: any) {
    const REQUEST_URL = `${this._hostUrl()}api/v1/app/connections/mongo/test`;
    const REQUEST_BODY = { configuration };
    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(ConnectionsServiceV1.getClassName(), 'testMongoConnection',
      {
        REQUEST_URL,
        REQUEST_BODY,
        REQUEST_OPTIONS,
      });

    return this.http.post(REQUEST_URL, REQUEST_BODY, REQUEST_OPTIONS);
  }

  testRedisConnection(configuration: any) {
    const REQUEST_URL = `${this._hostUrl()}api/v1/app/connections/redis/test`;
    const REQUEST_BODY = { configuration };
    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(ConnectionsServiceV1.getClassName(), 'testRedisConnection',
      {
        REQUEST_URL,
        REQUEST_BODY,
        REQUEST_OPTIONS,
      });

    return this.http.post(REQUEST_URL, REQUEST_BODY, REQUEST_OPTIONS);
  }
}
