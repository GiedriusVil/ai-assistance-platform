/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

import {
  TranscriptItemMask,
} from 'client-utils';

@Injectable()
export class TranscriptsService extends BaseServiceV1 {

  static getClassName() {
    return 'TranscriptsService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private http: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    let retVal = `${this._hostUrl()}/api/v1/conversations/transcripts`;
    return retVal;
  }

  findOneById(params: any) {
    const PAGINATION_PAGE = params?.pagination?.page;

    const PAGINATION_SIZE = params?.pagination?.size;

    const REQUEST_URL = `${this._hostAndBasePath()}/${params?.id}?` //
      + `system=${params?.showSystemMessages}&`
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}`;

    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(TranscriptsService.getClassName(), 'findOneById', { REQUEST_URL, REQUEST_OPTIONS });
    const RET_VAL = this.http.get(REQUEST_URL, REQUEST_OPTIONS);
    return RET_VAL;
  }

  maskTranscriptMessage(body: TranscriptItemMask) {
    const REQUEST_URL = `${this._hostAndBasePath()}/mask-user-message`;
    const REQUEST = body;
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(TranscriptsService.getClassName(), 'maskTranscriptMessage', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.put(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

}
