/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { forkJoin, of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
  UtilsServiceV1,
} from 'client-shared-services';

@Injectable()
export class OrganizationsChangesServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'OrganizationsChangesServiceV1';
  }

  constructor(
    // params-super
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    // params-native
    private http: HttpClient,
    private utilsService: UtilsServiceV1,
  ) {
    super(environmentService, sessionService);
  }


  findManyByQuery(query: any) {
    const DATE_RANGE: any = ramda.path(['filter', 'dateRange'], query);
    const DATE_RANGE_SANITIZED = this.utilsService.sanitizeDateRangeForQuery(DATE_RANGE, this._timezone());
    const QUERY = lodash.cloneDeep(query);
    if (
      !lodash.isEmpty(DATE_RANGE_SANITIZED)
    ) {
      QUERY.filter.dateRange = DATE_RANGE_SANITIZED;
    }
    _debugX(OrganizationsChangesServiceV1.getClassName(), 'findManyByQuery', { QUERY });
    const REQUEST_URL = `${this._hostUrl()}/api/v1/auditor/organizations/find-many-by-query`;
    const REQUEST = {
      ...QUERY
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  loadFilterOptions() {
    const FORK_JOIN: any = {};

    return forkJoin(FORK_JOIN);
  }
}
