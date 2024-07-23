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
  decodeAttributeWithBase64,
} from 'client-utils';

import {
  ConfigsService,
} from '.'

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

import { map, of } from 'rxjs';

@Injectable()
export class FiltersConfigurationsService extends BaseServiceV1 {

  static getClassName() {
    return 'FiltersConfigurationsService';
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
    let retVal = `${this.configsService.getHost()}/api/v1/live-analytics/filters`;
    return retVal;
  }

  retrieveFilterData(ref: any) {
    let retVal;
    if (
      lodash.isEmpty(ref)
    ) {
      retVal = of(undefined);
    } else {
      retVal = this.findOneByRef(ref)
    }
    return retVal;
  }

  findOneByRef(ref: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-ref`;
    const REQUEST = {
      ref: ref
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    _debugX(FiltersConfigurationsService.getClassName(), 'findOneByRef', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS).pipe(
      map((filter: any) => {
        decodeAttributeWithBase64(filter, 'code')
        return filter;
      })
    );
    return RET_VAL;
  }

  retrieveFilterPayload(ref: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/execute-retrieve-filter-payload`;
    const REQUEST = {
      ref: ref
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    _debugX(FiltersConfigurationsService.getClassName(), 'retrieveFilterPayload', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);

    return RET_VAL;
  }
}
