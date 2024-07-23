/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, of, Observable } from 'rxjs';

import * as ramda from 'ramda';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BrowserServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
  UtilsServiceV1,
} from 'client-shared-services';

@Injectable()
export class TenantsService extends BaseServiceV1 {

  static getClassName() {
    return 'TenantsService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private utilsService: UtilsServiceV1,
    private http: HttpClient,
    private browserService: BrowserServiceV1,
  ) {
    super(environmentService, sessionService);
  }

  findManyByQuery(query: any) {
    const REQUEST_HEADERS = this.getAuthHeaders();

    const FILTER_DATE_FROM = ramda.path(['filter', 'dateRange', 'from'], query);
    const FILTER_DATE_TO = ramda.path(['filter', 'dateRange', 'from'], query);
    const TIMEZONE = this.utilsService.convertDatesToTimestamps(FILTER_DATE_FROM, FILTER_DATE_TO, this._timezone());

    const PAGINATION_PAGE = ramda.path(['pagination', 'page'], query);
    const PAGINATION_SIZE = ramda.path(['pagination', 'size'], query);

    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);

    const REQUEST_URL = `${this._hostUrl()}/api/v1/app/tenants?` //
      + `from=${TIMEZONE.timestampFrom}&` //
      + `to=${TIMEZONE.timestampTo}&` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` //
      + `field=${SORT_FIELD}&` //
      + `sort=${SORT_DIRECTION}`;

    _debugX(TenantsService.getClassName(), 'findManyByQuery', { REQUEST_HEADERS, REQUEST_URL });
    return this.http.get(REQUEST_URL, REQUEST_HEADERS);
  }

  save(tenant: any) {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/app/tenants`;
    _debugX(TenantsService.getClassName(), 'save', { REQUEST_HEADERS, REQUEST_URL });
    return this.http.post(REQUEST_URL, tenant, REQUEST_HEADERS);
  }

  // posibly move to another service
  retrieveDatasourcesByType(type: string) {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/server/datasources?type=${type}`;
    _debugX(TenantsService.getClassName(), 'retrieveDatasourcesByType', { REQUEST_HEADERS, REQUEST_URL });
    return this.http.get(REQUEST_URL, REQUEST_HEADERS);
  }

  deleteOneById(id: string): Observable<any> {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/app/tenants/delete-one-by-id`;
    const REQUEST = { id };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(TenantsService.getClassName(), 'deleteOneById', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  deleteManyByIds(ids: Array<any>, reason: any): Observable<any> {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/app/tenants/delete-many-by-ids`;
    const REQUEST = { ids, reason };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(TenantsService.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  retrievePullTenants() {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/app/tenants/pull-tenants`;
    _debugX(TenantsService.getClassName(), 'retrieveDatasourcesByType', { REQUEST_HEADERS, REQUEST_URL });
    return this.http.get(REQUEST_URL, REQUEST_HEADERS);
  }

  retrieveEventStreams() {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/server/event-streams`;
    _debugX(TenantsService.getClassName(), 'retrieveDatasourcesByType', { REQUEST_HEADERS, REQUEST_URL });
    return this.http.get(REQUEST_URL, REQUEST_HEADERS);
  }

  retrieveSaveTenantFormData(tenant: any) {
    const FORK_JOIN_SOURCES: any = {
      environments: this.environmentService.findManyByQuery(),
      conversations: this.retrieveDatasourcesByType('conversations'),
      answers: this.retrieveDatasourcesByType('answers'),
      analyticsLive: this.retrieveDatasourcesByType('analytics-live'),
      aiServices: this.retrieveDatasourcesByType('ai-services'),
      unspsc: this.retrieveDatasourcesByType('unspsc'),
      auditor: this.retrieveDatasourcesByType('auditor'),
      lambdaModules: this.retrieveDatasourcesByType('lambda-modules'),
      engagements: this.retrieveDatasourcesByType('engagements'),
      pullTenants: this.retrievePullTenants(),
      eventStreams: this.retrieveEventStreams(),
      purchases: this.retrieveDatasourcesByType('purchases'),
      tenant: of(tenant),
    };
    const RET_VAL = forkJoin(FORK_JOIN_SOURCES);
    return RET_VAL;
  }

  findOneById(id: any) {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/app/tenants/${id}`;
    _debugX(TenantsService.getClassName(), 'retrieveDatasourcesByType', { REQUEST_HEADERS, REQUEST_URL });
    return this.http.get(REQUEST_URL, REQUEST_HEADERS);
  }

  retrieveapiKey() {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/app/tenants//api-key`;
    _debugX(TenantsService.getClassName(), 'retrieveDatasourcesByType', { REQUEST_HEADERS, REQUEST_URL });
    return this.http.get(REQUEST_URL, REQUEST_HEADERS);
  }

  exportMany(query: any) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);

    const REQUEST_URL = `${this._hostUrl()}/api/v1/app-export/tenants?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` // 
      + `field=${SORT_FIELD}&` // 
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}`;

    _debugX(TenantsService.getClassName(), 'exportMany', { REQUEST_URL });
    this.browserService.openInNewTab(REQUEST_URL);
  }

  importFromFile(file: File) {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/app-import/tenants`;
    const REQUEST_BODY: FormData = new FormData();
    REQUEST_BODY.append('tenantsFile', file, file.name);
    _debugX(TenantsService.getClassName(), 'importFromFile', { REQUEST_HEADERS, REQUEST_URL, REQUEST_BODY });
    return this.http.post(REQUEST_URL, REQUEST_BODY, REQUEST_HEADERS);
  }

}
