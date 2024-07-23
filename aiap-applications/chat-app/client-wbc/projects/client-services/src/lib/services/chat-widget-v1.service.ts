/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { _debugX, _errorX } from 'client-utils';

import {
  LocalStorageServiceV1
} from '.';

const KEY_ACA_CHAT_APP_V2_STATE = 'aiap-chat-app-v2-state';
const KEY_ACA_WIDGET_OPTIONS_DEFAULT = 'aiap-widget-options-default';

const CLIENT_WBC = '/client-wbc'

@Injectable()
export class ChatWidgetServiceV1 {

  static getClassName() {
    return 'ChatWidgetServiceV1';
  }

  constructor(
    private localStorageService: LocalStorageServiceV1
  ) { }

  getWidgetOptions() {
    return this.localStorageService.getItem(KEY_ACA_CHAT_APP_V2_STATE);
  }


  getChatAppHost() {
    let retVal;

    let acaWidgetOptionsDefault;
    try {
      acaWidgetOptionsDefault = this.localStorageService.getItem(KEY_ACA_WIDGET_OPTIONS_DEFAULT);
      retVal = acaWidgetOptionsDefault?.chatAppHost;
      return retVal;
    } catch (error) {
      _errorX(ChatWidgetServiceV1.getClassName(), 'getChatAppHost', {
        error,
        retVal,
      });
      throw error;
    }
  }

  getClientWbcUrl() {
    let retVal;
    let acaWidgetOptionsDefault;
    let chatAppUrlByWindowAcaWidgetOptions;
    let chatAppUrlByDefaultWidgetOptions;
    try {
      acaWidgetOptionsDefault = this.localStorageService.getItem(KEY_ACA_WIDGET_OPTIONS_DEFAULT);
      chatAppUrlByWindowAcaWidgetOptions = ramda.path(['acaWidgetOptions', 'chatAppHost'], window);
      chatAppUrlByDefaultWidgetOptions = ramda.path(['chatAppHost'], acaWidgetOptionsDefault);
      if (
        !lodash.isEmpty(chatAppUrlByWindowAcaWidgetOptions)
      ) {
        retVal = chatAppUrlByWindowAcaWidgetOptions;
      } else {
        retVal = chatAppUrlByDefaultWidgetOptions;
      }
      // retVal will be undefined when chat app v1 is used.
      if (lodash.isEmpty(retVal)) {
        retVal = '';
      }
      return retVal + CLIENT_WBC;
    } catch (error) {
      _errorX(ChatWidgetServiceV1.getClassName(), 'getClientWbcUrl', {
        error,
        retVal,
        chatAppUrlByWindowAcaWidgetOptions,
        chatAppUrlByDefaultWidgetOptions,
      });
      throw error;
    }
  }

  // TODO [DEPRECATED] In favor of -> getChatAppHost();
  getChatAppHostUrl() {
    const RET_VAL = this.getChatAppHost();
    return RET_VAL;
  }

  // TODO [DEPRECATED] In favor of -> getClientWbcUrl();
  getClientWbcHostUrl() {
    const RET_VAL = this.getClientWbcUrl();
    return RET_VAL;
  }
}
