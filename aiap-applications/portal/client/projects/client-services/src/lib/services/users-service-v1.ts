/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';

import * as ramda from 'ramda';

import {
  _debugX
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EnvironmentServiceV1,
  BaseServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import { User } from 'client-utils';

import { AccessGroupsServiceV1 } from './access-groups-service-v1';
import { TenantsServiceV1 } from './tenants-service-v1';

@Injectable()
export class UsersServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'UsersServiceV1';
  }

  basePath = 'api/v1/app/users';

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private http: HttpClient,
    private accessGroupsService: AccessGroupsServiceV1,
    private tenantsService: TenantsServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super(environmentService, sessionService);
  }

  async getData(endpoint: string) {
    const opts = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    const RET_VAL = this.http.get(endpoint, opts).toPromise();
    return RET_VAL;
  }

  create(user: any) {
    const REQUEST_URL = `${this._hostUrl()}${this.basePath}`;
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };

    const RET_VAL = this.http.post(REQUEST_URL, user, REQUEST_OPTIONS);
    return RET_VAL;
  }

  update(user: any) {
    const CURRENT_USER = this.sessionService.getUser();
    let requestUrl = `${this._hostUrl()}${this.basePath}/${user.id}`;
    if (CURRENT_USER.id === user.id) {
      requestUrl = `${this._hostUrl()}${this.basePath}/personal-profile/${user.id}`;
    }
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    const RET_VAL = this.http.put(requestUrl, user, REQUEST_OPTIONS);
    return RET_VAL;
  }

  delete(user: any) {
    const REQUEST_URL = `${this._hostUrl()}${this.basePath}/${user.id}`;
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this.sessionService.getToken()}` },
      body: user
    };

    const RET_VAL = this.http.delete(REQUEST_URL, REQUEST_OPTIONS);
    return RET_VAL;
  }

  deleteManyByIds(ids: Array<any>) {
    const REQUEST_URL = `${this._hostUrl()}${this.basePath}/delete-many-by-ids`;
    const REQUEST = { ids };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    _debugX(UsersServiceV1.getClassName(), 'deleteManyByIds',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  async countUsersByRoleId(roleId: string) {
    const url = `${this._hostUrl()}${this.basePath}/count-by-role/${roleId}`;

    const RET_VAL = this.getData(url);
    return RET_VAL;
  }

  /** TODO replace all promise methods approach with observable ( and newGetData => getData) */
  private newGetData(endpoint: string): Observable<any> {
    const opts = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.http.get(endpoint, opts);
  }

  getUsers(
    items = 1000,
    page = 1,
    field = 'started',
    sort = 'desc'
  ): Observable<User[]> {
    const REQUEST_URL = `${this._hostUrl()}${this.basePath}?size=${items}&page=${page}&field=${field}&sort=${sort}`;

    const RET_VAL = this.newGetData(REQUEST_URL);
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const PAGINATION_PAGE = ramda.path(['pagination', 'page'], query);
    const PAGINATION_SIZE = ramda.path(['pagination', 'size'], query);
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);
    const SEARCH = ramda.pathOr('', ['filter', 'search'], query);
    const REQUEST_URL = `${this._hostUrl()}${this.basePath}?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` //
      + `field=${SORT_FIELD}&` //
      + `sort=${SORT_DIRECTION}&` //
      + `search=${SEARCH}`;

    const RET_VAL = this.http.get(REQUEST_URL, this.getAuthHeaders());
    return RET_VAL;
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

    if (
      this.sessionService.isActionAllowed({ action: 'users.view.change.tenants' }) ||
      this.sessionService.isActionAllowed({ action: 'profile.view.change.tenants' })
    ) {
      SOURCES.tenants = this.tenantsService.findManyByQueryLite(ACCESS_GROUP_QUERY);
    } else {
      SOURCES.tenants = of({
        items: [],
        total: 0
      });
    }

    const USER_STATUSES = {
      items: [
        {
          id: 'active',
          content: this.translateService.instant('users_view_v1.save_modal_v1.fld_status.option_actived'),
          statusName: ['ACTIVE']
        },
        {
          id: 'deactive',
          content: this.translateService.instant('users_view_v1.save_modal_v1.fld_status.option_deactivated'),
          statusName: [
            'IN_ACTIVE',
            'IN_ACTIVE_FAILED_ATTEMPTS'
          ]
        }
      ],
      total: 2
    };

    SOURCES.userStatuses = of(USER_STATUSES);

    const RET_VAL = forkJoin(SOURCES);
    return RET_VAL;
  }

  exportUsersPermissions() {
    const REQUEST_URL = `${this._hostUrl()}${this.basePath}/export-users-permissions`;

    const REQUEST_OPTIONS = ramda.mergeDeepRight(
      this._requestOptions(),
      {
        responseType: 'blob',
      }
    );

    const RET_VAL = this.http.post(REQUEST_URL, {}, REQUEST_OPTIONS);
    return RET_VAL;
  }
}
