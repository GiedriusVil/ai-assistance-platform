/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, of, Observable } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
  convertArrayToQueryParamsString,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BrowserServiceV1,
  UtilsServiceV1,
  EnvironmentServiceV1,
  BaseServiceV1,
} from 'client-shared-services';

import {
  DATASOURCE_TYPE,
} from 'client-utils';

@Injectable()
export class TenantsServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'TenantsServiceV1';
  }

  basePath = 'api/v1/app/tenants';

  constructor(
    protected browserSerivce: BrowserServiceV1,
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private utilsService: UtilsServiceV1,
    private http: HttpClient
  ) {
    super(environmentService, sessionService);
  }

  findManyByQuery(query: {
    filter?: {
      search?: any,
      dateRange?: {
        from: any,
        to: any,
      }
    },
    pagination: {
      page: any,
      size: any,
    },
    sort: {
      field: any,
      direction: any,
    }
  }) {

    let url;

    try {
      const FILTER_DATE_FROM = query?.filter?.dateRange?.from;
      const FILTER_DATE_TO = query?.filter?.dateRange?.to;

      const TIMEZONE = this.utilsService.convertDatesToTimestamps(
        FILTER_DATE_FROM,
        FILTER_DATE_TO,
        this._timezone(),
      );

      const PAGINATION_PAGE = query?.pagination?.page;
      const PAGINATION_SIZE = query?.pagination?.size;

      const SORT_FIELD = query?.sort?.field;
      const SORT_DIRECTION = query?.sort?.direction;

      const SEARCH = query?.filter?.search;

      url =
        `${this._hostUrl()}${this.basePath}?` + //
        `from=${TIMEZONE.timestampFrom}&` + //
        `to=${TIMEZONE.timestampTo}&` + //
        `size=${PAGINATION_SIZE}&` + //
        `page=${PAGINATION_PAGE}&` + //
        `field=${SORT_FIELD}&` + //
        `sort=${SORT_DIRECTION}`;

      if (
        !lodash.isEmpty(SEARCH)
      ) {
        url = `${url}&search=${SEARCH}`;
      }

      const REQUEST_URL = url;
      const REQUEST_OPTIONS = this.getAuthHeaders();
      _debugX(TenantsServiceV1.getClassName(), 'findManyByQuery',
        {
          REQUEST_URL,
          REQUEST_OPTIONS,
        });

      const RET_VAL = this.http.get(REQUEST_URL, REQUEST_OPTIONS);
      return RET_VAL;
    } catch (error) {
      _errorX(TenantsServiceV1.getClassName(), 'findManyByQuery',
        {
          error,
        });

      throw error;
    }
  }

  getNewTenant() {
    const REQUEST_URL = `${this._hostUrl()}${this.basePath}/new-tenant`;
    const REQUEST_OPTIONS = this.getAuthHeaders();
    _debugX(TenantsServiceV1.getClassName(), 'getNewTenant',
      {
        REQUEST_URL,
        REQUEST_OPTIONS,
      });

    return this.http.get(REQUEST_URL, REQUEST_OPTIONS);
  }

  findOneById(id: any) {
    const REQUEST_URL = `${this._hostUrl()}${this.basePath}/${id}`;
    const REQUEST_OPTIONS = this.getAuthHeaders();
    _debugX(TenantsServiceV1.getClassName(), 'findOneById',
      {
        REQUEST_URL,
        REQUEST_OPTIONS,
      });

    return this.http.get(REQUEST_URL, REQUEST_OPTIONS);
  }

  save(tenant: any) {
    const REQUEST_URL = `${this._hostUrl()}${this.basePath}/save-one`;
    const REQUEST = tenant;
    const REQUEST_OPTIONS = this.getAuthHeaders();
    _debugX(TenantsServiceV1.getClassName(), 'save',
      {
        REQUEST_URL,
        REQUEST_OPTIONS,
      });

    return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  // posibly move to another service
  retrieveDatasources() {
    const RET_VAL = forkJoin({
      organizations: this.retrieveDatasourcesByType(DATASOURCE_TYPE.ORGANIZATIONS),
      rules: this.retrieveDatasourcesByType(DATASOURCE_TYPE.RULES),
      lambdaModules: this.retrieveDatasourcesByType(DATASOURCE_TYPE.LAMBDA_MODULES),
    });
    return RET_VAL;
  }

  // posibly move to another service
  retrieveDatasourcesByType(type: string) {
    const REQUEST_URL = `${this._hostUrl()}api/server/datasources?type=${type}`;
    const REQUEST_OPTIONS = this.getAuthHeaders();
    _debugX(TenantsServiceV1.getClassName(), 'retrieveDatasourcesByType',
      {
        REQUEST_URL,
        REQUEST_OPTIONS,
      });

    return this.http.get(REQUEST_URL, REQUEST_OPTIONS);
  }

  retrieveEventStreams() {
    const REQUEST_URL = `${this._hostUrl()}api/server/event-streams`;
    const REQUEST_OPTIONS = this.getAuthHeaders();

    _debugX(TenantsServiceV1.getClassName(), 'retrieveEventStreams',
      {
        REQUEST_URL,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.get(REQUEST_URL, REQUEST_OPTIONS);
    return RET_VAL;
  }

  deleteTenantByID(id: string): Observable<any> {
    const REQUEST_URL = `${this._hostUrl()}${this.basePath}/${id}`;
    const REQUEST_OPTIONS = this.getAuthHeaders();

    _debugX(TenantsServiceV1.getClassName(), 'deleteTenantByID',
      {
        REQUEST_URL,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.delete(REQUEST_URL, REQUEST_OPTIONS);
    return RET_VAL;
  }

  deleteManyByIds(ids: Array<any>): Observable<any> {
    const REQUEST_URL = `${this._hostUrl()}${this.basePath}/delete-many-by-ids`;
    const REQUEST = { ids };
    const REQUEST_OPTIONS = {
      headers: {
        ['Authorization']: `Bearer ${this._token()}`
      }
    };
    _debugX(TenantsServiceV1.getClassName(), 'deleteManyByIds',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  retrievePullTenants() {
    const REQUEST_URL = `${this._hostUrl()}${this.basePath}/pull-tenants`;
    const REQUEST_OPTIONS = this.getAuthHeaders();
    _debugX(TenantsServiceV1.getClassName(), 'retrievePullTenants',
      {
        REQUEST_URL,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.get(REQUEST_URL, REQUEST_OPTIONS);
    return RET_VAL;
  }

  retrieveSaveTenantFormData(tenant: any) {
    _debugX(TenantsServiceV1.getClassName(), 'retrieveSaveTenantFormData',
      {
        tenant,
      });

    const FORK_JOIN_SOURCES: any = {
      environments: this.environmentService.findManyByQuery(),
      organizations: this.retrieveDatasourcesByType(DATASOURCE_TYPE.ORGANIZATIONS),
      rules: this.retrieveDatasourcesByType(DATASOURCE_TYPE.RULES),
      lambdaModules: this.retrieveDatasourcesByType(DATASOURCE_TYPE.LAMBDA_MODULES),
      pullTenants: this.retrievePullTenants(),
      eventStreams: this.retrieveEventStreams(),
      tenant: of(tenant),
    };
    const RET_VAL = forkJoin(FORK_JOIN_SOURCES);
    return RET_VAL;
  }

  retrieveApiKey() {
    const REQUEST_URL = `${this._hostUrl()}${this.basePath}/api-key`;
    const REQUEST_OPTIONS = this.getAuthHeaders();
    _debugX(TenantsServiceV1.getClassName(), 'retrieveApiKey',
      {
        REQUEST_URL,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.get(REQUEST_URL, REQUEST_OPTIONS);
    return RET_VAL;
  }

  exportMany(query: any, ids: string[]) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);
    const IDS_QUERY_PARAM = convertArrayToQueryParamsString('ids', ids);

    const REQUEST_URL = `${this._hostUrl()}api/v1/app-export/tenants?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` // 
      + `field=${SORT_FIELD}&` // 
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}&` //
      + IDS_QUERY_PARAM;
    _debugX(TenantsServiceV1.getClassName(), 'exportMany',
      {
        REQUEST_URL,
      });

    this.browserSerivce.openInNewTab(REQUEST_URL);
  }

  importFromFile(file: File) {
    const REQUEST_URL = `${this._hostUrl()}api/v1/app-import/tenants`;
    const REQUEST: FormData = new FormData();
    REQUEST.append('tenantsFile', file, file.name);
    const REQUEST_OPTIONS = this.getAuthHeaders();
    _debugX(TenantsServiceV1.getClassName(), 'importFromFile',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  findManyByQueryLite(query: any) {
    const REQUEST_URL = `${this._hostUrl()}${this.basePath}/find-many-lite-by-query`;
    const REQUEST = {
      ...query
    };
    const REQUEST_OPTIONS = this.getAuthHeaders();
    _debugX(TenantsServiceV1.getClassName(), 'findManyByQueryLite',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }
}
