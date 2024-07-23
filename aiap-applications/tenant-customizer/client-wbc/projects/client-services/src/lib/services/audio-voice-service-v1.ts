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
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

@Injectable()
export class AudioVoiceServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'AudioVoiceServiceV1';
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
    const RET_VAL = `${this._hostUrl()}/api/v1/audio-voice-services`;
    return RET_VAL;
  }



  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = { query };
    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(AudioVoiceServiceV1.getClassName(), 'findManyByQuery',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.post(
      REQUEST_URL,
      REQUEST,
      REQUEST_OPTIONS,
    );
    return RET_VAL;
  }

  saveOne(topic: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    const REQUEST = topic;
    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(AudioVoiceServiceV1.getClassName(), 'saveOne',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.post(
      REQUEST_URL,
      REQUEST,
      REQUEST_OPTIONS,
    );
    return RET_VAL;
  }

  findOneById(id: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-id`;
    const REQUEST = { id };
    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(AudioVoiceServiceV1.getClassName(), 'findOneById',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.post(
      REQUEST_URL,
      REQUEST,
      REQUEST_OPTIONS,
    );
    return RET_VAL;
  }

  exportMany(query: any) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);

    const REQUEST_URL = `${this._hostUrl()}/api/v1/audio-voice-services-export/audio-voice-services?` //
      + `size=${PAGINATION_SIZE}&` //
      + `page=${PAGINATION_PAGE}&` // 
      + `field=${SORT_FIELD}&` // 
      + `sort=${SORT_DIRECTION}&` //
      + `token=${this._token()}`;

    _debugX(AudioVoiceServiceV1.getClassName(), 'exportMany',
      {
        REQUEST_URL,
      });
    this.browserService.openInNewTab(REQUEST_URL);
  }

  importFromFile(file: File) {
    const REQUEST_URL = `${this._hostUrl()}/api/v1/audio-voice-services-import/audio-voice-services`;
    const REQUEST: FormData = new FormData();
    REQUEST.append('audioVoiceServicesFile', file, file.name);
    const REQUEST_OPTIONS = this.getAuthHeaders();

    _debugX(AudioVoiceServiceV1.getClassName(), 'importFromFile',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.post(
      REQUEST_URL,
      REQUEST,
      REQUEST_OPTIONS,
    );
    return RET_VAL;
  }

  retrieveAudioVoiceFormData(id: any) {
    const FORK_JOIN: any = {};
    if (
      lodash.isEmpty(id)
    ) {
      FORK_JOIN.audioVoiceService = of(undefined);
    } else {
      FORK_JOIN.audioVoiceService = this.findOneById(id)
    }
    const RET_VAL = forkJoin(FORK_JOIN);
    return RET_VAL;
  }


  deleteManyByIds(ids: Array<any>) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = { ids };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AudioVoiceServiceV1.getClassName(), 'deleteManyByIds',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.post(
      REQUEST_URL,
      REQUEST,
      REQUEST_OPTIONS,
    );
    return RET_VAL;
  }
}
