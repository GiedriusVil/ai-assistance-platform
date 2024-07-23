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
export class CatalogRulesExternalCatalogsService extends BaseServiceV1 {

  static getClassName() {
    return 'CatalogRulesExternalCatalogsService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private httpClient: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._host()}/api/v1/catalog-rules-external-catalogs`;
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = {
      ...query
    };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(CatalogRulesExternalCatalogsService.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }
}
