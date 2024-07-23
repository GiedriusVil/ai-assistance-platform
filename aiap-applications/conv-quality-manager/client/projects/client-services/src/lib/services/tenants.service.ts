/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, of, Observable } from 'rxjs';

import * as ramda from 'ramda';

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
  UtilsServiceV1,
} from 'client-shared-services';

@Injectable()
export class TenantsService extends BaseServiceV1 {

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private utilsService: UtilsServiceV1,
    private http: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  findManyByQuery(query: any) {
    const FILTER_DATE_FROM = ramda.path(['filter', 'dateRange', 'from'], query);
    const FILTER_DATE_TO = ramda.path(['filter', 'dateRange', 'from'], query);
    const TIMEZONE = this.utilsService.convertDatesToTimestamps(FILTER_DATE_FROM, FILTER_DATE_TO, this._timezone());

    const PAGINATION_PAGE = ramda.path(['pagination', 'page'], query);
    const PAGINATION_SIZE = ramda.path(['pagination', 'size'], query);

    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);

    let requestUrl = `${this._hostUrl()}/api/v1/app/tenants?` //
      + `from=${TIMEZONE.timestampFrom}&` //
      + `to=${TIMEZONE.timestampTo}&` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` //
      + `field=${SORT_FIELD}&` //
      + `sort=${SORT_DIRECTION}`;

    return this.http.get(requestUrl, this.getAuthHeaders());
  }

  save(tenant: any) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/app/tenants`;
    return this.http.post(REQUEST_URL, tenant, this.getAuthHeaders());
  }

  // posibly move to another service
  retrieveDatasourcesByType(type: string) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/server/datasources?type=${type}`;
    return this.http.get(REQUEST_URL, this.getAuthHeaders());
  }

  deleteTenantByID(id: string): Observable<any> {
    const URL = `${this._hostUrl()}/api/v1/app/tenants/${id}`;
    return this.http.delete(URL, this.getAuthHeaders());
  }

  retrievePullTenants() {
    const URL = `${this._hostUrl()}/api/v1/app/tenants/pull-tenants`;
    return this.http.get(URL, this.getAuthHeaders());
  }

  retrieveEventStreams() {
    const URL = `${this._hostUrl()}/api/v1/server/event-streams`;
    return this.http.get(URL, this.getAuthHeaders());
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
    const URL = `${this._hostUrl()}/api/v1/app/tenants/${id}`;
    return this.http.get(URL, this.getAuthHeaders());
  }

  retrieveApiKey() {
    const URL = `${this._hostUrl()}/api/v1/app/tenants/api-key`;
    return this.http.get(URL, this.getAuthHeaders());
  }

}
