/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';

import * as ramda from 'ramda';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

import { AccessGroupsService } from './access-groups.service';

@Injectable()
export class UserService extends BaseServiceV1 {

  static getClassName() {
    return 'UserService';
  }

  basePath: string = 'api/v1/app/users';

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private http: HttpClient,
    private accessGroupsService: AccessGroupsService,
  ) {
    super(environmentService, sessionService);
  }

  async getData(endpoint: string) {
    const opts = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.http.get(endpoint, opts).toPromise();
  }

  create(user: any) {
    this._sanitizeUserByAllowedActions(user);
    const REQUEST_URL = `${this._hostUrl()}/${this.basePath}`;
    _debugX(UserService.getClassName(), 'create', { REQUEST_URL });
    return this.http.post(REQUEST_URL, user, this.getAuthHeaders());
  }

  update(user: any) {
    this._sanitizeUserByAllowedActions(user);
    const CURRENT_USER = this.sessionService.getUser();
    let requestUrl = `${this._hostUrl()}/${this.basePath}/${user.id}`;
    if (CURRENT_USER.id === user.id) {
      requestUrl = `${this._hostUrl()}/${this.basePath}/personal-profile/${user.id}`;
    }
    _debugX(UserService.getClassName(), 'update', { requestUrl });
    return this.http.put(requestUrl, user, this.getAuthHeaders());
  }

  delete(user: any) {
    const REQUEST_URL = `${this._hostUrl()}/${this.basePath}/${user.id}`;
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this.sessionService.getToken()}` },
      body: user
    };
    _debugX(UserService.getClassName(), 'delete', { REQUEST_URL });
    return this.http.delete(REQUEST_URL, REQUEST_OPTIONS);
  }

  async countUsersByRoleId(roleId: string) {
    const REQUEST_URL = `${this._hostUrl()}/${this.basePath}/count-by-role/${roleId}`;
    _debugX(UserService.getClassName(), 'countUsersByRoleId', { REQUEST_URL });
    return this.getData(REQUEST_URL);
  }

  findManyByQuery(query: any) {
    const PAGINATION_PAGE = ramda.path(['pagination', 'page'], query);
    const PAGINATION_SIZE = ramda.path(['pagination', 'size'], query);
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);
    const REQUEST_URL = `${this._hostUrl()}/api/v1/app/users?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` //
      + `field=${SORT_FIELD}&` //
      + `sort=${SORT_DIRECTION}`;

    _debugX(UserService.getClassName(), 'findManyByQuery', { query, REQUEST_URL });
    return this.http.get(REQUEST_URL, this.getAuthHeaders());
  }


  loadUserSaveFormData(user: any): Observable<any> {
    const ACCESS_GROUP_QUERY = {
      filter: {},
      sort: {
        field: 'name',
        direction: 'desc'
      },
      pagination: {
        page: 1,
        size: 1000,
      }
    };
    const SOURCES: any = {};
    if (
      this.sessionService.isActionAllowed({ action: 'users.view.change.accessGroup' })
    ) {
      SOURCES.accessGroups = this.accessGroupsService.findManyByQuery(ACCESS_GROUP_QUERY);
    } else {
      SOURCES.accessGroups = of({
        items: [],
        total: 0
      });
    }
    const RET_VAL = forkJoin(SOURCES);
    return RET_VAL;
  }

  private _sanitizeUserByAllowedActions(user: any) {
    if (
      !this.sessionService.isActionAllowed({ action: 'users.view.change.accessGroup' })
    ) {
      delete user.accessGroupIds;
    }
  }

}
