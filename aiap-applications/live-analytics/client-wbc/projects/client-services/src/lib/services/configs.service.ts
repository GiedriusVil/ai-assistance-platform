/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';


@Injectable()
export class ConfigsService {

  urlHost: string = '';
  urlPath: string = '';

  dashboardRef: string = '';

  language: string = '';

  constructor() { }

  parseConfigs(configs: any) {
    this.urlHost = configs?.host || '';
    this.urlPath = configs?.path ? this.removeFileFromPath(configs.path) : '';
    this.dashboardRef = configs?.dashboardRef || '';

    this.language = configs?.language;
  }

  removeFileFromPath(path: string) {
    const LAST_PATH_SPLIT_INDEX = path.lastIndexOf('/');

    if (LAST_PATH_SPLIT_INDEX === -1) {
      return '';
    }

    return path.slice(0, LAST_PATH_SPLIT_INDEX);
  }

  getHost() {
    return this.urlHost;
  }

  getPath() {
    return this.urlPath;
  }

  getLanguage() {
    return this.language;
  }

  getDashboardRef() {
    return this.dashboardRef;
  }
}
