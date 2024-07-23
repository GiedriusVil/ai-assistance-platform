/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import * as ramda from 'ramda';

import { _infoX } from "client-utils";

const KEY_ACA_CHAT_APP_V2_STATE = 'aiap-chat-app-v2-state';
const KEY_ACA_CHAT_APP_STATE_POSITION = 'windowPosition';
const KEY_ACA_CHAT_APP_STATE_SIZE = 'windowSize';

@Injectable()
export class LocalStorageServiceV1 {

  static getClassName() {
    return 'LocalStorageServiceV1';
  }

  public getChatAppStateSizeParameter(key) {
    const STATE = this.getItem(KEY_ACA_CHAT_APP_V2_STATE);
    return STATE[KEY_ACA_CHAT_APP_STATE_SIZE][key];
  }

  public setChatAppStateSizeParameter(key, data) {
    const STATE = this.getItem(KEY_ACA_CHAT_APP_V2_STATE);
    STATE[KEY_ACA_CHAT_APP_STATE_SIZE][key] = data;
    this.setItem(KEY_ACA_CHAT_APP_V2_STATE, STATE);
  }


  public getChatAppStatePositionParameter(key) {
    const STATE = this.getItem(KEY_ACA_CHAT_APP_V2_STATE);
    return STATE[KEY_ACA_CHAT_APP_STATE_POSITION][key];
  }

  public setChatAppStatePositionParameter(key, data) {
    const STATE = this.getItem(KEY_ACA_CHAT_APP_V2_STATE);
    STATE[KEY_ACA_CHAT_APP_STATE_POSITION][key] = data;
    this.setItem(KEY_ACA_CHAT_APP_V2_STATE, STATE);
  }


  public getChatAppStateParameter(key) {
    const STATE = this.getItem(KEY_ACA_CHAT_APP_V2_STATE);
    return STATE[key];
  }

  public setChatAppStateParameter(key, data) {
    const STATE = this.getItem(KEY_ACA_CHAT_APP_V2_STATE);
    STATE[key] = data;
    this.setItem(KEY_ACA_CHAT_APP_V2_STATE, STATE);
  }


  public setItem(key, data) {
    window.localStorage.setItem(key, JSON.stringify(data));
  }


  public getItem(key) {
    return JSON.parse(window.localStorage.getItem(key));
  }

  constructor() { }

}
