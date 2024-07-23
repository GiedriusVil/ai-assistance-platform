/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as ramda from 'ramda';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

import {
  ConfigurationService,
} from '.';

@Injectable()
export class UsersService extends BaseServiceV1 {

  static getClassName() {
    return 'UsersService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private httpClient: HttpClient,
    private configurationService: ConfigurationService,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const CONFIGURATION = this.configurationService.getConfig();
    const PORTAL_ENDPOINT = ramda.path(['app', 'portal', 'endpoint'], CONFIGURATION);
    const RET_VAL = `${PORTAL_ENDPOINT}/users`;
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const PAGINATION = ramda.path(['pagination'], query);
    const PAGINATION_SIZE = ramda.pathOr(100, ['size'], PAGINATION);
    const PAGINATION_PAGE = ramda.pathOr(1, ['page'], PAGINATION);
    const SORT = ramda.path(['sort'], query);
    const SORT_FIELD = ramda.pathOr('name', ['field'], SORT);
    const SORT_DIRECTION = ramda.pathOr('asc', ['direction'], SORT);
    const FILTER = ramda.path(['filter'], query);
    const FILTER_SEARCH = ramda.path(['search'], FILTER);
    const REQUEST_URL =
      `${this._hostAndBasePath()}?` + //
      `size=${PAGINATION_SIZE}&` + //
      `page=${PAGINATION_PAGE}&` + //
      `field=${SORT_FIELD}&` + //
      `sort=${SORT_DIRECTION}&` +
      `search=${FILTER_SEARCH}`;
    const REQUEST_HEADERS = this.getAuthHeaders();
    return this.httpClient.get(REQUEST_URL, REQUEST_HEADERS);
  }
}
