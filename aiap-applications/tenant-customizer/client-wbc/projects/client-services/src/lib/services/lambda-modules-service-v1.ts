/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  decodeAttributeWithBase64,
  encodeAttributeWithBase64,
  convertArrayToQueryParamsString
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BrowserServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

import {
  LambdaModulesConfigurationsServiceV1,
} from '.';

@Injectable()
export class LambdaModulesServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'LambdaModulesServiceV1';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private httpClient: HttpClient,
    private browserService: BrowserServiceV1,
    private lambdaModulesConfigurationsService: LambdaModulesConfigurationsServiceV1,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/lambda-modules`;
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = {
      ...query
    };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(LambdaModulesServiceV1.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  saveOne(value: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    encodeAttributeWithBase64(value, 'code');
    const REQUEST = { value };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(LambdaModulesServiceV1.getClassName(), 'saveOne', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  deleteOneById(params: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-one-by-id`;
    const REQUEST = {
      ...params
    };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(LambdaModulesServiceV1.getClassName(), 'deleteOneById', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  deleteManyByIds(ids: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = { ids };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(LambdaModulesServiceV1.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    return this.httpClient.post(REQUEST_URL, REQUEST, this._requestOptions());
  }

  pull() {
    const REQUEST_URL = `${this._hostAndBasePath()}/pull`;
    const REQUEST = {};
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(LambdaModulesServiceV1.getClassName(), 'pull', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  findOneById(id: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-id`;
    const REQUEST = {
      id: id
    };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(LambdaModulesServiceV1.getClassName(), 'findOneById', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS).pipe(
      map((module: any) => {
        decodeAttributeWithBase64(module, 'code')
        return module;
      })
    );
    return RET_VAL;
  }

  retrieveModuleFormData(id: any) {
    const FORK_JOIN: any = {
      configurations: this.lambdaModulesConfigurationsService.loadConfigurationsDropdownData(),
    };
    if (
      lodash.isEmpty(id)
    ) {
      FORK_JOIN.module = of(undefined);
    } else {
      FORK_JOIN.module = this.findOneById(id)
    }
    const RET_VAL = forkJoin(FORK_JOIN);
    return RET_VAL;
  }

  refresh(module: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/refresh`;
    const REQUEST = {
      ...module
    };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(LambdaModulesServiceV1.getClassName(), 'refresh', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  exportOne(moduleId: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/export/modules/${moduleId}/module?token=${this._token()}`;
    this.browserService.openInNewTab(REQUEST_URL);
  }

  exportMany(query: any, ids: string[]) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);
    const IDS_QUERY_PARAM = convertArrayToQueryParamsString('ids', ids);

    const REQUEST_URL = `${this._hostAndBasePath()}/export/modules?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` // 
      + `field=${SORT_FIELD}&` // 
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}&` //
      + IDS_QUERY_PARAM;

    this.browserService.openInNewTab(REQUEST_URL);
  }

  importFromFile(file: File) {
    const REQUEST: FormData = new FormData();
    REQUEST.append('lambdaModulesFile', file, file.name);
    const REQUEST_URL = `${this._hostAndBasePath()}/import/modules`;
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(LambdaModulesServiceV1.getClassName(), 'importFromFile', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }


  compileOne(module) {
    const REQUEST_URL = `${this._hostAndBasePath()}/compile-one`;
    encodeAttributeWithBase64(module, 'code');
    const REQUEST = {
      ...module
    };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(LambdaModulesServiceV1.getClassName(), 'compileOne', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

}
