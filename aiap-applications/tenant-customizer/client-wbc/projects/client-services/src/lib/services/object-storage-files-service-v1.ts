/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

@Injectable({
  providedIn: 'root'
})
export class ObjectStorageFilesServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'ObjectStorageFilesServiceV1';
  }

  constructor(
    private http: HttpClient,
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._host()}/api/v1/object-storage/files`;
    return RET_VAL;
  }

  deleteManyByIds(
    ids: Array<string>,
  ) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = { ids };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(ObjectStorageFilesServiceV1.getClassName(), 'deleteManyByIds',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  findManyByQuery(
    query: {
      filter: {
        search: string,
      }
    }
  ) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = { query };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(ObjectStorageFilesServiceV1.getClassName(), 'findManyByQuery',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  findOneById(
    id: string,
  ) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-id`;
    const REQUEST = { id };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(ObjectStorageFilesServiceV1.getClassName(), 'findOneById',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  saveOne(
    value: any,
  ) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    const REQUEST = { value };
    const REQUEST_OPTIONS = this._requestOptions();

    const REQUEST_BODY: FormData = new FormData();

    REQUEST_BODY.set('value', JSON.stringify(
      {
        id: value?.id,
        bucketId: value?.bucketId,
        reference: value?.reference,
      }
    ));

    const HAS_FILE_AS_BLOB = value?.file instanceof Blob;

    if (
      HAS_FILE_AS_BLOB &&
      value?.file?.name
    ) {
      REQUEST_BODY.append('file', value?.file, value?.file?.name);
    }

    _debugX(ObjectStorageFilesServiceV1.getClassName(), 'saveOne',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    return this.http.post(REQUEST_URL, REQUEST_BODY, REQUEST_OPTIONS);
  }

}
