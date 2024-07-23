/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

@Injectable()
export class UnspscService extends BaseServiceV1 {

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    protected httpClient: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  findManyByQuery(query): Observable<any> {
    const PAGINATION = ramda.path(['pagination'], query);
    const SORT = ramda.path(['sort'], query);

    const PAGINATION_SIZE = ramda.pathOr(100, ['size'], PAGINATION);
    const PAGINATION_PAGE = ramda.pathOr(1, ['page'], PAGINATION);

    const SORT_FIELD = ramda.pathOr('name', ['field'], SORT);
    const SORT_DIRECTION = ramda.pathOr('asc', ['direction'], SORT);

    const URL = `${this._hostUrl()}/api/v1/unspsc/segments?`//
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` //
      + `field=${SORT_FIELD}&` //
      + `sort=${SORT_DIRECTION}`;
    return this.httpClient.get(URL, this.getAuthHeaders());
  }

  importSegmentsFile(file: File) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/unspsc-import/segments`;
    const REQUEST_BODY: FormData = new FormData();
    REQUEST_BODY.append('unspscSegmentsFile', file, file.name);
    return this.httpClient.post(REQUEST_URL, REQUEST_BODY, this.getAuthHeaders());
  }

  findOneById(id: any) {
    const URL = `${this._hostUrl()}/api/v1/unspsc/segments/${id}`;
    return this.httpClient.get(URL, this.getAuthHeaders());
  }

  saveUnspscSegment(segment: any) {
    const URL = `${this._hostUrl()}/api/v1/unspsc/segments`;
    return this.httpClient.post(URL, segment, this.getAuthHeaders());
  }

  retrieveUnspscSegmentViewData(params: any) {
    const RET_VAL = forkJoin(
      {
        segment: this.findOneById(params?.id)
      }
    );
    return RET_VAL;
  }

}
