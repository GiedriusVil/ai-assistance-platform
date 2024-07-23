/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  LocalStorageServiceV1,
} from '.';

import {
  CHAT_APP_BUTTON_EVENT,
  _debugX,
  _errorX,
} from 'client-utils';

const WBC_CHAT_PATH = '/wbc-chat-app-v3';

const KEY_ACA_CHAT_APP_V3_STATE = 'aiap-chat-app-v3-state';
const KEY_ACA_WIDGET_OPTIONS_DEFAULT = 'aiap-widget-options-default';

const STATE_PARAMETERS = {
  OPENED: 'opened',
  WINDOW_POSITION: 'windowPosition',
  WINDOW_SIZE: 'windowSize',
  TOP: 'top',
  LEFT: 'left',
  HEIGHT: 'height',
  WIDTH: 'width',
};
@Injectable()
export class ChatWidgetServiceV1 {

  static getClassName() {
    return 'ChatWidgetServiceV1';
  }

  constructor(
    private localStorageService: LocalStorageServiceV1,
  ) { }

  handleChatWindowOpenEvent(data: any) {
    this.localStorageService.setChatAppStateParameter(STATE_PARAMETERS.OPENED, data);
    const EVENT = {
      type: CHAT_APP_BUTTON_EVENT.SHOW_BUTTON,
      data: false
    };
    setTimeout(() => {
      // SAST_FIX ['postMessage']
      window['postMessage'](EVENT, '*')
    }, 0);
  }

  handleChatWindowCloseEvent(data: any) {
    this.localStorageService.setChatAppStateParameter(STATE_PARAMETERS.OPENED, !data);
    const EVENT = {
      type: CHAT_APP_BUTTON_EVENT.SHOW_BUTTON,
      data: true
    };
    setTimeout(() => {
      // SAST_FIX ['postMessage']
      window['postMessage'](EVENT, '*')
    }, 0);
  }

  handleChatWindowMoveEvent(data: any) {
    this.localStorageService.setChatAppStatePositionParameter(STATE_PARAMETERS.TOP, data.top);
    this.localStorageService.setChatAppStatePositionParameter(STATE_PARAMETERS.LEFT, data.left);
  }

  destroy(subscription: Subscription) {
    subscription.unsubscribe();
  }

  calculateChatWindowPosition() {
    this.localStorageService.setChatAppStatePositionParameter(
      STATE_PARAMETERS.LEFT,
      window.innerWidth - this.localStorageService.getChatAppStateSizeParameter(STATE_PARAMETERS.WIDTH) - 50
    );

    this.localStorageService.setChatAppStatePositionParameter(
      STATE_PARAMETERS.TOP,
      window.innerHeight - this.localStorageService.getChatAppStateSizeParameter(STATE_PARAMETERS.HEIGHT) - 150
    );
  }

  reloadWidgetOptions(widgetOptionsInput: any) {
    let widgetOptionsDefault;
    let widgetOptionsWindow;
    let widgetOptionsLocalStorage;
    let stateExists = false;
    let tmpWidgetOptions;
    try {
      widgetOptionsLocalStorage = this.getWidgetOptionsFromLocalStorage();
      widgetOptionsDefault = this.getWidgetOptionsDefault();
      widgetOptionsWindow = ramda.path(['acaWidgetOptions'], window);

      if (
        !lodash.isEmpty(widgetOptionsLocalStorage)
      ) {
        stateExists = true;
        tmpWidgetOptions = widgetOptionsLocalStorage;
      } else if (
        !lodash.isEmpty(widgetOptionsDefault)
      ) {
        tmpWidgetOptions = widgetOptionsDefault;
      } else if (
        !lodash.isEmpty(widgetOptionsWindow)
      ) {
        tmpWidgetOptions = widgetOptionsWindow;
      } else if (
        !lodash.isEmpty(widgetOptionsInput)
      ) {
        tmpWidgetOptions = widgetOptionsInput;
      }

      const CHAT_APP_STATE = lodash.cloneDeep(tmpWidgetOptions);
      _debugX(ChatWidgetServiceV1.getClassName(), 'reloadWidgetOptions', {
        widgetOptionsDefault,
        widgetOptionsWindow,
        widgetOptionsInput,
        widgetOptionsLocalStorage,
        tmpWidgetOptions,
      });
      this.localStorageService.setItem(KEY_ACA_CHAT_APP_V3_STATE, CHAT_APP_STATE);
      if (!stateExists) {
        this.calculateChatWindowPosition();
      }
    } catch (error) {
      _errorX(ChatWidgetServiceV1.getClassName(), 'reloadWidgetOptions', {
        error,
        widgetOptionsDefault,
        widgetOptionsWindow,
        widgetOptionsInput,
        widgetOptionsLocalStorage,
        tmpWidgetOptions,
      });
    }
  }


