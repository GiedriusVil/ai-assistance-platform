/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

const KEY_ACA_CHAT_APP_V1_STATE = 'aiap-chat-app-v1-state';
const KEY_ACA_CHAT_APP_V2_STATE = 'aiap-chat-app-v2-state';
const KEY_ACA_CHAT_APP_V3_STATE = 'aiap-chat-app-v3-state';
const KEY_ACA_WBC_CHAT_APP_BUTTON_STATE = 'aiap-wbc-chat-app-button-state';
const KEY_ACA_CHAT_APP_STATE_POSITION = 'windowPosition';
const KEY_ACA_CHAT_APP_STATE_SIZE = 'windowSize';

@Injectable()
export class LocalStorageServiceV1 {

  static getClassName() {
    return 'LocalStorageServiceV1';
  }

  public getChatAppStateSizeParameter(key) {
    const STATE = this.getItem(KEY_ACA_CHAT_APP_V2_STATE);
    return STATE[KEY_ACA_CHAT_APP_STATE_SIZE]?.[key];
  }

  public setChatAppStateSizeParameter(key, data) {
    const STATE = this.getItem(KEY_ACA_CHAT_APP_V2_STATE);
    STATE[KEY_ACA_CHAT_APP_STATE_SIZE][key] = data;
    this.setItem(KEY_ACA_CHAT_APP_V2_STATE, STATE);
  }


  public getChatAppStatePositionParameter(key) {
    const STATE = this.getItem(KEY_ACA_CHAT_APP_V2_STATE);
    return STATE[KEY_ACA_CHAT_APP_STATE_POSITION]?.[key];
  }

  public setChatAppStatePositionParameter(key, data) {
    const STATE = this.getItem(KEY_ACA_CHAT_APP_V2_STATE);
    STATE[KEY_ACA_CHAT_APP_STATE_POSITION][key] = data;
    this.setItem(KEY_ACA_CHAT_APP_V2_STATE, STATE);
  }


  public getChatAppStateParameter(key) {
    const STATE = this.getItem(KEY_ACA_CHAT_APP_V2_STATE);
    return STATE?.[key];
  }

  public setChatAppV3StateParameter(key, data) {
    const STATE = this.getItem(KEY_ACA_CHAT_APP_V3_STATE);
    STATE[key] = data;
    this.setItem(KEY_ACA_CHAT_APP_V3_STATE, STATE);
  }

  public getChatAppV3StateParameter(key) {
    const STATE = this.getItem(KEY_ACA_CHAT_APP_V3_STATE);
    return STATE?.[key];
  }

  public setChatAppStateParameter(key, data) {
    const STATE = this.getItem(KEY_ACA_CHAT_APP_V2_STATE);
    STATE[key] = data;
    this.setItem(KEY_ACA_CHAT_APP_V2_STATE, STATE);
  }

  public getChatAppV1StateParameter(key) {
    const STATE = this.getItem(KEY_ACA_CHAT_APP_V1_STATE);
    return STATE?.[key];
  }

  public setChatAppV1StateParameter(key, data) {
    const STATE = this.getItem(KEY_ACA_CHAT_APP_V1_STATE);
    STATE[key] = data;
    this.setItem(KEY_ACA_CHAT_APP_V1_STATE, STATE);
  }

  public getWbcChatAppButtonStateParameter(key) {
    const STATE = this.getItem(KEY_ACA_WBC_CHAT_APP_BUTTON_STATE);
    return STATE?.[key];
  }

  public setWbcChatAppButtonStateParameter(key, data) {
    const STATE = this.getItem(KEY_ACA_WBC_CHAT_APP_BUTTON_STATE);
    STATE[key] = data;
    this.setItem(KEY_ACA_WBC_CHAT_APP_BUTTON_STATE, STATE);
  }

  public setItem(key, data) {
    window.localStorage.setItem(key, JSON.stringify(data));
  }


  public getItem(key) {
    return JSON.parse(window.localStorage.getItem(key));
  }

  constructor() { }

}
