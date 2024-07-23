/*
  © Copyright IBM Corporation 2022. All Rights Reserved 

  SPDX-License-Identifier: EPL-2.0
*/
import {
  NgZone,
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
} from '@angular/router';


import * as lodash from 'lodash';

import {
  BaseViewV1,
} from '../base-view-v1/base-view-v1';

import {
  _debugX,
  _errorX,
  retrieveViewWBCConfigurationFromSession
} from 'client-shared-utils';

import {
  SessionServiceV1,
} from 'client-shared-services';

export abstract class BaseViewWithWbcLoaderV1 extends BaseViewV1 {

  static getClassName() {
    return 'BaseViewWithWbcLoaderV1';
  }

  _state: any = {
    activatedRoute: undefined,
    router: undefined,
    wbc: {
      host: undefined,
      path: undefined,
      tag: undefined,
    },
  }
  state = lodash.cloneDeep(this._state);

  _params = {};
  params = lodash.cloneDeep(this._params);

  constructor(
    protected ngZone: NgZone,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected sessionService: SessionServiceV1,
  ) {
    super();
  }

  loadWBCView(component: string) {
    try {
      const SESSION = this.sessionService.getSession();
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, component);
      const STATE_NEW = lodash.cloneDeep(this.state);

      STATE_NEW.wbc = WBC;
      STATE_NEW.activatedRoute = this.activatedRoute;
      STATE_NEW.router = this.router;
      STATE_NEW.ngZone = this.ngZone;

      _debugX(BaseViewWithWbcLoaderV1.getClassName(), `loadConfiguration`,
        {
          STATE_NEW,
          SESSION,
          WBC,
        });

      this.state = STATE_NEW;
    } catch (error) {
      _errorX(BaseViewWithWbcLoaderV1.getClassName(), 'loadConfiguration',
        {
          error,
        });
      throw error;
    }
  }

  public applicationLoadingText() {
    return `Waiting for application ${this.state?.wbc?.tag} to load from ${this.state?.wbc?.host}${this.state?.wbc?.path}!`;
  }

  public url() {
    const RET_VAL = this.state?.wbc?.host + this.state?.wbc?.path;
    return RET_VAL;
  }

}
