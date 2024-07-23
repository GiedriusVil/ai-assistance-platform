/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

@Injectable()
export class AiSkillsServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'AiSkillsServiceV1';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private http: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/ai/skills`;
    return RET_VAL;
  }

  _hostAndBaseImportPath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/ai/import/skills`;
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query?`;
    const REQUEST = { query };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiSkillsServiceV1.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  findOneById(id: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-id`;
    const REQUEST = {
      id: id
    };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiSkillsServiceV1.getClassName(), 'findOneById', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  deleteManyByIds(ids: any, aiServiceId: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = {
      ids: ids,
      aiServiceId: aiServiceId,
    };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiSkillsServiceV1.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  pullOneById(aiSkillId: any, aiServiceId: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/pull-one-by-id`;
    const REQUEST = {
      id: aiSkillId,
      aiServiceId: aiServiceId,
    };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiSkillsServiceV1.getClassName(), 'pullAiSkill', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  syncManyByFiles(files: Array<File>, aiServiceId: any) {
    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_URL = `${this._hostAndBaseImportPath()}/sync-many-by-files?aiServiceId=${aiServiceId}`;
    const REQUEST_BODY: FormData = new FormData();
    for (const file of files) {
      REQUEST_BODY.append('file[]', file, file.name);
    }
    _debugX(AiSkillsServiceV1.getClassName(), 'syncManyByFiles', { REQUEST_HEADERS, REQUEST_URL, REQUEST_BODY });
    return this.http.post(REQUEST_URL, REQUEST_BODY, REQUEST_HEADERS);
  }

  syncManyByIds(ids: any, aiServiceId: any, options: any = {}) {
    const REQUEST_URL = `${this._hostAndBasePath()}/sync-many-by-ids`;
    const REQUEST = {
      ids: ids,
      aiServiceId: aiServiceId,
      options: options,
    };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiSkillsServiceV1.getClassName(), 'syncManyByIds', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  syncOneById(id: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/sync-one-by-id`;
    const REQUEST = { id };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiSkillsServiceV1.getClassName(), 'syncOneById', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  pullManyByIds(ids: any, aiServiceId: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/pull-many-by-ids`;
    const REQUEST = {
      ids: ids,
      aiServiceId: aiServiceId,
    };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiSkillsServiceV1.getClassName(), 'pullManyByIds', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  collectManageOneModalData(id: any) {
    const FORK_JOIN_SOURCES: any = {
      aiSkill: this.findOneById(id),
    };
    const RET_VAL = forkJoin(FORK_JOIN_SOURCES);
    return RET_VAL;
  }

}
