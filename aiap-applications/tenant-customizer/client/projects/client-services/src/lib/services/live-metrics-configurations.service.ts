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
  BrowserServiceV1,
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

@Injectable()
export class LiveMetricsConfigurationsService extends BaseServiceV1 {

  static getClassName() {
    return 'LiveMetricsConfigurationService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private httpClient: HttpClient,
    private browserService: BrowserServiceV1,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/analytics-live/dashboards-configurations`;
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = {
      ...query
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    _debugX(LiveMetricsConfigurationsService.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
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
    _debugX(LiveMetricsConfigurationsService.getClassName(), 'saveOne', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  deleteManyByIds(ids: Array<any>, reason: string) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = { ids, reason };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(LiveMetricsConfigurationsService.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    return this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
  }

  findOneById(configurationId: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-id/${configurationId}`;
    const AUTH_HEADERS = this.getAuthHeaders();
    _debugX(LiveMetricsConfigurationsService.getClassName(), 'findOneById', { REQUEST_URL, AUTH_HEADERS });
    return this.httpClient.get(REQUEST_URL, this.getAuthHeaders());
  }

  exportMany(query: any) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);

    const REQUEST_URL = `${this._hostUrl()}/api/v1/analytics-live/export/dashboards-configurations?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` //
      + `field=${SORT_FIELD}&` //
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}`;

    _debugX(LiveMetricsConfigurationsService.getClassName(), 'exportMany', { REQUEST_URL });
    this.browserService.openInNewTab(REQUEST_URL);
  }

  importFromFile(file: File) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/analytics-live/import/dashboards-configurations`;
    const REQUEST: FormData = new FormData();
    REQUEST.append('dashboardsConfigurationsFile', file, file.name);
    _debugX(LiveMetricsConfigurationsService.getClassName(), 'importFromFile', { REQUEST_URL, REQUEST });
    const RET_VAL = this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
    return RET_VAL;
  }
}
