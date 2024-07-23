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
  BrowserServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
  UtilsServiceV1,
} from 'client-shared-services';

@Injectable()
export class AnswerStoresServiceV1 extends BaseServiceV1 {

  static getClassName(): string {
    return 'AnswerStoresServiceV1';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private utilsService: UtilsServiceV1,
    private http: HttpClient,
    private browserService: BrowserServiceV1,
  ) {
    super(environmentService, sessionService);
  }

  findManyLiteByQuery(
    query: {
      filter: {
        search: any,
        dateRange: {
          from: any,
          to: any,
        }
      },
      pagination: {
        page: any,
        size: any,
      },
      sort: {
        field: any,
        direction: any,
      },
    }
  ) {
    const QUERY = lodash.cloneDeep(query);
    const REQUEST_HEADERS = this._requestOptions();

    const FILTER_DATE_FROM = query?.filter?.dateRange?.from;
    const FILTER_DATE_TO = query?.filter?.dateRange?.to;

    const TIMEZONE = this.utilsService.convertDatesToTimestamps(FILTER_DATE_FROM, FILTER_DATE_TO, this._timezone());

    QUERY.filter.dateRange.from = TIMEZONE?.timestampFrom;
    QUERY.filter.dateRange.to = TIMEZONE?.timestampTo;

    const REQUEST_URL = `${this._hostUrl()}/api/v1/answer-stores/find-many-lite-by-query?`;

    const REQUEST_BODY = {
      query: QUERY,
    };

    _debugX(AnswerStoresServiceV1.getClassName(), 'findManyByQuery',
      {
        REQUEST_URL, REQUEST_BODY, REQUEST_HEADERS
      });

    const RET_VAL = this.http.post(REQUEST_URL, REQUEST_BODY, REQUEST_HEADERS);
    return RET_VAL;
  }

  findOneLiteById(id: any) {
    const REQUEST_HEADERS = this._requestOptions();
    const REQUEST_URL = `${this._hostUrl()}/api/v1/answer-stores/find-one-lite-by-id`;
    const REQUEST_BODY = {
      id: id
    };
    _debugX(AnswerStoresServiceV1.getClassName(), 'findOneById',
      {
        REQUEST_URL
      });

    const RET_VAL = this.http.post(REQUEST_URL, REQUEST_BODY, REQUEST_HEADERS);
    return RET_VAL;
  }

  retrieveSaveAnswerStoreFormData(assistant: any) {
    const SESSION_ASSISTANTS = this.sessionService.getAssistantsByTenant();
    const FORK_JOIN_SOURCES: any = {
      assistants: of(SESSION_ASSISTANTS),
    };
    if (assistant) {
      FORK_JOIN_SOURCES.pullOptions = this.retrievePullOptions(assistant);
    }
    const RET_VAL = forkJoin(FORK_JOIN_SOURCES);
    return RET_VAL;
  }

  pullManyByIds(ids: any) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/answer-stores/pull-many-by-ids`;
    _debugX(AnswerStoresServiceV1.getClassName(), 'pullManyByIds',
      {
        REQUEST_URL,
      });
    const REQUEST_OPTIONS = this._requestOptions();

    const RET_VAL = this.http.post(REQUEST_URL, ids, REQUEST_OPTIONS);
    return RET_VAL;
  }

  retrievePullOptions(assistant: {
    id: any,
    name: any,
  }) {
    const ASSISTANT_ID = assistant?.id;

    const ASSISTANT_NAME = assistant?.name;

    const REQUEST_URL = `${this._hostUrl()}/api/v1/answer-stores/pull-options?` //
      + `assistantId=${ASSISTANT_ID}&` //
      + `assistantName=${ASSISTANT_NAME}`;
    _debugX(AnswerStoresServiceV1.getClassName(), 'retrievePullOptions', { REQUEST_URL });

    const RET_VAL = this.http.get(REQUEST_URL, this._requestOptions());
    return RET_VAL;
  }


  saveOne(store: any) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/answer-stores`;
    _debugX(AnswerStoresServiceV1.getClassName(), 'saveOne', { REQUEST_URL });

    const RET_VAL = this.http.post(REQUEST_URL, store, this._requestOptions());
    return RET_VAL;
  }

  exportMany(query: any) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);

    const REQUEST_URL = `${this._hostUrl()}/api/v1/answer-stores/export?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` // 
      + `field=${SORT_FIELD}&` // 
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}`;

    _debugX(AnswerStoresServiceV1.getClassName(), 'exportMany',
      {
        REQUEST_URL,
      });

    this.browserService.openInNewTab(REQUEST_URL);
  }

  importFromFile(file: File) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/answer-stores/import`;
    const REQUEST: FormData = new FormData();
    REQUEST.append('answersStoresFile', file, file.name);
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AnswerStoresServiceV1.getClassName(), 'importFromFile',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  deleteManyByIds(ids: Array<any>, reason: string) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/answer-stores/delete-many-by-ids`;
    const REQUEST = { ids, reason };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AnswerStoresServiceV1.getClassName(), 'deleteManyByIds',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

}
