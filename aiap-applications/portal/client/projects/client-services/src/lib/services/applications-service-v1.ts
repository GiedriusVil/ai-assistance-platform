/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';

import * as ramda from 'ramda';

import {
  _debugX,
  convertArrayToQueryParamsString,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BrowserServiceV1,
  EnvironmentServiceV1,
  BaseServiceV1,
} from 'client-shared-services';

@Injectable()
export class ApplicationsServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'ApplicationsServiceV1';
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
    const REQUEST_URL = `${this._hostAndBasePath()}/applications/find-many-by-query`;
    const REQUEST = {
      query,
    };
    const RET_VAL = this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
    return RET_VAL;
  }

  saveOne(application: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/applications/save-one`;
    const RET_VAL = this.httpClient.post(REQUEST_URL, application, this.getAuthHeaders());
    return RET_VAL;
  }

  deleteManyByIds(applicationIds: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/applications/delete-many-by-ids`;
    const REQUEST_BODY = {
      ids: applicationIds
    };
    const RET_VAL = this.httpClient.post(REQUEST_URL, REQUEST_BODY, this.getAuthHeaders());
    return RET_VAL;
  }

  findOneById(configId: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/applications/find-one-by-id`;
    const REQUEST = {
      id: configId
    };
    const RET_VAL = this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
    return RET_VAL;
  }

  retrieveApplicationFormData(id: any) {
    const RET_VAL = forkJoin({
      application: this.findOneById(id)
    });
    return RET_VAL;
  }

  exportMany(query: any, ids: string[]) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);
    const IDS_QUERY_PARAM = convertArrayToQueryParamsString('ids', ids);

    const REQUEST_URL = `${this._hostUrl()}api/v1/app-export/applications?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` // 
      + `field=${SORT_FIELD}&` // 
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}&` //
      + IDS_QUERY_PARAM;

    _debugX(ApplicationsServiceV1.getClassName(), 'exportMany',
      {
        REQUEST_URL,
      });

    this.browserService.openInNewTab(REQUEST_URL);
  }

  importFromFile(file: File) {
    const REQUEST_URL = `${this._hostUrl()}api/v1/app-import/applications`;
    const REQUEST_BODY: FormData = new FormData();
    REQUEST_BODY.append('file', file, file.name);

    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(ApplicationsServiceV1.getClassName(), 'importFromFile',
      {
        REQUEST_URL,
        REQUEST_BODY,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.httpClient.post(REQUEST_URL, REQUEST_BODY, REQUEST_OPTIONS);
    return RET_VAL;
  }

}
