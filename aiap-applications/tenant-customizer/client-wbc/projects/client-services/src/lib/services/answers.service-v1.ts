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
export class AnswersServiceV1 extends BaseServiceV1 {

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    protected http: HttpClient,
    private browserService: BrowserServiceV1,
  ) {
    super(environmentService, sessionService);
  }

  static getClassName(): string {
    return 'AnswersServiceV1';
  }

  findAnswersByQuery(answerStoreId: string, query: any, attachSkills = false) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/answer-stores/${answerStoreId}/answers`;
    const REQUEST = {
      query,
      attachSkills,
    }
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AnswersServiceV1.getClassName(), 'findAnswersByQuery', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  importAnswers(answerStoreId: string, file: File) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/answer-stores/import/${answerStoreId}/answers`;
    const REQUEST_BODY: FormData = new FormData();
    REQUEST_BODY.append('answersFile', file, file.name);
    _debugX(AnswersServiceV1.getClassName(), 'importAnswers',
      {
        REQUEST_URL,
        REQUEST_BODY,
      });

    const RET_VAL = this.http.post(REQUEST_URL, REQUEST_BODY, this._requestOptions());
    return RET_VAL;
  }

  exportAnswers(answerStoreId: string) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/answer-stores/export/${answerStoreId}/answers?token=${this._token()}`;
    _debugX(AnswersServiceV1.getClassName(), 'exportAnswers', { REQUEST_URL });

    const RET_VAL = this.http.get(REQUEST_URL, this._requestOptions());
    return RET_VAL;
  }

  exportAnswersAsJson(answerStoreId: string) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/answer-stores/export/${answerStoreId}/answers?token=${this._token()}`;
    _debugX(AnswersServiceV1.getClassName(), 'exportAnswersAsJson',
      {
        REQUEST_URL
      });

    this.browserService.openInNewTab(REQUEST_URL);
  }

  saveAnswer(answerStoreId: string, answer: any) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/answer-stores/${answerStoreId}/answers/save-one`;
    _debugX(AnswersServiceV1.getClassName(), 'saveAnswer',
      {
        REQUEST_URL,
      });

    const RET_VAL = this.http.post(REQUEST_URL, answer, this._requestOptions());
    return RET_VAL;
  }

  translateAnswer(params) {
    const ANSWER_STORE_ID = params?.answerStoreId;
    const REQUEST_URL = `${this._hostUrl()}/api/v1/answer-stores/${ANSWER_STORE_ID}/answers/translate-one`;
    _debugX(AnswersServiceV1.getClassName(), 'translateAnswer',
      {
        REQUEST_URL,
        params,
      });

    const RET_VAL = this.http.post(REQUEST_URL, params, this._requestOptions());
    return RET_VAL;
  }

  deleteManyByKeys(answerStoreId: string, keys: Array<any>) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/answer-stores/${answerStoreId}/answers/delete-many-by-keys`
    const REQUEST = { keys: keys };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AnswersServiceV1.getClassName(), 'deleteManyByKeys',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  findAnswerStoreReleasesByQuery(answerStoreId: any, query: any) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/answer-stores/${answerStoreId}/releases?`;
    const REQUEST = {
      query,
    }
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AnswersServiceV1.getClassName(), 'findAnswerStoreReleasesByQuery',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  rollbackAnswerStore(id: any, answerStoreReleaseId: any) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/answer-stores/${id}/releases/rollback?`;
    const REQUEST = {
      answerStoreReleaseId,
    }
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AnswersServiceV1.getClassName(), 'rollbackAnswerStore',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  pullAnswerStore(id: any) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/answer-stores/${id}/pull-one?`;
    const REQUEST = {}
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AnswersServiceV1.getClassName(), 'pullAnswerStore',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  exportMany(query: any) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = query?.sort?.field;
    const SORT_DIRECTION = query?.sort?.direction;

    const REQUEST_URL = `${this._hostUrl()}/api/v1/answer-stores/export?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` // 
      + `field=${SORT_FIELD}&` // 
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}`;

    _debugX(AnswersServiceV1.getClassName(), 'exportMany',
      {
        REQUEST_URL,
      });

    this.browserService.openInNewTab(REQUEST_URL);
  }

}
