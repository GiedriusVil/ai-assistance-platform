/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { _debugX } from 'client-shared-utils';

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

@Injectable()
export class CommentsService extends BaseServiceV1 {

  static getClassName() {
    return 'CommentsService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private httpClient: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._hostUrl()}/api/comments`;
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = {
      ...query
    };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(CommentsService.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  findOneById(id: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-id`;
    const REQUEST = {
      id
    };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(CommentsService.getClassName(), 'findOneById', { REQUEST_URL, REQUEST, REQUEST_HEADERS });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  deleteOneById(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-one-by-id`;
    const REQUEST = {
      ...query
    };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(CommentsService.getClassName(), 'deleteOneById', { REQUEST_URL, REQUEST, REQUEST_HEADERS });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  saveOne(comment: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    const REQUEST = { ...comment };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(CommentsService.getClassName(), 'saveOne', { REQUEST_URL, REQUEST, REQUEST_HEADERS });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  seenOne(comment: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/seen-one`;
    const REQUEST = { ...comment };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(CommentsService.getClassName(), 'seenOne', { REQUEST_URL, REQUEST, REQUEST_HEADERS });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }
}
