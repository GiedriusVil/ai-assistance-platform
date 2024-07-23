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
  BrowserServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

@Injectable()
export class JobsQueuesServiceV1 extends BaseServiceV1 {

  public types = [
    {
      content: 'BULLMQ',
      value: 'BULLMQ'
    },
    {
      content: 'RABBITMQ (Disabled)',
      value: 'RABBITMQ',
      disabled: true
    }
  ];

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private httpClient: HttpClient,
    private browserService: BrowserServiceV1,
  ) {
    super(environmentService, sessionService);
  }

  static getClassName(): string {
    return 'JobsQueuesServiceV1';
  }

  _hostAndBasePath() {
    let retVal = `${this._hostUrl()}/api/v1/jobs-queues`;
    return retVal;
  }

  findManyByQuery(query: any) {
    _debugX(JobsQueuesServiceV1.getClassName(), 'findManyByQuery', { query });

    const PAGINATION = ramda.path(['pagination'], query);
    const SORT = ramda.path(['sort'], query);

    const PAGINATION_SIZE = ramda.pathOr(100, ['size'], PAGINATION);
    const PAGINATION_PAGE = ramda.pathOr(1, ['page'], PAGINATION);

    const SORT_FIELD = ramda.pathOr('name', ['field'], SORT);
    const SORT_DIRECTION = ramda.pathOr('asc', ['direction'], SORT);

    const FILTER_SEARCH = ramda.path(['filter', 'search'], query);

    let params = `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` //
      + `field=${SORT_FIELD}&` //
      + `sort=${SORT_DIRECTION}`;

    if (FILTER_SEARCH) {
      params = `${params}&search=${FILTER_SEARCH}`;
    }

    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query?${params}`;
    return this.httpClient.get(REQUEST_URL, this.getAuthHeaders());
  }

  saveOne(queue: any) {
    _debugX(JobsQueuesServiceV1.getClassName(), 'saveOne', { queue });
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    return this.httpClient.post(REQUEST_URL, queue, this.getAuthHeaders());
  }

  deleteManyByIds(queuesIds: any) {
    _debugX(JobsQueuesServiceV1.getClassName(), 'deleteManyByIds', { queuesIds });
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    return this.httpClient.post(REQUEST_URL, queuesIds, this.getAuthHeaders());
  }

  findOneById(queueId: any) {
    _debugX(JobsQueuesServiceV1.getClassName(), 'findOneById', { queueId });
    const ID = ramda.path(['id'], queueId);
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-id?id=${ID}`;
    return this.httpClient.get(REQUEST_URL, this.getAuthHeaders());
  }

  exportMany(query: any) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);

    const REQUEST_URL = `${this._hostUrl()}/api/v1/jobs-queues-export/queues?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` //
      + `field=${SORT_FIELD}&` //
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}`;

    _debugX(JobsQueuesServiceV1.getClassName(), 'exportMany', { REQUEST_URL });

    this.browserService.openInNewTab(REQUEST_URL);
  }

  importFromFile(file: File) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/jobs-queues-import/queues`;
    const REQUEST: FormData = new FormData();
    REQUEST.append('jobsQueuesFile', file, file.name);
    const REQUEST_OPTIONS = this.getAuthHeaders();
    _debugX(JobsQueuesServiceV1.getClassName(), 'importFromFile', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

}
