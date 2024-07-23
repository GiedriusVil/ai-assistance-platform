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

@Injectable({
  providedIn: 'root',
})
export class AiSearchAndAnalysisServicesServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'AiSearchAndAnalysisServicesServiceV1';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private http: HttpClient,
    private browserService: BrowserServiceV1,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/search-and-analysis/services`;
    return RET_VAL;
  }

  _hostAndBaseExportPath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/search-and-analysis/export/services`;
    return RET_VAL;
  }

  _hostAndBaseImportPath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/search-and-analysis/import/services`;
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = { query };
    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(AiSearchAndAnalysisServicesServiceV1.getClassName(), 'findManyByQuery',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });

    const RET_VAL = this.http.post(
      REQUEST_URL,
      REQUEST,
      REQUEST_OPTIONS,
    );
    return RET_VAL;
  }

  saveOne(aiSearchAndAnalysisService: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    const REQUEST = { aiSearchAndAnalysisService };
    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(AiSearchAndAnalysisServicesServiceV1.getClassName(), 'saveOne', {
      REQUEST_URL,
      REQUEST,
      REQUEST_OPTIONS,
    });

    const RET_VAL = this.http.post(
      REQUEST_URL,
      REQUEST,
      REQUEST_OPTIONS,
    );
    return RET_VAL;
  }

  deleteManyByIds(ids: Array<any>) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = { ids };
    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(AiSearchAndAnalysisServicesServiceV1.getClassName(), 'deleteManyByIds',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.post(
      REQUEST_URL,
      REQUEST,
      REQUEST_OPTIONS,
    );
    return RET_VAL;
  }

  exportMany(query: any) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = query?.sort?.field;
    const SORT_DIRECTION = query?.sort?.direction;

    const REQUEST_URL = `${this._hostAndBaseExportPath()}?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` // 
      + `field=${SORT_FIELD}&` // 
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}`;

    _debugX(AiSearchAndAnalysisServicesServiceV1.getClassName(), 'exportMany',
      {
        REQUEST_URL,
      });

    this.browserService.openInNewTab(REQUEST_URL);
  }

  importManyFromFile(file: File) {
    const REQUEST_URL = `${this._hostAndBaseImportPath()}`;
    const REQUEST: FormData = new FormData();
    REQUEST.append('aiSearchAndAnalysisServicesFile', file, file.name);
    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(AiSearchAndAnalysisServicesServiceV1.getClassName(), 'importManyFromFile',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.post(
      REQUEST_URL,
      REQUEST,
      REQUEST_OPTIONS,
    );
    return RET_VAL;
  }

}
