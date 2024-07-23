/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';

import * as ramda from 'ramda';

import { _debugX } from 'client-shared-utils';

import { SessionServiceV1, EnvironmentServiceV1, BaseServiceV1 } from 'client-shared-services';

@Injectable()
export class ClassificationRulesClassificationsExternalService extends BaseServiceV1 {

  static getClassName() {
    return 'ClassificationRulesClassificationsExternalService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private httpClient: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._host()}/api/v1/classification-rules-classifications-external`;
    return RET_VAL;
  }

  findManySegmentsByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/segments/find-many-by-query`;
    const REQUEST = {
      ...query
    };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(ClassificationRulesClassificationsExternalService.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }


  findManyFamiliesByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/families/find-many-by-query`;
    const REQUEST = {
      ...query
    };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(ClassificationRulesClassificationsExternalService.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }


  findManyClassesByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/classes/find-many-by-query`;
    const REQUEST = {
      ...query
    };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(ClassificationRulesClassificationsExternalService.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }


  findManyCommoditiesByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/commodities/find-many-by-query`;
    const REQUEST = {
      ...query
    };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(ClassificationRulesClassificationsExternalService.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }
}
