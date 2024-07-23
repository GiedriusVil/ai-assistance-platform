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

import {
  _debugX,
  _errorX,
} from 'client-utils';

import {
  StorageServiceV2,
  ConfigServiceV2,
  GAcaPropsServiceV1
} from '.';

@Injectable()
export class SessionServiceV2 {

  static getClassName() {
    return 'SessionServiceV2';
  }

  session: any;

  constructor(
    private http: HttpClient,
    private storageService: StorageServiceV2,
    private gAcaPropsService: GAcaPropsServiceV1,
    private configService: ConfigServiceV2,
  ) { }

  authorize() {
    let hostname;
    let requestUrl;
    let request;
    let gAcaProps;
    let token;
    try {
      hostname = this.configService.getHostName();
      requestUrl = `${hostname}/api/chat-server/v1/authorize/session`;
      gAcaProps = this.gAcaPropsService.getGAcaProps();
      token = this.storageService.getConversationToken();
      request = {
        gAcaProps: gAcaProps,
        token: token,
      };
      _debugX(SessionServiceV2.getClassName(), 'authorize', {
        hostname,
        requestUrl,
        request,
      });
      const RET_VAL = this.http.post(requestUrl, request).pipe(
        map((session: any) => {
          this.session = session;
          return session;
        })
      );
      return RET_VAL;
    } catch (error) {
      _errorX(SessionServiceV2.getClassName(), 'authorize', { error });
      throw error;
    }
  }

  getSession() {
    return this.session;
  }

  setSession(session: any) {
    this.session = session;
  }
}
