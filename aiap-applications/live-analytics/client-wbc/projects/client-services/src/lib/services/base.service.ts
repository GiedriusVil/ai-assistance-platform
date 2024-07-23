/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';

import {
  EnvironmentServiceV1,
  SessionServiceV1
} from 'client-shared-services';

export class BaseServiceV1 {

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
  ) {
    this.environmentService = environmentService;
    this.sessionService = sessionService;
  }

  protected getAuthHeaders() {
    const RET_VAL = this.sessionService.getAuthHeaders();
    return RET_VAL;
  }

  protected _timezone() {
    const USER = this.sessionService.getUser();
    const RET_VAL = USER?.timezone;
    return RET_VAL;
  }

  protected getSession() {
    const RET_VAL = this.sessionService.getSession();
    return RET_VAL;
  }

  protected _hostUrl() {
    const ENVIRONMENT = this.environmentService.getEnvironment();
    let retVal = ENVIRONMENT.host;
    return retVal;
  }

  protected _token() {
    const RET_VAL = this.sessionService.getToken();
    return RET_VAL;
  }

  protected _session() {
    const RET_VAL = this.sessionService.getSession();
    return RET_VAL;
  }

  protected _sessionAssistants() {
    const RET_VAL = this.sessionService.getAssistants();
    return RET_VAL;
  }

  protected _requestOptions() {
    const RET_VAL = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return RET_VAL;
  }

}
