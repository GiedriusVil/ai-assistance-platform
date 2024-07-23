/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

import * as ramda from 'ramda';

import {
  _debugX,
  decodeAttributeWithBase64,
  encodeAttributeWithBase64,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BrowserServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

@Injectable()
export class EngagementsServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'EngagementsServiceV1';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private httpClient: HttpClient,
    private browserService: BrowserServiceV1,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/engagements`;
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = {
      query: query
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    _debugX(EngagementsServiceV1.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  saveOne(value: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    encodeAttributeWithBase64(value?.styles, 'value');
    const REQUEST = { value };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    _debugX(EngagementsServiceV1.getClassName(), 'saveOne', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  deleteManyByIds(ids: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = { ids };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    _debugX(EngagementsServiceV1.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    return this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
  }

  findOneById(id: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-id`;
    const REQUEST = { id };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    _debugX(EngagementsServiceV1.getClassName(), 'findOneById', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS).pipe(
      map((module: any) => {
        decodeAttributeWithBase64(module?.styles, 'value');
        return module;
      })
    );
    return RET_VAL;
  }

  exportMany(query: any) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);

    const REQUEST_URL = `${this._hostUrl()}/api/v1/engagements-export/engagements?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` // 
      + `field=${SORT_FIELD}&` // 
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}`;

    _debugX(EngagementsServiceV1.getClassName(), 'exportMany', { REQUEST_URL });
    this.browserService.openInNewTab(REQUEST_URL);
  }

  importFromFile(file: File) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/engagements-import/engagements`;
    const REQUEST: FormData = new FormData();
    REQUEST.append('engagementsFile', file, file.name);
    const REQUEST_OPTIONS = this.getAuthHeaders();
    _debugX(EngagementsServiceV1.getClassName(), 'importFromFile', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }
}
