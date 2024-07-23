/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BrowserServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

import {
  AiServicesServiceV1,
  AiSkillsService,
} from '.';

@Injectable()
export class ClassifierServiceV1 extends BaseServiceV1 {

  static getClassName(): string {
    return 'ClassifierServiceV1';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private http: HttpClient,
    private browserService: BrowserServiceV1,
    private aiServicesService: AiServicesServiceV1,
    private aiSkillsService: AiSkillsService,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/classifier/models`;
    return RET_VAL;
  }

  findManyByQuery(query: any) {

    const PAGINATION = ramda.path(['pagination'], query);
    const SORT = ramda.path(['sort'], query);
    const PAGINATION_SIZE = ramda.pathOr(100, ['size'], PAGINATION);
    const PAGINATION_PAGE = ramda.pathOr(1, ['page'], PAGINATION);
    const SORT_FIELD = ramda.pathOr('name', ['field'], SORT);
    const SORT_DIRECTION = ramda.pathOr('asc', ['direction'], SORT);
    const FILTER_SEARCH = ramda.path(['filter', 'search'], query);

    let params = `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` //
      + `field=${SORT_FIELD}&` //
      + `sort=${SORT_DIRECTION}`;
    if (FILTER_SEARCH) {
      params = `${params}&search=${FILTER_SEARCH}`;
    }

    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = { query };
    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(ClassifierServiceV1.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  saveOne(value: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    const REQUEST = { value };
    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(ClassifierServiceV1.getClassName(), 'saveOne', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  deleteManyByIds(ids: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = { ids };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(ClassifierServiceV1.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  findOneById(id: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-id`;
    const REQUEST = { id };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(ClassifierServiceV1.getClassName(), 'findOneById', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  trainOneById(id: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/train-one-by-id`;
    const REQUEST = { id };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(ClassifierServiceV1.getClassName(), 'trainOneById', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  testOneById(id: any, phrase: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/test-one-by-id`;
    const REQUEST = { id, phrase };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(ClassifierServiceV1.getClassName(), 'testOneById', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  retrieveModelFormData(id: any) {
    _debugX(ClassifierServiceV1.getClassName(), 'retrieveModelFormData', { id });
    const AI_SERVICES_QUERY = {
      sort: {
        field: 'name',
        direction: 'asc'
      },
      pagination: {
        page: 1,
        size: 1000,
      }
    }
    const AI_SKILLS_QUERY = {
      sort: {
        field: 'name',
        direction: 'asc'
      },
      pagination: {
        page: 1,
        size: 1000,
      }
    }

    const FORK_JOIN: any = {
      aiServices: this.aiServicesService.findManyByQuery(AI_SERVICES_QUERY),
      aiSkills: this.aiSkillsService.findManyByQuery(AI_SKILLS_QUERY),
    };
    if (
      !lodash.isEmpty(id)
    ) {
      FORK_JOIN.model = this.findOneById(id);
    }
    const RET_VAL = forkJoin(FORK_JOIN);
    return RET_VAL;
  }

  exportMany(query: any) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);

    const REQUEST_URL = `${this._hostUrl()}/api/v1/classifier-export/models?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` // 
      + `field=${SORT_FIELD}&` // 
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}`;

    _debugX(ClassifierServiceV1.getClassName(), 'exportMany', { REQUEST_URL });
    this.browserService.openInNewTab(REQUEST_URL);
  }

  importFromFile(file: File) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/classifier-import/models`;
    const REQUEST: FormData = new FormData();
    REQUEST.append('classifierModelsFile', file, file.name);
    const REQUEST_OPTIONS = this.getAuthHeaders();
    _debugX(ClassifierServiceV1.getClassName(), 'importFromFile', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

}
