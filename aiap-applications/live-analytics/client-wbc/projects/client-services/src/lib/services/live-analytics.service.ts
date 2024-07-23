/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
} from 'client-utils';

import {
  ConfigsService,
} from '.'

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';
@Injectable()
export class LiveAnalyticsService extends BaseServiceV1 {

  static getClassName() {
    return 'LiveAnalyticsService';
  }

  constructor(
    protected configsService: ConfigsService,
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private http: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    let retVal = `${this.configsService.getHost()}/api/v1/live-analytics`;
    return retVal;
  }


  executeOne(params: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/queries/execute-one`;
    const REQUEST_PARAMS = {
      ref: params?.ref,
      query: params?.query,
      filters: params?.filters,
      export: params?.export,
    };
    const REQUEST = REQUEST_PARAMS;
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(LiveAnalyticsService.getClassName(), 'executeOne', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  exportOne(params: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/exports/export-one`;
    const REQUEST_PARAMS = {
      ref: params?.ref,
      query: params?.query,
      filters: params?.filters,
      export: params?.export,
    };
    const REQUEST = REQUEST_PARAMS;
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(LiveAnalyticsService.getClassName(), 'exportOne', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    return this.http.post(REQUEST_URL, REQUEST, {...REQUEST_OPTIONS, responseType: 'text'});
  }

}
