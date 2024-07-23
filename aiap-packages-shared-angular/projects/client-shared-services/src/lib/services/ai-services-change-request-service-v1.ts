/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EnvironmentServiceV1,
} from '.';

import { BaseServiceV1 } from './base-service-v1';
@Injectable()
export class AiServicesChangeRequestServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'AiServicesChangesServiceV1';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private http: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._host()}/api/v1/ai/services/change-request`;
    return RET_VAL;
  }

  saveOne(value: any, options: any = undefined) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    const REQUEST = { value, options };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiServicesChangeRequestServiceV1.getClassName(), 'saveOne', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  deleteManyByIds(ids: Array<any>) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = { ids };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiServicesChangeRequestServiceV1.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = {
      query
    };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiServicesChangeRequestServiceV1.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }
  findOneById(id: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-id`;
    const REQUEST = {
      id
    };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiServicesChangeRequestServiceV1.getClassName(), 'findOneById', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  executeOne(value: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/execute-one`;
    const REQUEST = { value };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiServicesChangeRequestServiceV1.getClassName(), 'executeOne', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }
  
  loadFormData(value: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/load-form-data`;
    const REQUEST = { value };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiServicesChangeRequestServiceV1.getClassName(), 'loadFormData', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

}
