/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  SessionServiceV1,
  BrowserServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

import {
  decodeAttributeWithBase64,
  encodeAttributeWithBase64,
  _debugX,
} from 'client-shared-utils';

@Injectable()
export class ValidationEngagementsServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'ValidationEngagementsServiceV1';
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
    const RET_VAL = `${this._hostUrl()}/api/v1/validation-engagements`;
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = {
      ...query
    };
    _debugX(ValidationEngagementsServiceV1.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
  }

  findManyLiteByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-lite-by-query`;
    const REQUEST = {
      ...query
    };
    _debugX(ValidationEngagementsServiceV1.getClassName(), 'findManyLiteByQuery', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
  }

  findOneByRuleId(ruleId: string) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-rule-id`;
    const REQUEST = {
      ruleId,
    };
    _debugX(ValidationEngagementsServiceV1.getClassName(), 'findOneByRuleId', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
  }

  findOneById(id: string) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-id`;
    const REQUEST = {
      id
    };
    _debugX(ValidationEngagementsServiceV1.getClassName(), 'findOneById', { REQUEST_URL, REQUEST });
    let retVal = of(undefined);
    if (
      !lodash.isEmpty(id)
    ) {
      retVal = this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders()).pipe(
        map((validationEngagement: any) => {
          decodeAttributeWithBase64(validationEngagement?.schema, 'value');
          return validationEngagement;
        })
      );
    }
    return retVal;
  }

  saveOne(validationEngagement: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    encodeAttributeWithBase64(validationEngagement?.schema, 'value');
    const REQUEST = {
      ...validationEngagement
    };
    _debugX(ValidationEngagementsServiceV1.getClassName(), 'saveOne', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
  }

  deleteManyByKeys(keys: string[]) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-keys`;
    const REQUEST = { keys };
    _debugX(ValidationEngagementsServiceV1.getClassName(), 'deleteManyByKeys', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
  }

  getPathsById(id: string) {
    const REQUEST_URL = `${this._hostAndBasePath()}/get-paths-by-id`;
    const REQUEST = {
      id
    };
    _debugX(ValidationEngagementsServiceV1.getClassName(), 'getPathsById', { REQUEST_URL, REQUEST });
    const RET_VAL = this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
    return RET_VAL;
  }

  exportMany(query: any) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);

    const REQUEST_URL = `${this._hostUrl()}/api/v1/validation-engagements/export?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` //
      + `field=${SORT_FIELD}&` //
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}`;

    _debugX(ValidationEngagementsServiceV1.getClassName(), 'exportMany', { REQUEST_URL });
    this.browserService.openInNewTab(REQUEST_URL);
  }

  importFromFile(file: File) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/validation-engagements/import`;
    const REQUEST: FormData = new FormData();
    REQUEST.append('validationEngagementsFile', file, file.name);
    _debugX(ValidationEngagementsServiceV1.getClassName(), 'importFromFile', { REQUEST_URL, REQUEST });
    const RET_VAL = this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
    return RET_VAL;
  }
}
