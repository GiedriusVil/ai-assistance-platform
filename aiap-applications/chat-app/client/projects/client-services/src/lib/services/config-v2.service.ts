/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { detect } from 'detect-browser';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  ParamsServiceV1,
  ChatWidgetServiceV1,
  EnvironmentServiceV1,
} from '.';

import {
  _debugX, _errorX, Language, LANG
} from 'client-utils';

@Injectable()
export class ConfigServiceV2 {

  static getClassName() {
    return 'ConfigServiceV2';
  }

  private config = {};
  private jwt = {};

  constructor(
    private http: HttpClient,
    private paramsService: ParamsServiceV1,
    private translateService: TranslateService,
    private chatWidgetService: ChatWidgetServiceV1,
    private environmentService: EnvironmentServiceV1,
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

  getHostName() {
    const ENVIRONMENT = this.environmentService.getEnvironment();

    let hostByWidgetOptions;
    let hostByEnvironment;
    let retVal;
    try {
      hostByEnvironment = `${ENVIRONMENT.hostUrl}`;
      hostByWidgetOptions = this.chatWidgetService.getChatAppHost();
      if (
        lodash.isEmpty(hostByWidgetOptions)
      ) {
        retVal = hostByEnvironment;
      } else {
        retVal = hostByWidgetOptions;
      }
      _debugX(ConfigServiceV2.getClassName(), 'getHostName', {
        hostByWidgetOptions,
        hostByEnvironment,
        retVal,
      });
      return retVal;
    } catch (error) {
      _errorX(ConfigServiceV2.getClassName(), 'getHostName', { error });
      throw error;
    }
  }

  getEnvironment() {
    return ramda.mergeDeepRight(
      {
        hostname: ramda.pathOr(window['location']['hostname'], ['hostname'], this.paramsService.get()),
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

  async load() {
    let hostname;
    let configuration;
    try {
      hostname = this.getHostName();
      configuration = await this.getData(`${hostname}/api/v1/config`);
      _debugX(ConfigServiceV2.getClassName(), 'load', {
        hostname,
        configuration,
      });
      this.set(configuration);
      this.paramsService.set(this.getUrlParams(window.location.search));
      // setTimeout(() => {}, 0);
    } catch (error) {
      _errorX(ConfigServiceV2.getClassName(), 'load', { error });
      throw error;
    }
  }

  get() {
    return this.config;
  }

  set(config: any) {
    this.config = ramda.mergeDeepRight(this.config, config);
  }




}
