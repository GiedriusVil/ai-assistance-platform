/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

@Injectable()
export class SupervisorActionsService extends BaseServiceV1 {

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private http: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  // TO_BE_REMOVED into observable
  async getData(endpoint: string) {
    const opts = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.http.get(endpoint, opts).toPromise();
  }

  // TO_BE_REMOVED into observable
  async putData(endpoint: string, body: object) {
    const opts = {
      headers: {
        ['Authorization']: `Bearer ${this._token()}`
      }
    };
    return this.http.put(endpoint, body, opts).toPromise();
  }

  // TO_BE_REMOVED into observable
  async postData(endpoint: string, body: object) {
    const opts = {
      headers: {
        ['Authorization']: `Bearer ${this._token()}`
      }
    };
    return this.http.post(endpoint, body, opts).toPromise();
  }

  // TO_BE_REMOVED into observable
  async deleteData(endpoint: string, body: object = null) {
    const opts = {
      headers: {
        ['Authorization']: `Bearer ${this._token()}`
      },
      body: body
    };
    return this.http.delete(endpoint, opts).toPromise();
  }

  findManyByQuery({
    dateFrom = null,
    dateTo = null,
    conversationId = null,
    itemsPerPage = 1000,
    selectedPage = 1,
    sortField = 'timestamp',
    sortDirection = 'desc'
  }) {
    let requestUrl = `${this._hostUrl()}/api/v1/conversations/surveys?from=${dateFrom}&to=${dateTo}&size=${itemsPerPage}&page=${selectedPage}&field=${sortField}&sort=${sortDirection}`;

    if (conversationId) {
      requestUrl = `${requestUrl}&conversationId=${conversationId}`;
    }
    return this.http.get(requestUrl, this.getAuthHeaders());
  }

  async getActions() {
    const page: any = 1;
    const size: any = 100;
    const url = `${this.environmentService.getEnvironment().hostUrl}/api/v1/app/supervisor-actions?size=${page}&page=${size}`;
    return this.getData(url);
  }

  async deleteAction(id: string) {
    const url = `${this.environmentService.getEnvironment().hostUrl}/api/v1/app/supervisor-actions/${id}`;
    return this.deleteData(url);
  }

  async createRequest(reference: any, metadata: any) {
    const url = `${this.environmentService.getEnvironment().hostUrl}/api/v1/app/supervisor-actions`;
    const data = {
      reference: reference,
      metadata: metadata
    };
    return this.postData(url, data);
  }

}
