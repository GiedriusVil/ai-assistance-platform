/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, Observable, of } from 'rxjs';

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
export class UtteranceService extends BaseServiceV1 {

  static getClassName() {
    return 'UtteranceService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    protected httpClient: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  getFilterData(query) {
    _debugX(UtteranceService.getClassName(), 'getFilterData', { query });
    return forkJoin({
      ...(query?.options?.intents && {
        intents: this.getUtterancesTopIntents(query)
      }),
      ...(query?.options?.utterancesTotals && {
        utterancesTotals: this.getUtterancesTotals(query)
      })
    });
  }

  getUtterancesTotals(query): Observable<any> {
    _debugX(UtteranceService.getClassName(), 'getUtterancesTotals', { query });
    const URL = `${this._hostUrl()}/api/v1/conversations/utterance/totals`;
    return this.httpClient.post(URL, query, this.getAuthHeaders());
  }

  getUtterancesTopIntents(query): Observable<any> {
    _debugX(UtteranceService.getClassName(), 'getUtterancesTopIntents', { query });
    if (!query.options.intents) {
      return of();
    }
    const URL = `${this._hostUrl()}/api/v1/conversations/utterance/top-intents`;
    return this.httpClient.post(URL, query, this.getAuthHeaders());
  }

  findManyByQuery(query): Observable<any> {
    _debugX(UtteranceService.getClassName(), 'findManyByQuery', { query });
    const URL = `${this._hostUrl()}/api/v1/conversations/utterance`;
    return this.httpClient.post(URL, query, this.getAuthHeaders());
  }

  ignoreUtterance(id: any = null, feedbackId: any = null, comment: any = null) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/conversations/utterance/${id}`;
    const REQUEST_BODY = {
      status: 'IGNORED',
      feedbackId: feedbackId ? feedbackId : undefined,
      comment: comment
    };
    const RET_VAL = this.httpClient.post(
      REQUEST_URL,
      REQUEST_BODY,
      this.getAuthHeaders()
    );
    return RET_VAL;
  }

  markTopIntentAsFalsePositive(id: any, value: boolean) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/conversations/utterance/${id}`;
    const REQUEST_BODY = {
      falsePositiveValue: value
    }
    const RET_VAL = this.httpClient.post(
      REQUEST_URL,
      REQUEST_BODY,
      this.getAuthHeaders()
    );
    return RET_VAL;
  }
}
