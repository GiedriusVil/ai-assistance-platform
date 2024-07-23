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
  _info,
  _error,
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
    const PAGINATION = ramda.path(['pagination'], query);
    const PAGINATION_SIZE = ramda.pathOr(100, ['size'], PAGINATION);
    const PAGINATION_PAGE = ramda.pathOr(1, ['page'], PAGINATION);
    const SORT = ramda.path(['sort'], query);
    const SORT_FIELD = ramda.pathOr('name', ['field'], SORT);
    const SORT_DIRECTION = ramda.pathOr('asc', ['direction'], SORT);
    const URL = `${this._hostUrl()}api/v1/app/access-groups?`//
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` //
      + `field=${SORT_FIELD}&` //
      + `sort=${SORT_DIRECTION}`;
    return this.httpClient.get(URL, this.getAuthHeaders());
  }

  findOneById(id: any) {
    const URL = `${this._hostUrl()}/api/v1/app/access-groups/${id}`;
    return this.httpClient.get(URL, this.getAuthHeaders());
  }

  saveOne(accessGroup: any) {
    const URL = `${this._hostUrl()}/api/v1/app/access-groups`;
    return this.httpClient.post(URL, accessGroup, this.getAuthHeaders());
  }

  deleteOneById(id: string): Observable<any> {
    const URL = `${this._hostUrl()}/api/v1/app/access-groups/${id}`;
    return this.httpClient.delete(URL, this.getAuthHeaders());
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

    const ALL_PAGES = this.retrieveAllPages();
    const APPLICATION_PAGES = this.retrieveApplicationPages(ALL_PAGES);
    const CONVERSATION_PAGES = this.retrieveConversationPages(ALL_PAGES);

    const RET_VAL = forkJoin(
      {
        tenants: this.tenantsService.findManyByQuery(TENANTS_QUERY),
        applicationPages: of(APPLICATION_PAGES),
        conversationPages: of(CONVERSATION_PAGES),
        accessGroup: this.findOneById(id)
      }
    );
    return RET_VAL;
  }

  retrieveAllPages() {
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
    const PAGES = pages.filter(page => page?.requiresApplicationPolicy)
    return PAGES;
  }

  retrieveConversationPages(pages) {
    const PAGES = pages.filter(page => page?.requiresConversationPolicy)
    return PAGES;
  }

}
