/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { _debugX } from 'client-utils';

import {
  StorageServiceV1,
  GAcaPropsServiceV1,
  EnvironmentServiceV1,
} from '.';

@Injectable()
export class SessionServiceV1 {

  static getClassName() {
    return 'SessionServiceV1';
  }

  session: any;

  constructor(
    private http: HttpClient,
    private gAcaPropsService: GAcaPropsServiceV1,
    private storageService: StorageServiceV1,
    private environmentService: EnvironmentServiceV1,
  ) { }

  authorize() {
    const REQUEST_URL = `${this._hostname()}api/chat-server/v1/authorize/session`;
    const G_ACA_PROPS = this.gAcaPropsService.getGAcaProps();

    const TOKEN = this.storageService.getConversationToken();

    const REQUEST = {
      gAcaProps: G_ACA_PROPS,
      token: TOKEN,
    };
    _debugX(SessionServiceV1.getClassName(), 'authorize', { REQUEST_URL, REQUEST });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST).pipe(
      map((session: any) => {
        this.session = session;
        return session;
      })
    );

    return RET_VAL;
  }

  updateSession(session: any) {
    if (!lodash.isEmpty(session)) {
      this.session = session;
    }
    _debugX(SessionServiceV1.getClassName(), 'updateSession', { updated_session: session });
  }

  getSession() {
    return this.session;
  }

  private _hostname() {
    const ENVIRONMENT = this.environmentService.getEnvironment();
    const RET_VAL = `${ENVIRONMENT.hostUrl}`;
    return RET_VAL;
  }

}
