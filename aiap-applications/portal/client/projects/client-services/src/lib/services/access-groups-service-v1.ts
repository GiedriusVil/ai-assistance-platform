/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  convertArrayToQueryParamsString,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BrowserServiceV1,
  QueryServiceV1,
  EnvironmentServiceV1,
  BaseServiceV1,
} from 'client-shared-services';

import { TenantsServiceV1 } from './tenants-service-v1';
import { ApplicationsServiceV1 } from './applications-service-v1';

@Injectable()
export class AccessGroupsServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'AccessGroupsServiceV1';
  }

  basePath = 'api/v1/app/access-groups';

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    protected httpClient: HttpClient,
    protected router: Router,
    protected tenantsService: TenantsServiceV1,
    protected applicationsService: ApplicationsServiceV1,
    protected queryService: QueryServiceV1,
    protected browserService: BrowserServiceV1,
  ) {
    super(environmentService, sessionService);
  }

  findManyByQuery(query): Observable<any> {
    const PAGINATION = query?.pagination;
    const PAGINATION_SIZE = PAGINATION?.size || 100;
    const PAGINATION_PAGE = PAGINATION?.page || 1;
    const SORT = query?.sort;
    const SORT_FIELD = SORT?.field || 'name';
    const SORT_DIRECTION = SORT?.direction || 'asc';
    const FILTER = query?.filter;
    const SEARCH = FILTER?.search || '';
    const URL =
      `${this._hostUrl()}${this.basePath}?` + //
      `size=${PAGINATION_SIZE}&` + //
      `page=${PAGINATION_PAGE}&` + //
      `field=${SORT_FIELD}&` + //
      `sort=${SORT_DIRECTION}&` + //
      `search=${SEARCH}`;

    const RET_VAL = this.httpClient.get(URL, this.getAuthHeaders());
    return RET_VAL;
  }

  findOneById(id: any) {
    const URL = `${this._hostUrl()}${this.basePath}/${id}`;
    return this.httpClient.get(URL, this.getAuthHeaders());
  }

  saveOne(accessGroup: any) {
    const URL = `${this._hostUrl()}${this.basePath}`;
    return this.httpClient.post(URL, accessGroup, this.getAuthHeaders());
  }

  deleteOneById(id: string): Observable<any> {
    const URL = `${this._hostUrl()}${this.basePath}/${id}`;
    return this.httpClient.delete(URL, this.getAuthHeaders());
  }

  deleteManyByIds(ids: Array<any>): Observable<any> {
    const REQUEST_URL = `${this._hostUrl()}${this.basePath}/delete-many-by-ids`;
    const REQUEST = { ids };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    _debugX(AccessGroupsServiceV1.getClassName(), 'deleteManyByIds',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });
    const RET_VAL = this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  retrievePlatformViews() {
    const VIEWS = [];
    const ADMIN_VIEW_ITEMS = ramda.pathOr([], ['children'], ramda.find(ramda.propEq('path', 'admin-view'))(ramda.pathOr([], ['config'], this.router)));
    this._retrieveViewChildren([...ADMIN_VIEW_ITEMS], VIEWS);
    const RET_VAL = ramda.uniq(VIEWS);
    return RET_VAL;
  }

  _retrieveViewChildren(items: any, views: any) {
    for (let i = 0; i < items.length; i++) {
      const VIEW = items[i];
      const VIEW_CHILDREN = ramda.pathOr([], ['children'], VIEW);
      if (
        !lodash.isEmpty(VIEW_CHILDREN)
      ) {
        this._retrieveViewChildren(VIEW_CHILDREN, views);
      }
      if (
        VIEW?.data?.name
      ) {
        views.push(VIEW.data);
      }
    }
  }

  exportMany(query: any, ids: string[]) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);
    const IDS_QUERY_PARAM = convertArrayToQueryParamsString('ids', ids);

    const REQUEST_URL = `${this._hostUrl()}api/v1/app-export/access-groups?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` // 
      + `field=${SORT_FIELD}&` // 
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}&` //
      + IDS_QUERY_PARAM;

    _debugX(AccessGroupsServiceV1.getClassName(), 'exportMany',
      {
        REQUEST_URL,
      });

    this.browserService.openInNewTab(REQUEST_URL);
  }

  importFromFile(file: File) {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}api/v1/app-import/access-groups`;

    const REQUEST_BODY: FormData = new FormData();

    REQUEST_BODY.append('accessGroupsFile', file, file.name);

    _debugX(AccessGroupsServiceV1.getClassName(), 'importFromFile',
      {
        REQUEST_HEADERS,
        REQUEST_URL,
        REQUEST_BODY,
      });

    return this.httpClient.post(REQUEST_URL, REQUEST_BODY, REQUEST_HEADERS);
  }
}
