/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, forkJoin, of } from 'rxjs';

import * as lodash from 'lodash';

import { _debugX } from 'client-shared-utils';

import {
  CONDITION_FACTS_USER_PROFILE,
  CONDITION_OPERATORS,
} from '../../../utils/validation';

import { SessionServiceV1, EnvironmentServiceV1, BaseServiceV1 } from 'client-shared-services';

@Injectable()
export class ClassificationRulesConditionsService extends BaseServiceV1 {

  static getClassName() {
    return 'ClassificationRulesConditionsService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private httpClient: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._host()}/api/v1/classification-rules-conditions`;
    return RET_VAL;
  }

  retrieveRuleConditionsTableData() {
    const FORK_JOIN = {
      facts: of(CONDITION_FACTS_USER_PROFILE),
      operators: of(CONDITION_OPERATORS)
    };

    const RET_VAL = forkJoin(FORK_JOIN);
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = {
      ...query
    };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(ClassificationRulesConditionsService.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  findOneById(id: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-id`;
    const REQUEST = {
      id
    };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(ClassificationRulesConditionsService.getClassName(), 'findOneById', { REQUEST_URL, REQUEST, REQUEST_HEADERS });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  saveOne(value: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    const REQUEST = { value };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(ClassificationRulesConditionsService.getClassName(), 'saveOne', { REQUEST_URL, REQUEST, REQUEST_HEADERS });
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  deleteManyByIds(ids: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = { ids };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(ClassificationRulesConditionsService.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST, REQUEST_HEADERS });

    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  loadSaveModalData(id: any) {
    _debugX(ClassificationRulesConditionsService.getClassName(), 'loadSaveModalData', { id });
    const FORK_JOIN: any = {};
    if (
      !lodash.isEmpty(id)
    ) {
      FORK_JOIN.value = this.findOneById(id);
    } else {
      FORK_JOIN.value = of(undefined);
    }
    return forkJoin(FORK_JOIN);
  }

  getConditionFacts(query: any) {
    const RULE_CONDITION_FACTS = [
      ...CONDITION_FACTS_USER_PROFILE,
    ];

    const RET_VAL = of(RULE_CONDITION_FACTS);
    return RET_VAL;
  }

  getConditionOperators(query: any) {
    const RET_VAL = of(CONDITION_OPERATORS);
    return RET_VAL;
  }
}
