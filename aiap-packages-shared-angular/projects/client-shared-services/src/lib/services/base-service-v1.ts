/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
} from './session-service-v1';

import {
  EnvironmentServiceV1,
} from './environment-service-v1';

export class BaseServiceV1 {

  static getClassName() {
    return 'BaseServiceV1';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
  ) {
    this.environmentService = environmentService;
    this.sessionService = sessionService;
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

  protected _host() {
    const ENVIRONMENT = this.environmentService.getEnvironment();
    _debugX(BaseServiceV1.getClassName(), '_host',
      {
        ENVIRONMENT,
      });
    let retVal = ENVIRONMENT.host;
    if (
      lodash.isEmpty(retVal)
    ) {
      retVal = ENVIRONMENT.hostUrl; //Poral uses hostUrl while other apps use host
    }
    return retVal;
  }

  protected _hostUrl() {
    const ENVIRONMENT = this.environmentService.getEnvironment();
    _debugX(BaseServiceV1.getClassName(), '_hostUrl',
      {
        ENVIRONMENT,
      });

    let retVal = ENVIRONMENT.host;
    if (
      lodash.isEmpty(retVal)
    ) {
      retVal = ENVIRONMENT.hostUrl; //Poral uses hostUrl while other apps use host
    }
    return retVal;
  }


  protected _session() {
    const RET_VAL = this.sessionService.getSession();
    return RET_VAL;
  }

  protected _sessionAssistants() {
    const RET_VAL = this.sessionService.getAssistantsByAccessGroup();
    return RET_VAL;
  }

  /** 
   * @deprecated Use the new {@link BaseServiceV1._requestOptions} base class instead.
  */
  protected getAuthHeaders() {
    const RET_VAL = this.sessionService.getAuthHeaders();
    return RET_VAL;
  }


  protected _requestOptions() {
    const RET_VAL = {
      headers: {
        ['Authorization']: `Bearer ${this._token()}`
      }
    };
    return RET_VAL;
  }

  protected _token() {
    const RET_VAL = this.sessionService.getToken();
    return RET_VAL;
  }

}
