/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { _debugX } from 'client-shared-utils';

import { SessionServiceV1, EnvironmentServiceV1, BaseServiceV1 } from 'client-shared-services';

@Injectable()
export class CatalogRulesService extends BaseServiceV1 {

  static getClassName() {
    return 'CatalogRulesService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private httpClient: HttpClient
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._host()}/api/v1/catalog-rules`;
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = {
      ...query
    };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(CatalogRulesService.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  findOneById(id: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-id`;
    const REQUEST = { id };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(CatalogRulesService.getClassName(), 'findOneById', { REQUEST_URL, REQUEST, REQUEST_HEADERS });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  loadSaveModalData(id: any) {
    _debugX(CatalogRulesService.getClassName(), 'loadSaveModalData', { id });
    const FORK_JOIN: any = {};
    if (
      !lodash.isEmpty(id)
    ) {
      FORK_JOIN.value = this.findOneById(id);
    } else {
      FORK_JOIN.value = of(undefined);
    }
    return forkJoin(FORK_JOIN);
  }

  saveOne(value: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    const REQUEST = { value };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(CatalogRulesService.getClassName(), 'saveOne', { REQUEST_URL, REQUEST, REQUEST_HEADERS });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  deleteManyByIds(ids: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = { ids };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(CatalogRulesService.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST, REQUEST_HEADERS });

    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  importFromFile(file: File) {
    const REQUEST_URL = `${this._hostAndBasePath()}/import-many`;
    const REQUEST: FormData = new FormData();
    const REQUEST_HEADERS = this.getAuthHeaders();
    REQUEST.append('catalogRuleFile', file, file.name);
    _debugX(CatalogRulesService.getClassName(), 'importFromFile', { REQUEST_URL, REQUEST, REQUEST_HEADERS });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  exportMany(query: any) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);

    const REQUEST_URL = `${this._hostAndBasePath()}/export-many?` //
      + `size=${PAGINATION_SIZE}&`
      + `page=${PAGINATION_PAGE}&`
      + `field=${SORT_FIELD}&`
      + `sort=${SORT_DIRECTION}&`;

    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(CatalogRulesService.getClassName(), 'exportMany', { REQUEST_URL, REQUEST_HEADERS });
    return this.httpClient.post(REQUEST_URL, null, {
      ...REQUEST_HEADERS,
      responseType: 'blob'
    });
  }
}
