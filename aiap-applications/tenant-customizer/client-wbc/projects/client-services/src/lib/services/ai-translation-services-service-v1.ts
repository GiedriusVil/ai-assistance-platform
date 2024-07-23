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
export class AiTranslationServicesServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'AiTranslationServicesServiceV1';
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
    const RET_VAL = `${this._hostUrl()}/api/v1/translation/services`;
    return RET_VAL;
  }

  _hostAndBaseExportPath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/translation/export/services`;
    return RET_VAL;
  }

  _hostAndBaseImportPath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/translation/import/services`;
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
    _debugX(AiTranslationServicesServiceV1.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  saveOne(aiTranslationService: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    const REQUEST = { aiTranslationService };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTranslationServicesServiceV1.getClassName(), 'saveOne', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  deleteManyByIds(ids: Array<any>) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = { ids };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTranslationServicesServiceV1.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  exportMany(query: any) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);

    const REQUEST_URL = `${this._hostAndBaseExportPath()}?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` // 
      + `field=${SORT_FIELD}&` // 
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}`;

    _debugX(AiTranslationServicesServiceV1.getClassName(), 'exportMany', { REQUEST_URL });

    this.browserService.openInNewTab(REQUEST_URL);
  }

  importManyFromFile(file: File) {
    const REQUEST_URL = `${this._hostAndBaseImportPath()}`;
    const REQUEST: FormData = new FormData();
    REQUEST.append('aiTranslationServicesFile', file, file.name);
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTranslationServicesServiceV1.getClassName(), 'importManyFromFile', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  loadAiTranslationServiceFormData() {
    const TYPES = [
      {
        name: 'Watson Language Translator',
        value: 'WLT',
      },
      {
        name: 'WatsonX',
        value: 'WATSONX',
      },
    ];
    const AUTH_TYPES = [
      {
        type: 'basic',
        name: 'Basic',
      },
      {
        type: 'iam',
        name: 'IAM',
      },
    ];
    const FORK_JOIN_SOURCES: any = {
      types: of(TYPES),
      authTypes: of(AUTH_TYPES),
    };
    const RET_VAL = forkJoin(FORK_JOIN_SOURCES);
    return RET_VAL;
  }


}
