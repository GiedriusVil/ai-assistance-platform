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
  _debugX
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EnvironmentServiceV1,
  BaseServiceV1,
  BrowserServiceV1,
} from 'client-shared-services';

import {
  ValidationEngagementsServiceV1,
} from '.';

@Injectable()
export class RulesServiceV2 extends BaseServiceV1 {

  static getClassName() {
    return 'RulesServiceV2';
  }

  constructor(
    protected browserService: BrowserServiceV1,
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private validationEngagementsService: ValidationEngagementsServiceV1,
    private httpClient: HttpClient
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/rules-v2`;
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = {
      ...query
    };
    _debugX(RulesServiceV2.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
  }

  findOneById(id: string) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-id`;
    const REQUEST = {
      id
    };
    _debugX(RulesServiceV2.getClassName(), 'findOneById', { REQUEST_URL, REQUEST });
    const RET_VAL = this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
    return RET_VAL;
  }

  loadSaveModalData(id: string) {
    _debugX(RulesServiceV2.getClassName(), 'loadSaveModalData', { id });
    const VALIDATION_ENGAGEMENTS_QUERY = {
      sort: {
        field: 'name',
        direction: 'asc'
      },
      pagination: {
        page: 1,
        size: 1000,
      }
    }
    const FORK_JOIN: any = {};
    if (
      !lodash.isEmpty(id)
    ) {
      FORK_JOIN.rule = this.findOneById(id);
      FORK_JOIN.engagement = this.validationEngagementsService.findOneByRuleId(id);
    } else {
      FORK_JOIN.rule = of(undefined);
      FORK_JOIN.engagement = of(undefined);
    }
    return forkJoin(FORK_JOIN);
  }

  saveOne(ruleV2: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    const REQUEST = {
      ...ruleV2
    };
    _debugX(RulesServiceV2.getClassName(), 'saveOne', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
  }

  deleteManyByIds(ids: string[]) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = { ids };
    _debugX(RulesServiceV2.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
  }

  deleteManyByKeys(keys: string[]) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-keys`;
    const REQUEST = { keys };
    _debugX(RulesServiceV2.getClassName(), 'deleteManyByKeys', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
  }

  exportMany(query: any) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);

    const REQUEST_URL = `${this._hostUrl()}/api/v1/rules-v2/export?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` //
      + `field=${SORT_FIELD}&` //
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}`;

    _debugX(RulesServiceV2.getClassName(), 'exportMany', { REQUEST_URL });
    this.browserService.openInNewTab(REQUEST_URL);
  }

  importFromFile(file: File) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/rules-v2/import`;
    const REQUEST: FormData = new FormData();
    REQUEST.append('rulesV2File', file, file.name);
    _debugX(RulesServiceV2.getClassName(), 'importFromFile', { REQUEST_URL, REQUEST });
    const RET_VAL = this.httpClient.post(REQUEST_URL, REQUEST, this.getAuthHeaders());
    return RET_VAL;
  }
}
