/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';

import * as ramda from 'ramda';

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
export class LambdaModulesConfigurationsServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'LambdaModulesConfigurationsServiceV1';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private httpClient: HttpClient,
    private browserService: BrowserServiceV1,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/lambda-modules`;
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/configurations/find-many-by-query`;
    const REQUEST_BODY = {
      ...query
    };
    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(LambdaModulesConfigurationsServiceV1.getClassName(), 'deleteManyByIds', {
      REQUEST_URL,
      REQUEST_BODY,
      REQUEST_OPTIONS,
    });

    return this.httpClient.post(REQUEST_URL, REQUEST_BODY, REQUEST_OPTIONS);
  }

  saveOne(value: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/configurations/save-one`;
    const REQUEST_BODY = { value };
    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(LambdaModulesConfigurationsServiceV1.getClassName(), 'deleteManyByIds', {
      REQUEST_URL,
      REQUEST_BODY,
      REQUEST_OPTIONS,
    });

    return this.httpClient.post(REQUEST_URL, REQUEST_BODY, REQUEST_OPTIONS);
  }

  deleteManyByIds(params: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/configurations/delete-many-by-ids`;
    const REQUEST_BODY = params;
    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(LambdaModulesConfigurationsServiceV1.getClassName(), 'deleteManyByIds', {
      REQUEST_URL,
      REQUEST_BODY,
      REQUEST_OPTIONS,
    });

    return this.httpClient.post(REQUEST_URL, REQUEST_BODY, REQUEST_OPTIONS);
  }

  findOneById(configId: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/configurations/find-one-by-id`;
    const REQUEST_BODY = {
      id: configId
    };
    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(LambdaModulesConfigurationsServiceV1.getClassName(), 'deleteManyByIds', {
      REQUEST_URL,
      REQUEST_BODY,
      REQUEST_OPTIONS,
    });

    return this.httpClient.post(REQUEST_URL, REQUEST_BODY, REQUEST_OPTIONS);
  }

  retrieveModuleConfigFormData(id: any) {
    const RET_VAL = forkJoin({
      config: this.findOneById(id)
    });
    return RET_VAL;
  }

  loadConfigurationsDropdownData(): Observable<any> {
    const ACCESS_GROUP_QUERY = {
      filter: {},
      sort: {
        field: 'key',
        direction: 'desc'
      },
      pagination: {
        page: 1,
        size: 1000,
      }
    };
    const SOURCES: any = {};
    SOURCES.keys = this.findManyByQuery(ACCESS_GROUP_QUERY);
    const RET_VAL = forkJoin(SOURCES);
    return RET_VAL;
  }

  exportMany(query: any) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);

    const REQUEST_URL = `${this._hostAndBasePath()}/export/configurations?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` // 
      + `field=${SORT_FIELD}&` // 
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}`;

    _debugX(LambdaModulesConfigurationsServiceV1.getClassName(), 'exportMany', { REQUEST_URL });
    this.browserService.openInNewTab(REQUEST_URL);
  }

  importFromFile(file: File) {
    const REQUEST_URL = `${this._hostAndBasePath()}/import/configurations`;
    const REQUEST: FormData = new FormData();
    REQUEST.append('moduleConfigFile', file, file.name);
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(LambdaModulesConfigurationsServiceV1.getClassName(), 'importFromFile', {
      REQUEST_URL,
      REQUEST,
      REQUEST_OPTIONS
    });
    const RET_VAL = this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

}
