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
  BrowserServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

@Injectable()
export class AiTranslationModelExamplesServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'AiTranslationModelExamplesServiceV1';
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
    const RET_VAL = `${this._hostUrl()}/api/v1/translation/examples`;
    return RET_VAL;
  }

  _hostAndBaseExportPath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/translation/export/examples`;
    return RET_VAL;
  }

  _hostAndBaseImportPath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/translation/import/examples`;
    return RET_VAL;
  }

  getAiTranslationServices() {
    const QUERY = {
      filter: {},
      sort: {
        field: 'id',
        direction: 'desc'
      },
      pagination: {
        page: 1,
        size: 10,
      }
    }
    return this.findManyByQuery(QUERY);
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = { query };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTranslationModelExamplesServiceV1.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  saveOne(aiTranslationModelExample: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    const REQUEST = { aiTranslationModelExample };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTranslationModelExamplesServiceV1.getClassName(), 'saveOne', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  saveMany(aiTranslationModelExamples: any[]) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-many`;
    const REQUEST = { aiTranslationModelExamples };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTranslationModelExamplesServiceV1.getClassName(), 'saveMany', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  deleteManyByIds(ids: Array<any>) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = { ids };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTranslationModelExamplesServiceV1.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  exportMany(query: any) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);
    const AI_TRANSLATION_MODEL_ID = query?.aiTranslationModelId;

    const REQUEST_URL = `${this._hostAndBaseExportPath()}?` //
      + `ai_translation_model_id=${AI_TRANSLATION_MODEL_ID}&`
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` // 
      + `field=${SORT_FIELD}&` // 
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}`;

    _debugX(AiTranslationModelExamplesServiceV1.getClassName(), 'exportMany', { REQUEST_URL });

    this.browserService.openInNewTab(REQUEST_URL);
  }

  importManyFromFile(file: File, params: any) {
    const REQUEST_URL = `${this._hostAndBaseImportPath()}`;
    const REQUEST: FormData = new FormData();
    const AI_TRANSLATION_MODEL_ID = params?.aiTranslationModelId;
    const AI_TRANSLATION_SERVICE_ID = params?.aiTranslationServiceId;
    REQUEST.append('aiTranslationModelExamples', file, file.name);
    REQUEST.append('aiTranslationModelId', AI_TRANSLATION_MODEL_ID);
    REQUEST.append('aiTranslationServiceId', AI_TRANSLATION_SERVICE_ID);
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTranslationModelExamplesServiceV1.getClassName(), 'importManyFromFile', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }
}
