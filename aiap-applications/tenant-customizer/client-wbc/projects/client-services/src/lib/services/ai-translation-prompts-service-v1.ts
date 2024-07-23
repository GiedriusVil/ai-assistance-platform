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
export class AiTranslationPromptsServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'AiTranslationPromptsServiceV1';
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
    const RET_VAL = `${this._hostUrl()}/api/v1/translation/prompts`;
    return RET_VAL;
  }

  _hostAndBaseExportPath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/translation/export/prompts`;
    return RET_VAL;
  }

  _hostAndBaseImportPath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/translation/import/prompts`;
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

  findOneById(id: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-id`;
    const REQUEST = { aiTranslationPromptId: id };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTranslationPromptsServiceV1.getClassName(), 'findOneById', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = { query };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTranslationPromptsServiceV1.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  saveOne(aiTranslationPrompt: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    const REQUEST = { aiTranslationPrompt };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTranslationPromptsServiceV1.getClassName(), 'saveOne', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  deleteManyByIds(ids: Array<any>) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = { ids };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTranslationPromptsServiceV1.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  deleteManyByServicePromptIds(aiTranslationServiceId: string, ids: Array<any>) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-service-prompt-ids`;
    const REQUEST = { aiTranslationServiceId, ids };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTranslationPromptsServiceV1.getClassName(), 'deleteManyByServicePromptIds', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  testOneByPromptId(aiTranslationServiceId: string, aiTranslationPromptId: string, text: string) {
    const REQUEST_URL = `${this._hostAndBasePath()}/test-one-by-prompt-id`;
    const REQUEST = { aiTranslationServiceId, aiTranslationPromptId, text };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTranslationPromptsServiceV1.getClassName(), 'testOneByPromptId', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
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

    _debugX(AiTranslationPromptsServiceV1.getClassName(), 'exportMany', { REQUEST_URL });

    this.browserService.openInNewTab(REQUEST_URL);
  }

  importManyFromFile(file: File, params: any) {
    const REQUEST_URL = `${this._hostAndBaseImportPath()}`;
    const AI_TRANSLATION_SERVICE_ID = params?.aiTranslationServiceId;
    const REQUEST: FormData = new FormData();
    REQUEST.append('aiTranslationPromptsFile', file, file.name);
    REQUEST.append('aiTranslationServiceId', AI_TRANSLATION_SERVICE_ID);
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTranslationPromptsServiceV1.getClassName(), 'importManyFromFile', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  loadAiTranslationPromptFormData() {
    const PROMPT_TYPES = {
      WATSONX: [
        {
          content: 'Deployment',
          value: 'deployment'
        },
        {
          content: 'Project',
          value: 'project'
        },
      ]
    };
    const FORK_JOIN_SOURCES: any = {
      supportedLanguages: this.findSupportedLanguages(),
      promptTypes: of(PROMPT_TYPES),
    };
    const RET_VAL = forkJoin(FORK_JOIN_SOURCES);
    return RET_VAL;
  };

  findSupportedLanguages() {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-supported-languages`;
    const REQUEST_OPTIONS = this._requestOptions();
    const REQUEST = {};
    _debugX(AiTranslationPromptsServiceV1.getClassName(), 'findSupportedLanguages', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }
}
