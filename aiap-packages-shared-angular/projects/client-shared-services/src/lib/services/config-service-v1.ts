/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as lodash from 'lodash';

import dateFormat from 'dateformat';

import {
  _errorX,
  _debugX
} from 'client-shared-utils';

import {
  EnvironmentServiceV1,
} from './environment-service-v1';

@Injectable()
export class ConfigServiceV1 {

  static getClassName() {
    return 'ConfigServiceV1';
  }

  private config: any = {};

  constructor(
    private environmentService: EnvironmentServiceV1,
    private http: HttpClient
  ) { }

  private getData(endpoint: any) {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.get(endpoint, options).toPromise();
  }

  load() {
    return new Promise((resolve, reject) => {
      const ENVIRONMENT = this.environmentService.getEnvironment();
      let host = ENVIRONMENT?.host;
      let url;
      if (lodash.isEmpty(host)) {
        host = ENVIRONMENT?.hostUrl;
        url = `${host}config`;
      } else {
        url = `${host}/api/v1/config`;
      }
      this.getData(url).then((data) => {
        this.config = data;
        _debugX(ConfigServiceV1.getClassName(), 'load',
          {
            this_config: this.config,
          });

        resolve(true);
      });
    });
  }

  getConfig() {
    return this.config;
  }

  acaAppBuildTimestamp() {
    let configuration;
    try {
      configuration = this.getConfig();

      const ACA_APP_BUILD_TIMESTAMP = configuration?.acaAppBuildTimestamp;
      const ACA_APP_BUILD_DATE = new Date(ACA_APP_BUILD_TIMESTAMP * 1000);

      const ACA_APP_BUILD_DATE_FORMATTED = dateFormat(ACA_APP_BUILD_DATE, 'yyyy-mm-dd HH:MM:ss');

      const RET_VAL = `${ACA_APP_BUILD_DATE_FORMATTED}`;
      return RET_VAL;
    } catch (error) {
      _errorX(ConfigServiceV1.getClassName(), 'acaAppBuildTimestamp',
        {
          error,
          configuration,
        });
    }
  }

}
