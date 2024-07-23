/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
} from 'client-utils';

import {
  ChatWidgetServiceV1,
  ConfigsServiceV1
} from '.';

@Injectable()
export class BoxConnectorServiceV1 {

  static getClassName() {
    return 'BoxConnectorServiceV1';
  }

  constructor(
    protected httpClient: HttpClient,
    private chatWidgetService: ChatWidgetServiceV1,
    private configsService: ConfigsServiceV1,
  ) { }

  retrieveAccessToken(params: any): Observable<any> {
    const REQUEST_URL = `${this._hostUrl()}/box/retrieve-access-token`;
    const REQUEST = { ...params };
    _debugX(BoxConnectorServiceV1.getClassName(), 'retrieveAccessToken', { REQUEST_URL, REQUEST });
    const RET_VAL = this.httpClient.post(REQUEST_URL, REQUEST);
    return RET_VAL;
  }

  private _hostUrl() {
    const BASE_HOST_URL = this.chatWidgetService.getChatAppHostUrl() ?? this.configsService.getHost();
    const RET_VAL = `${BASE_HOST_URL}`;
    return RET_VAL;
  }

}
