/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { EventsServiceV1 } from './events-v1.service';

@Injectable()
export class ConfigsServiceV1 {

  _urlHost = '';
  _urlPath = '';
  _language = '';

  _isTranscript = false;

  constructor(
    private eventsService: EventsServiceV1,
  ) { }

  parseConfigs(configs: any) {
    this._urlHost = configs?.host || '';
    this._urlPath = configs?.path ? this.removeFileFromPath(configs.path) : '';
    this._language = configs?.language;
    this._isTranscript = configs?.isTranscript;

    this.eventsService.eventEmit({ configsUpdated: true });
  }

  removeFileFromPath(path: string) {
    const LAST_PATH_SPLIT_INDEX = path.lastIndexOf('/');

    if (LAST_PATH_SPLIT_INDEX === -1) {
      return '';
    }

    return path.slice(0, LAST_PATH_SPLIT_INDEX);
  }

  getHost() {
    return this._urlHost;
  }

  getPath() {
    return this._urlPath;
  }

  getLanguage() {
    return this._language;
  }

  isTranscript() {
    return this._isTranscript;
  }
}
