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
export class AiSearchAndAnalysisCollectionsServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'AiSearchAndAnalysisCollectionsServiceV1';
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
    const RET_VAL = `${this._hostUrl()}/api/v1/search-and-analysis/collections`;
    return RET_VAL;
  }

  _hostAndBaseExportPath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/search-and-analysis/export/collections`;
    return RET_VAL;
  }

  _hostAndBaseImportPath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/search-and-analysis/import/collections`;
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = { query };
    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(AiSearchAndAnalysisCollectionsServiceV1.getClassName(), 'findManyByQuery',
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

  saveOne(aiSearchAndAnalysisCollection: any, params: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    const AI_SEARCH_AND_ANALYSIS_SERVICE_ID = params?.aiSearchAndAnalysisServiceId;
    const AI_SEARCH_AND_ANALYSIS_PROJECT_ID = params?.aiSearchAndAnalysisProjectId;
    const REQUEST = {
      aiSearchAndAnalysisCollection,
      aiSearchAndAnalysisServiceId: AI_SEARCH_AND_ANALYSIS_SERVICE_ID,
      aiSearchAndAnalysisProjectId: AI_SEARCH_AND_ANALYSIS_PROJECT_ID,
    };
    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(AiSearchAndAnalysisCollectionsServiceV1.getClassName(), 'saveOne',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  deleteManyByIds(ids: Array<any>) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = { ids };
    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(AiSearchAndAnalysisCollectionsServiceV1.getClassName(), 'deleteManyByIds',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  deleteManyByServiceProjectIdAndIds(ids: Array<any>, params: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-service-project-id-and-collection-ids`;
    const AI_SEARCH_AND_ANALYSIS_SERVICE_ID = params?.aiSearchAndAnalysisServiceId;
    const AI_SEARCH_AND_ANALYSIS_PROJECT_ID = params?.aiSearchAndAnalysisProjectId;
    const REQUEST = {
      aiSearchAndAnalysisServiceId: AI_SEARCH_AND_ANALYSIS_SERVICE_ID,
      aiSearchAndAnalysisProjectId: AI_SEARCH_AND_ANALYSIS_PROJECT_ID,
      ids
    };
    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(AiSearchAndAnalysisCollectionsServiceV1.getClassName(), 'deleteManyByIds',
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

    _debugX(AiSearchAndAnalysisCollectionsServiceV1.getClassName(), 'exportMany',
      {
        REQUEST_URL,
      });

    this.browserService.openInNewTab(REQUEST_URL);
  }

  importManyFromFile(file: File, params: any) {
    const REQUEST_URL = `${this._hostAndBaseImportPath()}`;
    const REQUEST: FormData = new FormData();
    const AI_SEARCH_AND_ANALYSIS_SERVICE_ID = params?.aiSearchAndAnalysisServiceId;
    const AI_SEARCH_AND_ANALYSIS_PROJECT_ID = params?.aiSearchAndAnalysisProjectId;
    REQUEST.append('aiSearchAndAnalysisCollectionsFile', file, file.name);
    REQUEST.append('aiSearchAndAnalysisServiceId', AI_SEARCH_AND_ANALYSIS_SERVICE_ID);
    REQUEST.append('aiSearchAndAnalysisProjectId', AI_SEARCH_AND_ANALYSIS_PROJECT_ID);
    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(AiSearchAndAnalysisCollectionsServiceV1.getClassName(), 'importManyFromFile',
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

  synchronizeManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/synchronize-many-by-query`;
    const REQUEST = { query };
    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(AiSearchAndAnalysisCollectionsServiceV1.getClassName(), 'synchronizeManyByQuery',
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

  loadAiSearchAndAnalysisCollectionsFormData() {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-supported-languages`;
    const REQUEST_OPTIONS = this._requestOptions();
    const REQUEST = {};

    _debugX(AiSearchAndAnalysisCollectionsServiceV1.getClassName(), 'loadAiSearchAndAnalysisCollectionsFormData',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  queryManyByServiceProjectIdAndCollectionsIds(query: any, params: any) {
    const AI_SEARCH_AND_ANALYSIS_SERVICE_ID = params?.aiSearchAndAnalysisServiceId;
    const AI_SEARCH_AND_ANALYSIS_PROJECT_ID = params?.aiSearchAndAnalysisProjectId;
    const IDS = params?.ids;
    const REQUEST_URL = `${this._hostAndBasePath()}/query-many-by-service-project-id-and-collections-ids`;
    const REQUEST_OPTIONS = this._requestOptions();
    const REQUEST = {
      query,
      aiSearchAndAnalysisServiceId: AI_SEARCH_AND_ANALYSIS_SERVICE_ID,
      aiSearchAndAnalysisProjectId: AI_SEARCH_AND_ANALYSIS_PROJECT_ID,
      ids: IDS,
    };

    _debugX(AiSearchAndAnalysisCollectionsServiceV1.getClassName(), 'queryManyByServiceProjectIdAndCollectionsIds', {
      REQUEST_URL,
      REQUEST,
      REQUEST_OPTIONS,
      AI_SEARCH_AND_ANALYSIS_SERVICE_ID,
      AI_SEARCH_AND_ANALYSIS_PROJECT_ID,
      IDS,
      query,
    });

    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }
}
