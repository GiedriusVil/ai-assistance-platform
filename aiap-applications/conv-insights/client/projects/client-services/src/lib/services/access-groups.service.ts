/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BrowserServiceV1,
  EnvironmentServiceV1,
  BaseServiceV1,
} from 'client-shared-services';

import { TenantsService } from './tenants.service';

@Injectable()
export class AccessGroupsService extends BaseServiceV1 {

  static getClassName() {
    return 'AccessGroupsService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    protected httpClient: HttpClient,
    protected router: Router,
    protected browserService: BrowserServiceV1,
    protected tenantsService: TenantsService,
  ) {
    super(environmentService, sessionService);
  }

  findManyByQuery(query): Observable<any> {
    const REQUEST_HEADERS = this.getAuthHeaders();

    const PAGINATION = ramda.path(['pagination'], query);
    const PAGINATION_SIZE = ramda.pathOr(100, ['size'], PAGINATION);
    const PAGINATION_PAGE = ramda.pathOr(1, ['page'], PAGINATION);
    const SORT = ramda.path(['sort'], query);
    const SORT_FIELD = ramda.pathOr('name', ['field'], SORT);
    const SORT_DIRECTION = ramda.pathOr('asc', ['direction'], SORT);

    const REQUEST_URL = `${this._hostUrl()}/api/v1/app/access-groups?`//
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` //
      + `field=${SORT_FIELD}&` //
      + `sort=${SORT_DIRECTION}`;

    _debugX(AccessGroupsService.getClassName(), 'findManyByQuery', { REQUEST_HEADERS, REQUEST_URL });
    return this.httpClient.get(REQUEST_URL, REQUEST_HEADERS);
  }

  findOneById(id: any) {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/app/access-groups/${id}`;
    _debugX(AccessGroupsService.getClassName(), 'findOneById', { REQUEST_HEADERS, REQUEST_URL });
    return this.httpClient.get(REQUEST_URL, REQUEST_HEADERS);
  }

  saveOne(accessGroup: any) {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/app/access-groups`;
    _debugX(AccessGroupsService.getClassName(), 'saveOne', { REQUEST_HEADERS, REQUEST_URL });
    return this.httpClient.post(REQUEST_URL, accessGroup, REQUEST_HEADERS);
  }

  deleteOneById(id: string): Observable<any> {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/app/access-groups/delete-one-by-id`;
    const REQUEST = { id };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AccessGroupsService.getClassName(), 'deleteOneById', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  deleteManyByIds(ids: Array<any>, reason: any): Observable<any> {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/app/access-groups/delete-many-by-ids`;
    const REQUEST = { ids, reason };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AccessGroupsService.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  retrieveAccessGroupFormData(id: string) {
    const TENANTS_QUERY = {
      sort: {
        field: 'name',
        direction: 'asc'
      },
      pagination: {
        page: 1,
        size: 1000,
      }
    };
    const ASSISTANTS_QUERY = {
      sort: {
        field: 'name',
        direction: 'asc'
      },
      pagination: {
        page: 1,
        size: 1000,
      }
    };
    const ADMIN_ALL_PAGES = this.retrieveAdminAllPages();

    const PORTAL_ALL_PAGES = this.retrievePortalAllPages();

    const ADMIN_PAGES = this.retrieveApplicationPages(ADMIN_ALL_PAGES);
    const CONVERSATION_PAGES = this.retrieveConversationPages(PORTAL_ALL_PAGES);

    const RET_VAL = forkJoin(
      {
        tenants: this.tenantsService.findManyByQuery(TENANTS_QUERY),
        applicationPages: of(ADMIN_PAGES),
        conversationPages: of(CONVERSATION_PAGES),
        accessGroup: this.findOneById(id)
      }
    );
    return RET_VAL;
  }

  retrieveAdminAllPages() {
    const PAGES = [];
    const items = ramda.pathOr([], ['children'], ramda.find(ramda.propEq('path', 'admin-view'))(ramda.pathOr([], ['config'], this.router)));
    this._retrievePageChildren(items, PAGES);
    return ramda.uniq(PAGES);
  }

  retrievePortalAllPages() {
    const PAGES = [];
    const items = ramda.pathOr([], ['children'], ramda.find(ramda.propEq('path', 'main-view'))(ramda.pathOr([], ['config'], this.router)));
    this._retrievePageChildren(items, PAGES);
    return ramda.uniq(PAGES);
  }

  _retrievePageChildren(items, PAGES) {
    for (let i = 0; i < items.length; i++) {
      const PAGE = items[i];
      const PAGE_CHILDREN = ramda.pathOr([], ['children'], PAGE);
      if (!lodash.isEmpty(PAGE_CHILDREN)) {
        this._retrievePageChildren(PAGE_CHILDREN, PAGES);
      }
      if (PAGE) {
        PAGES.push(PAGE.data);
      }
    }
  }

  retrieveApplicationPages(pages) {
    const PAGES = pages.filter(page => page?.requiresApplicationPolicy);
    return PAGES;
  }

  retrieveConversationPages(pages) {
    const PAGES = pages.filter(page => page?.requiresConversationPolicy)
    return PAGES;
  }

  exportMany(query: any) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);

    const REQUEST_URL = `${this._hostUrl()}/api/v1/app-export/access-groups?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` // 
      + `field=${SORT_FIELD}&` // 
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}`;

    _debugX(AccessGroupsService.getClassName(), 'exportMany', { REQUEST_URL });
    this.browserService.openInNewTab(REQUEST_URL);
  }

  importFromFile(file: File) {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/app-import/access-groups`;

    const REQUEST_BODY: FormData = new FormData();
    REQUEST_BODY.append('accessGroupsFile', file, file.name);
    _debugX(AccessGroupsService.getClassName(), 'importFromFile', { REQUEST_HEADERS, REQUEST_URL, REQUEST_BODY });
    return this.httpClient.post(REQUEST_URL, REQUEST_BODY, REQUEST_HEADERS);
  }

}
