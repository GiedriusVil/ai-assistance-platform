/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { detect } from 'detect-browser';

import {
  ParamsServiceV1,
  EnvironmentServiceV1
} from '.';

import * as R from 'ramda';
import { Language, LANG, _debugX } from "client-utils";

@Injectable()
export class ConfigServiceV1 {

  static getClassName() {
    return 'ConfigServiceV1';
  }

  private config = {};
  private jwt = {};

  constructor(
    private http: HttpClient,
    private params: ParamsServiceV1,
    private translateService: TranslateService,
    private environmentService: EnvironmentServiceV1
  ) { }

  private getData(endpoint: any) {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.get(endpoint, options).toPromise();
  }

  getConfig() {
    return this.config;
  }

  setJwt(jwt: any) {
    this.jwt = jwt;
  }

  getJwt() {
    return this.jwt;
  }

  getEnvironment() {
    return R.mergeDeepRight(
      {
        hostname: R.pathOr(window['location']['hostname'], ['hostname'], this.params.get()),
        size: `${window['innerWidth']}x${window['innerHeight']}`,
        language: this.getLanguage()
      },
      detect()
    );
  }

  private getUrlParams(url: string) {
    const params = {};

    const entries = new URLSearchParams(window.location.search);
    entries.forEach((value, key) => {
      let temp: any = value;

      if (value === 'true') temp = true;
      if (value === 'false') temp = false;

      params[key] = temp;
    });

    return params;
  }

  /** Gets browser, user, navigator language */
  getLanguage() {
    const language = window['navigator']['userLanguage'] || window['navigator']['browserLanguage'] || window['navigator']['language'];
    const parts = language.split('-');
    return parts[0];
  }

  setLanguage(language: Language): void {
    this.translateService.addLangs([LANG.EN]);
    this.translateService.setDefaultLang(language);
  }

  load() {
    const ENVIRONMENT = this.environmentService.getEnvironment();
    return new Promise(resolve => {
      this.getData(`${ENVIRONMENT.hostUrl}api/v1/config`)
        .then(response => {
          _debugX(ConfigServiceV1.getClassName(), 'load', {
            configuration: response
          });
          this.set(response);
          setTimeout(() => {
            this.params.set(this.getUrlParams(window.location.search));
            resolve(true);
          }, 0);
        })
        .catch(() => {
          resolve(true);
        });
    });
  }

  get() {
    return this.config;
  }

  set(config: any) {
    this.config = R.mergeDeepRight(this.config, config);
  }
}
