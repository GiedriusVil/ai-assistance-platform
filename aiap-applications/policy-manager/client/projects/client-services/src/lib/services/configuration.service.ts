/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentServiceV1 } from 'client-shared-services';

import {
  _debugX,
} from 'client-shared-utils';

@Injectable()
export class ConfigurationService {

  static getClassName() {
    return 'ConfigurationService';
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

  getConfig() {
    return this.config;
  }

  fetch() {
    return new Promise((resolve, reject) => {
      this.getData(`${this.environmentService.getEnvironment().host}/api/config`).then((data) => {
        this.config = data;
        _debugX(ConfigurationService.getClassName(), 'load', { this_config: this.config });
        resolve(true);
      });
    });
  }
}
