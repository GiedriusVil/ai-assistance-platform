/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  encodeAttributeWithBase64,
  decodeAttributeWithBase64,
  convertArrayToQueryParamsString
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BrowserServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

import { map } from 'rxjs';

@Injectable()
export class QueriesConfigurationsService extends BaseServiceV1 {

  static getClassName() {
    return 'QueriesConfigurationsService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private browserService: BrowserServiceV1,
    private http: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/live-analytics/queries`;
    return RET_VAL;
  }


  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = query;
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(QueriesConfigurationsService.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  saveOne(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    encodeAttributeWithBase64(query, 'code');
    const REQUEST = {
      ...query
    };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(QueriesConfigurationsService.getClassName(), 'saveOne', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  deleteManyByIds(ids: Array<any>) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = ids;
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(QueriesConfigurationsService.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  findOneById(id: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-id`;
    const REQUEST = {
      id: id
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    _debugX(QueriesConfigurationsService.getClassName(), 'findOneById', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS).pipe(
      map((query: any) => {
        decodeAttributeWithBase64(query, 'code')
        return query;
      })
    );
    return RET_VAL;
  }

  findOneByRef(ref: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-ref`;
    const REQUEST = {
      ref: ref
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    _debugX(QueriesConfigurationsService.getClassName(), 'findOneByRef', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS).pipe(
      map((query: any) => {
        decodeAttributeWithBase64(query, 'code')
        return query;
      })
    );
    return RET_VAL;
  }

  exportMany(query: any, ids: string[]) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);
    const IDS_QUERY_PARAM = convertArrayToQueryParamsString('ids', ids);

    const REQUEST_URL = `${this._hostUrl()}/api/v1/live-analytics/export/queries?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` // 
      + `field=${SORT_FIELD}&` // 
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}&` //
      + IDS_QUERY_PARAM;

    this.browserService.openInNewTab(REQUEST_URL);
  }

  importFromFile(file: File) {
    const REQUEST: FormData = new FormData();
    REQUEST.append('queriesFile', file, file.name);
    const REQUEST_URL = `${this._hostUrl()}/api/v1/live-analytics/import/queries`;
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    _debugX(QueriesConfigurationsService.getClassName(), 'importFromFile', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

}
