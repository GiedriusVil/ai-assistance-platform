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
} from 'client-utils';

import {
  ConfigsService,
} from '.'

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

import { forkJoin, map, of } from 'rxjs';

@Injectable()
export class TilesConfigurationsService extends BaseServiceV1 {

  static getClassName() {
    return 'TilesConfigurationsService';
  }

  constructor(
    protected configsService: ConfigsService,
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private http: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    let retVal = `${this.configsService.getHost()}/api/v1/live-analytics/tiles`;
    return retVal;
  }


  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = query;
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(TilesConfigurationsService.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  saveOne(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    const REQUEST = {
      ...query
    };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(TilesConfigurationsService.getClassName(), 'saveOne', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }

  deleteManyByIds(ids: Array<any>) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = ids;
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(TilesConfigurationsService.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
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
    _debugX(TilesConfigurationsService.getClassName(), 'findOneById', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  findOneByRef(ref: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-ref`;
    const REQUEST = {
      ref: ref
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    _debugX(TilesConfigurationsService.getClassName(), 'findOneByRef', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  retrieveTileFormData(id: any) {
    const FORK_JOIN: any = {};
    if (
      lodash.isEmpty(id)
    ) {
      FORK_JOIN.tile = of(undefined);
    } else {
      FORK_JOIN.tile = this.findOneById(id)
    }
    const RET_VAL = forkJoin(FORK_JOIN);
    return RET_VAL;
  }

}
