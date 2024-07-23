/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, of } from 'rxjs';

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
export class AiTranslationModelsServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'AiTranslationModelsServiceV1';
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
    const RET_VAL = `${this._hostUrl()}/api/v1/translation/models`;
    return RET_VAL;
  }

  _hostAndBaseExportPath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/translation/export/models`;
    return RET_VAL;
  }

  _hostAndBaseImportPath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/translation/import/models`;
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

  findOneByQuery(query: any, options: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-query`;
    const REQUEST = { query, options };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTranslationModelsServiceV1.getClassName(), 'findOneByQuery', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = { query };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTranslationModelsServiceV1.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  saveOne(aiTranslationModel: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    const REQUEST = { aiTranslationModel };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTranslationModelsServiceV1.getClassName(), 'saveOne', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  deleteManyByIds(ids: Array<any>) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = { ids };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTranslationModelsServiceV1.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  deleteManyByServiceModelIds(aiTranslationServiceId: string, ids: Array<any>) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-service-model-ids`;
    const REQUEST = { aiTranslationServiceId, ids };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTranslationModelsServiceV1.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  testOneByServiceModelId(aiTranslationServiceId: string, aiTranslationModelId: string, text: string) {
    const REQUEST_URL = `${this._hostAndBasePath()}/test-one-by-service-model-id`;
    const REQUEST = { aiTranslationServiceId, aiTranslationModelId, text };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTranslationModelsServiceV1.getClassName(), 'testOneByServiceModelId', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  exportMany(query: any) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);
    const AI_TRANSLATION_SERVICE_ID = query?.aiTranslationServiceId;

    const REQUEST_URL = `${this._hostAndBaseExportPath()}?` //
      + `ai_translation_service_id=${AI_TRANSLATION_SERVICE_ID}&`
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` // 
      + `field=${SORT_FIELD}&` // 
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}`;

    _debugX(AiTranslationModelsServiceV1.getClassName(), 'exportMany', { REQUEST_URL });

    this.browserService.openInNewTab(REQUEST_URL);
  }

  importManyFromFile(file: File, params: any) {
    const REQUEST_URL = `${this._hostAndBaseImportPath()}`;
    const AI_TRANSLATION_SERVICE_ID = params?.aiTranslationServiceId;
    const REQUEST: FormData = new FormData();
    REQUEST.append('aiTranslationModelsFile', file, file.name);
    REQUEST.append('aiTranslationServiceId', AI_TRANSLATION_SERVICE_ID);
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTranslationModelsServiceV1.getClassName(), 'importManyFromFile', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  loadAiTranslationModelFormData() {
    const MODEL_TYPES = {
      WLT: [
        {
          content: 'Forced Glossary',
          value: 'forcedGlossary'
        },
        {
          content: 'Parallel Corpus',
          value: 'parallelCorpus'
        },
      ]
    };
    const FORK_JOIN_SOURCES: any = {
      supportedLanguages: this.findSupportedLanguages(),
      modelTypes: of(MODEL_TYPES),
    };
    const RET_VAL = forkJoin(FORK_JOIN_SOURCES);
    return RET_VAL;
  };

  findSupportedLanguages() {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-supported-languages`;
    const REQUEST_OPTIONS = this._requestOptions();
    const REQUEST = {};
    _debugX(AiTranslationModelsServiceV1.getClassName(), 'loadAiTranslationModelFormData', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  trainOneById(aiTranslationServiceId: string, aiTranslationModelId: string) {
    const REQUEST_URL = `${this._hostAndBasePath()}/train-one-by-service-model-id`;
    const REQUEST = { aiTranslationServiceId, aiTranslationModelId };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTranslationModelsServiceV1.getClassName(), 'trainOne', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  idenfityLanguageById(aiTranslationServiceId: string, text: string) {
    const REQUEST_URL = `${this._hostAndBasePath()}/identify-language-by-id`;
    const REQUEST = { aiTranslationServiceId, text };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTranslationModelsServiceV1.getClassName(), 'idenfityLanguageById', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }
}
