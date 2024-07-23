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
  EnvironmentServiceV1,
  BaseServiceV1,
} from 'client-shared-services';

@Injectable()
export class AiServicesServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'AiServicesServiceV1';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private http: HttpClient,
    private browserService: BrowserServiceV1,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/ai/services`;
    return RET_VAL;
  }

  _hostAndBaseExportPath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/ai/export/services`;
    return RET_VAL;
  }

  _hostAndBaseImportPath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/ai/import/services`;
    return RET_VAL;
  }

  getAiServices() {
    const QUERY = {
      filter: {},
      sort: {
        field: 'id',
        direction: 'desc'
      },
      pagination: {
        page: 1,
        size: 10,
      }
    }
    return this.findManyByQuery(QUERY);
  }

  findManyByQuery(query: any) {
    // TODO -> LEGO -> Temporary fix (Backend is affected with dateRange)
    delete query?.filter?.dateRange;
    //
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = {
      query
    };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiServicesServiceV1.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  syncOneById(id: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/sync-one-by-id`;
    const REQUEST = { id };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiServicesServiceV1.getClassName(), 'refreshOneById', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  saveOne(value: any, options: any = undefined) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    const REQUEST = { value, options };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiServicesServiceV1.getClassName(), 'saveOne', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  deleteManyByIds(ids: Array<any>) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = { ids };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiServicesServiceV1.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  exportMany(query: any) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);

    const REQUEST_URL = `${this._hostAndBaseExportPath()}?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` // 
      + `field=${SORT_FIELD}&` // 
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}`;

    _debugX(AiServicesServiceV1.getClassName(), 'exportMany', { REQUEST_URL });

    this.browserService.openInNewTab(REQUEST_URL);
  }

  importManyFromFile(file: File) {
    const REQUEST_URL = `${this._hostAndBaseImportPath()}`;
    const REQUEST: FormData = new FormData();
    REQUEST.append('aiServicesFile', file, file.name);
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiServicesServiceV1.getClassName(), 'importManyFromFile', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  retrievePullOptions(assistant: any) {
    const ASSISTANT_ID = ramda.path(['id'], assistant);
    const REQUEST_URL = `${this._hostAndBasePath()}/pull-options`;
    const REQUEST = {
      assistant: {
        id: ASSISTANT_ID,
      }
    };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiServicesServiceV1.getClassName(), 'retrievePullOptions', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  rollbackAiSkill(aiServiceId: any, aiSkillReleaseId: any) {
    const REQUEST_URL = `${this._hostUrl()}api/v1/ai/services/${aiServiceId}/skill-releases/rollback-one?`
      + `aiSkillReleaseId=${aiSkillReleaseId}`;
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    _debugX(AiServicesServiceV1.getClassName(), 'rollbackAiSkill', { REQUEST_URL, REQUEST_OPTIONS });
    return this.http.get(REQUEST_URL, REQUEST_OPTIONS);
  }


  loadAiServiceFormData(assistant: any) {
    const SESSION_ASSISTANTS = this.sessionService.getAssistantsByTenant();
    const TYPES = [
      {
        name: 'Watson Assistant (V1)',
        value: 'WA',
      },
      {
        name: 'Watson Assistant (V2)',
        value: 'WA_V2',
      },
      {
        name: 'Chat GPT (V3)',
        value: 'CHAT_GPT_V3',
      },
      {
        name: 'AWS Lex (V2)',
        value: 'AWS_LEX_V2',
      },
      {
        name: '[TBD] / Google Dialog Flows',
        value: 'GOOGLE_DIALOG_FLOWS',
      },

    ];
    const AUTH_TYPES = [
      {
        type: 'basic',
        name: 'Basic',
      },
      {
        type: 'iam',
        name: 'IAM',
      },
    ];
    const FORK_JOIN_SOURCES: any = {
      assistants: of(SESSION_ASSISTANTS),
      types: of(TYPES),
      authTypes: of(AUTH_TYPES),
    };
    const ASSISTANT_ID = assistant?.id;
    if (
      !lodash.isEmpty(ASSISTANT_ID)
    ) {
      FORK_JOIN_SOURCES.pullOptions = this.retrievePullOptions(assistant);
    }
    const RET_VAL = forkJoin(FORK_JOIN_SOURCES);
    return RET_VAL;
  }

}