  clearWidgetState() {
    window.localStorage.removeItem(KEY_ACA_CHAT_APP_V3_STATE);
  }

  getWidgetOptions() {
    return this.localStorageService.getItem(KEY_ACA_CHAT_APP_V3_STATE);
  }

  getWidgetOptionsFromLocalStorage() {
    return this.localStorageService.getItem(KEY_ACA_CHAT_APP_V3_STATE);
  }

  getWidgetOptionsDefault() {
    let retVal;
    try {
      retVal = this.localStorageService.getItem(KEY_ACA_WIDGET_OPTIONS_DEFAULT);
    } catch (error) {
      _errorX(ChatWidgetServiceV1.getClassName(), 'getWidgetOptionsDefault', {
        error,
        retVal,
      });
    }
    return retVal;
  }

  getChatAppHost() {
    let retVal;
    let chatAppHostByWindowAcaWidgetOptions;
    let chatAppHostByWidgetOptions;
    try {
      chatAppHostByWindowAcaWidgetOptions = ramda.path(['acaWidgetOptions', 'chatAppHost'], window);
      chatAppHostByWidgetOptions = this.getChatAppHostUrl();

      console.log(chatAppHostByWindowAcaWidgetOptions, chatAppHostByWidgetOptions)
      if (
        !lodash.isEmpty(chatAppHostByWindowAcaWidgetOptions)
      ) {
        retVal = chatAppHostByWindowAcaWidgetOptions;
      } else {
        retVal = chatAppHostByWidgetOptions;
      }
      return retVal;
    } catch (error) {
      _errorX(ChatWidgetServiceV1.getClassName(), 'getChatAppHost', {
        error,
        retVal,
        chatAppHostByWindowAcaWidgetOptions,
        chatAppHostByWidgetOptions,
      });
    }
  }

  getChatAppHostUrl() {
    let retVal;
    let chatAppUrlByWindowAcaWidgetOptions;
    let chatAppUrlByDefaultWidgetOptions;
    try {
      chatAppUrlByWindowAcaWidgetOptions = ramda.path(['acaWidgetOptions', 'chatAppHost'], window);
      chatAppUrlByDefaultWidgetOptions = ramda.path(
        ['chatAppHost'],
        this.localStorageService.getItem(KEY_ACA_WIDGET_OPTIONS_DEFAULT)
      );
      if (
        !lodash.isEmpty(chatAppUrlByWindowAcaWidgetOptions)
      ) {
        retVal = chatAppUrlByWindowAcaWidgetOptions;
      } else {
        retVal = chatAppUrlByDefaultWidgetOptions;
      }
      if (lodash.isEmpty(retVal)) {
        return retVal;
      }
      return retVal + WBC_CHAT_PATH;
    } catch (error) {
      _errorX(ChatWidgetServiceV1.getClassName(), 'getChatAppHostUrl', {
        error,
        retVal,
        chatAppUrlByWindowAcaWidgetOptions,
        chatAppUrlByDefaultWidgetOptions,
      });
    }

  }

}
