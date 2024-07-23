/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';

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

import {
  AcaClassificationCatalog,
} from 'client-utils';

@Injectable()
export class ClassificationCatalogsServiceV1 extends BaseServiceV1 {

  static getClassName(): string {
    return 'ClassificationCategoriesServiceV1';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    protected httpClient: HttpClient,
    private browserService: BrowserServiceV1,
  ) {
    super(environmentService, sessionService);
  }

  _catalogsHostUrl() {
    const RET_VAL = `${this._hostUrl()}/api/v1/classification-catalog/catalogs`;
    return RET_VAL;
  }

  _catalogsImportHostUrl() {
    const RET_VAL = `${this._hostUrl()}/api/v1/classification-import`;
    return RET_VAL;
  }

  _catalogsExportHostUrl() {
    const RET_VAL = `${this._hostUrl()}/api/v1/classification-export`;
    return RET_VAL;
  }

  findAllByQuery(query): Observable<any> {
    _debugX(ClassificationCatalogsServiceV1.getClassName(), 'findAllByQuery', { query });

    const PAGINATION = ramda.path(['pagination'], query);
    const SORT = ramda.path(['sort'], query);

    const PAGINATION_SIZE = ramda.pathOr(100, ['size'], PAGINATION);
    const PAGINATION_PAGE = ramda.pathOr(1, ['page'], PAGINATION);

    const SORT_FIELD = ramda.pathOr('name', ['field'], SORT);
    const SORT_DIRECTION = ramda.pathOr('asc', ['direction'], SORT);

    const FILTER_SEARCH = ramda.path(['filter', 'search'], query);

    let url = `${this._catalogsHostUrl()}?`//
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` //
      + `field=${SORT_FIELD}&` //
      + `sort=${SORT_DIRECTION}`;

    if (FILTER_SEARCH) {
      url = `${url}&search=${FILTER_SEARCH}`;
    }

    let response = this.httpClient.get(url, this.getAuthHeaders());
    return response;
  }

  findOneById(id: any) {
    const REQUEST_URL = `${this._catalogsHostUrl()}/${id}`;
    _debugX(ClassificationCatalogsServiceV1.getClassName(), 'findOneById', { REQUEST_URL, id });
    return this.httpClient.get(REQUEST_URL, this.getAuthHeaders());
  }

  save(instance: AcaClassificationCatalog) {
    _debugX(ClassificationCatalogsServiceV1.getClassName(), 'save', { instance });
    return this.httpClient.post(this._catalogsHostUrl(), instance, this.getAuthHeaders());
  }

  deleteManyByIds(ids: Array<any>) {
    const REQUEST_URL = `${this._catalogsHostUrl()}/delete-many-by-ids`;
    _debugX(ClassificationCatalogsServiceV1.getClassName(), 'deleteManyByIds', { REQUEST_URL, ids });
    return this.httpClient.post(REQUEST_URL, ids, this.getAuthHeaders());
  }

  importOneByFile(catalogId: any, file: File) {
    const REQUEST_URL = `${this._catalogsImportHostUrl()}/catalogs?catalogId=${catalogId}`;
    const REQUEST_BODY: FormData = new FormData();
    REQUEST_BODY.append('unspscSegmentsFile', file, file.name);
    _debugX(ClassificationCatalogsServiceV1.getClassName(), 'importOneByFile', { REQUEST_URL, REQUEST_BODY });
    return this.httpClient.post(REQUEST_URL, REQUEST_BODY, this.getAuthHeaders());
  }

  getViewData(params: any) {
    return forkJoin(
      {
        catalog: this.findOneById(params?.id)
      }
    );
  }

  exportMany(query: any) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);

    const REQUEST_URL = `${this._catalogsExportHostUrl()}/catalogs?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` // 
      + `field=${SORT_FIELD}&` // 
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}`;

    _debugX(ClassificationCatalogsServiceV1.getClassName(), 'exportMany', { REQUEST_URL });
    this.browserService.openInNewTab(REQUEST_URL);
  }

  importFromFile(file: File) {
    const REQUEST_URL = `${this._catalogsImportHostUrl()}/catalogs/import-many`;
    const REQUEST: FormData = new FormData();
    REQUEST.append('classificationCatalogsFile', file, file.name);
    const REQUEST_OPTIONS = this.getAuthHeaders();
    _debugX(ClassificationCatalogsServiceV1.getClassName(), 'importFromFile', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

}
