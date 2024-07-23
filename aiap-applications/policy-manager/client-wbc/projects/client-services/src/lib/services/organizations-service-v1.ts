/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
  BrowserServiceV1,
} from 'client-shared-services';

@Injectable()
export class OrganizationsServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'OrganizationsServiceV1';
  }

  constructor(
    // params-super
    protected browserService: BrowserServiceV1,
    protected environmentService: EnvironmentServiceV1,
    // params-native
    protected sessionService: SessionServiceV1,
    private httpClient: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._hostUrl()}/api/organizations`;
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = {
      ...query
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  findManyLiteByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-lite-by-query`;
    const REQUEST = {
      ...query
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  saveOne(organization: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    const REQUEST = {
      ...organization
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  deleteOneById(id: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-one-by-id`;
    const REQUEST = {
      id: id
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  deleteManyByIds(ids: any[]) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    return this.httpClient.post(REQUEST_URL, ids, this.getAuthHeaders());
  }

  pull() {
    const REQUEST_URL = `${this._hostAndBasePath()}/pull`;
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, {}, REQUEST_OPTIONS);
  }

  export(params) {
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
