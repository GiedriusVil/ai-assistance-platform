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
  UtilsServiceV1,
} from 'client-shared-services';

@Injectable()
export class AiTestsServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'AiTestsServiceV1';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private http: HttpClient,
    private utilsService: UtilsServiceV1,
  ) {
    super(environmentService, sessionService);
  }

  findManyByQuery(query: any) {
    const FILTER_DATE_FROM = query?.filter?.dateRange?.from;
    const FILTER_DATE_TO = query?.filter?.dateRange?.to;
    const FILTER_TEST_ID = query?.filter?.testId;
    const FILTER_TEST_NAME = query?.filter?.testName;
    const TIMEZONE = this.utilsService.convertDatesToTimestamps(FILTER_DATE_FROM, FILTER_DATE_TO, this._timezone());

    const PAGINATION_PAGE = query?.pagination?.page;
    const PAGINATION_SIZE = query?.pagination?.size;

    const SORT_FIELD = query?.sort?.field;
    const SORT_DIRECTION = query?.sort?.direction;

    let url = `${this._hostUrl()}/api/v1/ai/tests?` //
      + `from=${TIMEZONE.timestampFrom}&` //
      + `to=${TIMEZONE.timestampTo}&` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` // 
      + `field=${SORT_FIELD}&` // 
      + `sort=${SORT_DIRECTION}`;

    if (FILTER_TEST_ID) {
      url = `${url}&testId=${FILTER_TEST_ID}`
    };
    if (FILTER_TEST_NAME) {
      url = `${url}&testName=${FILTER_TEST_NAME}`
    };

    return this.http.get(url, this._requestOptions ());
  }

  findManyLiteByQuery(query: any) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/ai/tests/find-many-lite-by-query`;
    const REQUEST = { ...query };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiTestsServiceV1.getClassName(), 'findManyLiteByQuery', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  saveOne(params: any) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/ai/tests`;
    return this.http.post(REQUEST_URL, params, this._requestOptions ());
  }

  deleteOne(id: string) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/ai/tests/${id}`;
    return this.http.delete(REQUEST_URL, this._requestOptions ());
  }

  findOneById(id: any) {
    const URL = `${this._hostUrl()}/api/v1/ai/tests/${id}`;
    return this.http.get(URL, this._requestOptions ());
  }

  findClassReportById(id: any, query: any) {

    const PAGINATION_PAGE = query?.pagination?.page;
    const PAGINATION_SIZE = query?.pagination?.size;

    const SORT_FIELD = query?.sort?.field;
    const SORT_DIRECTION = query?.sort?.direction;

    const URL = `${this._hostUrl()}/api/v1/ai/tests/report/${id}?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` // 
      + `field=${SORT_FIELD}&` // 
      + `sort=${SORT_DIRECTION}`;
    return this.http.get(URL, this._requestOptions ());
  }

  findIncorrectIntentsById(id: any, query: any) {

    const PAGINATION_PAGE = query?.pagination?.page;
    const PAGINATION_SIZE = query?.pagination?.size;

    const SORT_FIELD = query?.sort?.field;
    const SORT_DIRECTION = query?.sort?.direction;

    const URL = `${this._hostUrl()}/api/v1/ai/tests/intents/${id}?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` // 
      + `field=${SORT_FIELD}&` // 
      + `sort=${SORT_DIRECTION}`;
    return this.http.get(URL, this._requestOptions ());
  }

  findTestResultsById(id: any, query: any) {
    const PAGINATION_PAGE = query?.pagination?.page;
    const PAGINATION_SIZE = query?.pagination?.size;

    const SORT_FIELD = query?.sort?.field;
    const SORT_DIRECTION = query?.sort?.direction;

    const URL = `${this._hostUrl()}/api/v1/ai/tests/results/${id}?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` // 
      + `field=${SORT_FIELD}&` // 
      + `sort=${SORT_DIRECTION}`;
    return this.http.get(URL, this._requestOptions ());
  }
}
