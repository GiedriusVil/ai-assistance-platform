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
} from 'client-shared-services';

@Injectable()
export class OrganizationsImportServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'OrganizationsImportServiceV1';
  }

  constructor(
    // params-super
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    // params-native
    private httpClient: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    let retVal = `${this._hostUrl()}/api/import/organizations/`;
    return retVal;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}find-many-by-query`;
    const REQUEST = {
      ...query
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  saveOne(organization: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}save-one`;
    const REQUEST = {
      organization
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  deleteManyByIds(ids: any[]) {
    const REQUEST_URL = `${this._hostAndBasePath()}delete-many-by-ids`;
    return this.httpClient.post(REQUEST_URL, ids, this.getAuthHeaders());
  }

  uploadFile(file: File) {
    const REQUEST_URL = `${this._hostAndBasePath()}upload`;
    const formData: FormData = new FormData();
    formData.append('organizationsFile', file, file.name);
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, formData, REQUEST_OPTIONS);
  }

  submitImport() {
    const REQUEST_URL = `${this._hostAndBasePath()}submit`;
    const REQUEST = {};
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  clearImport() {
    const REQUEST_URL = `${this._hostAndBasePath()}clear-import`;
    const REQUEST = {};
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }
}
