/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as ramda from 'ramda';

import {
  SessionServiceV1,
  BrowserServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

import {
  _debugX,
} from 'client-shared-utils';

@Injectable()
export class DataMaskingConfigurationsServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'DataMaskingConfigurationsServiceV1';
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
    const RET_VAL = `${this._hostUrl()}/api/v1/data-masking/configurations`;
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = {
      ...query
    };
    _debugX(DataMaskingConfigurationsServiceV1.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
  }

  saveOne(configuration: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    const REQUEST = {
      ...configuration
    };
    _debugX(DataMaskingConfigurationsServiceV1.getClassName(), 'saveOne', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
  }

  deleteManyByKeys(keys: Array<any>) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-keys`;
    const REQUEST = { keys };
    _debugX(DataMaskingConfigurationsServiceV1.getClassName(), 'deleteManyByKeys', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
  }

  findOneByKey(configKey: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-key`;
    const REQUEST = {
      key: configKey
    };
    _debugX(DataMaskingConfigurationsServiceV1.getClassName(), 'findOneByKey', { REQUEST_URL, REQUEST });
    const RET_VAL = this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
    return RET_VAL;
  }

  exportMany(query: any) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);

    const REQUEST_URL = `${this._hostUrl()}/api/v1/data-masking/export/configurations?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` //
      + `field=${SORT_FIELD}&` //
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}`;

    _debugX(DataMaskingConfigurationsServiceV1.getClassName(), 'exportMany', { REQUEST_URL });
    this.browserService.openInNewTab(REQUEST_URL);
  }

  importFromFile(file: File) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/data-masking/import/configurations`;
    const REQUEST: FormData = new FormData();
    REQUEST.append('dataMaskingConfigurationsFile', file, file.name);
    _debugX(DataMaskingConfigurationsServiceV1.getClassName(), 'importFromFile', { REQUEST_URL, REQUEST });
    const RET_VAL = this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
    return RET_VAL;
  }
}
