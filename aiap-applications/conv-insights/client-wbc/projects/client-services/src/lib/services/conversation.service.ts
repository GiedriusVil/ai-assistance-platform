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
  EnvironmentServiceV1,
  BaseServiceV1,
} from 'client-shared-services';

@Injectable()
export class ConversationService extends BaseServiceV1 {

  static getClassName() {
    return 'ConversationService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private http: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  findManyByQuery(query: any) {
    _debugX(ConversationService.getClassName(), 'findManyByQuery', { query });
    const URL = `${this._hostUrl()}/api/v1/conversations/conversations`;
    return this.http.post(URL, query, this._requestOptions());
  }

  findOneById(conversationId: any) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/conversations/conversations/findOne`;
    const BODY = {
      id: conversationId
    }
    return this.http.post(REQUEST_URL, BODY, this._requestOptions());
  }

  addReview(params: any) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/conversations/conversations/addReview`;
    const REQUEST_BODY = params;
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(ConversationService.getClassName(), 'addReview', { REQUEST_URL, REQUEST_BODY, REQUEST_OPTIONS });
    return this.http.post(REQUEST_URL, REQUEST_BODY, REQUEST_OPTIONS);
  }

  removeReview(params: any) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/conversations/conversations/removeReview`;
    const REQUEST_BODY = params;
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(ConversationService.getClassName(), 'removeReview', { REQUEST_URL, REQUEST_BODY, REQUEST_OPTIONS });
    return this.http.post(REQUEST_URL, REQUEST_BODY, REQUEST_OPTIONS);
  }

  saveTags(params: any) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/conversations/conversations/saveTags`;
    const REQUEST_BODY = params;
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(ConversationService.getClassName(), 'saveTags', { REQUEST_URL, REQUEST_BODY, REQUEST_OPTIONS });
    return this.http.post(REQUEST_URL, REQUEST_BODY, REQUEST_OPTIONS);
  }

  removeTags(params: any) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/conversations/conversations/removeTags`;
    const REQUEST_BODY = params;
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(ConversationService.getClassName(), 'removeTags', { REQUEST_URL, REQUEST_BODY, REQUEST_OPTIONS });
    return this.http.post(REQUEST_URL, REQUEST_BODY, REQUEST_OPTIONS);
  }

  delete(conversationId: any, data: any) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/conversations/conversations/${conversationId}`;
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` },
      body: data
    };
    _debugX(ConversationService.getClassName(), 'delete', { REQUEST_URL, REQUEST_OPTIONS });

    return this.http.delete(REQUEST_URL, REQUEST_OPTIONS);
  }

  deleteManyByIds(conversationIds: string[]) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/conversations/conversations/delete-many-by-ids`;
    const REQUEST_BODY = {
      ids: conversationIds
    };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(ConversationService.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST_BODY, REQUEST_OPTIONS });
    return this.http.post(REQUEST_URL, REQUEST_BODY, REQUEST_OPTIONS);
  }

  deleteByEmployeeId(employeeId: string, data: any) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/conversations/conversations/employee/${employeeId}`;
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` },
      body: data
    };
    _debugX(ConversationService.getClassName(), 'deleteByEmployeeId', { REQUEST_URL, REQUEST_OPTIONS });

    return this.http.delete(REQUEST_URL, REQUEST_OPTIONS);
  }

  getChannels(params: any) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/conversations/conversations/channels`;
    const REQUEST_OPTIONS = this._requestOptions();
    const REQUEST_BODY = params;
    return this.http.post(REQUEST_URL, REQUEST_BODY, REQUEST_OPTIONS);
  }
}
