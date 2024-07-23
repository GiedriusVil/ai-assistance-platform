/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

@Injectable()
export class LiveAnalyticsConfigurationsService extends BaseServiceV1 {

  static getClassName() {
    return 'LiveAnalyticsConfigurationsService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private httpClient: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    let retVal = `${this._hostUrl()}/api/v1/analytics-live/dashboards-configurations`;
    return retVal;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = {
      ...query
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    _debugX(LiveAnalyticsConfigurationsService.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  saveOne(configuration: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    const REQUEST = {
      ...configuration
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    _debugX(LiveAnalyticsConfigurationsService.getClassName(), 'saveOne', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  deleteManyByIds(ids: Array<any>, reason: string) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = { ids, reason };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(LiveAnalyticsConfigurationsService.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    return this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
  }

  findOneById(configurationId: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-id/${configurationId}`;
    const AUTH_HEADERS = this.getAuthHeaders();
    _debugX(LiveAnalyticsConfigurationsService.getClassName(), 'findOneById', { REQUEST_URL, AUTH_HEADERS });
    return this.httpClient.get(REQUEST_URL, this.getAuthHeaders());
  }

}
