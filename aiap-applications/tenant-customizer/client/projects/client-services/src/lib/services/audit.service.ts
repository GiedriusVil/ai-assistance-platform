/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as ramda from 'ramda';

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

@Injectable()
export class AuditService extends BaseServiceV1 {

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private http: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  async getData(endpoint: string) {
    const opts = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.http.get(endpoint, opts).toPromise();
  }

  getAuditLogsByExternalId(externalId: any = null) {
    const url = `${this._hostUrl()}api/v1/app/audits/${externalId}`;
    return this.http.get(url, this.getAuthHeaders());
  }

  async oldGetAuditLogs(
    from: any = null,
    to: any = null,
    items: number = 100,
    page: number = 1,
    field: string = 'timestamp',
    sort: string = 'asc',
    initiator: string = null,
    referenceId: string = null
  ) {

    let url = `${this.environmentService.getEnvironment().hostUrl}api/v1/app/audits?from=${from}&to=${to}&size=${items}&page=${page}&field=${field}&sort=${sort}`;
    if (initiator) {
      url = `${url}&userId=${initiator}`;
    }
    if (referenceId) {
      url = `${url}&externalId=${referenceId}`;
    }
    return this.getData(url);

  }

  /** TODO replace all promise methods approach with observable ( and newGetData => getData) */
  private newGetData(endpoint: string): Observable<any> {
    const opts = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.http.get(endpoint, opts);
  }

  getAuditLogs(query): Observable<any> {
    const DATE_FROM = query.dateFrom;
    const DATE_TO = query.dateTo;
    const ITEMS_PER_PAGE = ramda.pathOr(10, ['itemsPerPage'], query);
    const SELECTED_PAGE = ramda.pathOr(1, ['selectedPage'], query);
    const SORT_FIELD = ramda.pathOr('timestamp', ['sortField'], query);;
    const SORT_DIRECTION = ramda.pathOr('asc', ['sortDirection'], query);
    const INITIATOR = ramda.pathOr(null, ['initiator'], query);
    const REFERENCE_ID = ramda.pathOr(null, ['referenceId'], query);

    let url = `${this.environmentService.getEnvironment().hostUrl}api/v1/app/audits?from=${DATE_FROM}&to=${DATE_TO}&size=${ITEMS_PER_PAGE}&page=${SELECTED_PAGE}&field=${SORT_FIELD}&sort=${SORT_DIRECTION}`;
    if (INITIATOR) {
      url = `${url}&userId=${INITIATOR}`;
    }
    if (REFERENCE_ID) {
      url = `${url}&externalId=${REFERENCE_ID}`;
    }
    return this.newGetData(url);
  }
}
