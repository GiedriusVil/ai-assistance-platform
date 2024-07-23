/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { filter, share } from 'rxjs/operators';

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

const WBC_CHAT_PATH = '/wbc-chat-app';

const KEY_ACA_CHAT_APP_V2_STATE = 'aiap-chat-app-v2-state';
const KEY_ACA_WIDGET_OPTIONS_DEFAULT = 'aiap-widget-options-default';

const STATE_PARAMETES = {
  VIEWS: 'views',
  OPENED: 'opened',
  MINIMIZED: 'minimized',
  WINDOW_POSITION: 'windowPosition',
  WINDOW_SIZE: 'windowSize',
  TOP: 'top',
  TOP_BEFORE_MINIMIZE: 'topBeforeMinimize',
  HEIGHT: 'height',
  HEIGHT_BEFORE_MINIMIZE: 'heightBeforeMinimize',
  WIDTH: 'width',
  LEFT: 'left',
  LEFT_BEFORE_MINIMIZE: 'leftBeforeMinimize',
  LEFT_PANEL_OPENED: 'leftPanelOpened',
  LEFT_PANEL_WIDTH: 'leftPanelWidth',
  PREVIEW_MODE: 'previewMode',
};
@Injectable()
export class ChatWidgetServiceV1 {

  static getClassName() {
    return 'ChatWidgetServiceV1';
  }

  _views = [
    {
      name: 'app-main-view',
      isActive: false,
    },
    {
      name: 'aca-basket-view',
      isActive: false,
    },
    {
      name: 'aca-loading-view',
      isActive: true,
    },
    {
      name: 'aca-authorization-error-view',
      isActive: false,
    },
  ];

  static EVENT = {
    CHAT_WINDOW_INITIALIZED: 'chatWindowInitialized',
    CHAT_WINDOW_OPEN: 'chatWindowOpen',
    CHAT_WINDOW_CLOSE: 'chatWindowClose',
    CHAT_WINDOW_MINIMIZE: 'chatWindowMinimize',
    CHAT_VIEW_CHANGE: 'chatViewChange',
    LEFT_PANEL_OPEN: 'leftPanelOpen',
    LEFT_PANEL_CLOSE: 'leftPanelClose',
    CHAT_PREVIEW_MODE: 'chatPreviewMode',
  }

  observable: Observable<any>;
  observer: Observer<any>;

  constructor(
    private localStorageService: LocalStorageServiceV1,
  ) {
    this.observable = new Observable<any>((observer: Observer<any>) => {
      this.observer = observer;
    }).pipe(share());
  }

  subscribe(callback: any): Subscription {
    const RET_VAL = this.observable.subscribe(callback);
    return RET_VAL;
  }

  broadcast(type: string, data: any) {
    if (type === ChatWidgetServiceV1.EVENT.CHAT_WINDOW_INITIALIZED) {
      this.handleChatWindowInitializedEvent(data);
    }
    if (type === ChatWidgetServiceV1.EVENT.CHAT_WINDOW_OPEN) {
      this.handleChatWindowOpenEvent(data);
    }
    if (type === ChatWidgetServiceV1.EVENT.CHAT_WINDOW_CLOSE) {
      this.handleChatWindowCloseEvent(data);
    }
    if (type === ChatWidgetServiceV1.EVENT.CHAT_PREVIEW_MODE) {
      this.handleChatPreviewModeEvent(data);
    }
    if (type === ChatWidgetServiceV1.EVENT.LEFT_PANEL_OPEN) {
      this.handleLeftPanelOpenEvent(data);
    }
    if (type === ChatWidgetServiceV1.EVENT.LEFT_PANEL_CLOSE) {
      this.handleLeftPanelCloseEvent(data);
    }
    if (type === ChatWidgetServiceV1.EVENT.CHAT_WINDOW_MINIMIZE) {
      this.handleChatWindowMinimizeEvent(data);
    }
    if (type === ChatWidgetServiceV1.EVENT.CHAT_VIEW_CHANGE) {
      this.handleChatViewChangeEvent(data);
    }
    if (this.observer != null) {
      const EVENT = {
        type: type,
        data: data,
      };
      this.observer.next(EVENT);
    }
  }

  handleChatWindowInitializedEvent(data) {
    this.handleChatViewChangeEvent('app-main-view');
  }

  resetChatView() {
    this.handleChatViewChangeEvent('aca-loading-view');
  }

  handleChatViewChangeEvent(name) {
    const VIEWS = this.localStorageService.getChatAppStateParameter(STATE_PARAMETES.VIEWS);
    VIEWS.forEach(view => {
      if (view.name === name) {
        view.isActive = true;
      } else {
        view.isActive = false;
      }
    });

    this.localStorageService.setChatAppStateParameter(STATE_PARAMETES.VIEWS, VIEWS);
  }

  handleChatWindowOpenEvent(data) {
    this.localStorageService.setChatAppStateParameter(STATE_PARAMETES.OPENED, data);
    const EVENT = {
      type: CHAT_APP_BUTTON_EVENT.SHOW_BUTTON,
      data: false
    };
    setTimeout(() => {
      // SAST_FIX ['postMessage']
      window['postMessage'](EVENT, '*')
    }, 0);
  }

  handleChatWindowCloseEvent(data) {
    this.localStorageService.setChatAppStateParameter(STATE_PARAMETES.OPENED, !data);
    this.resetChatView();
    const EVENT = {
      type: CHAT_APP_BUTTON_EVENT.SHOW_BUTTON,
      data: true
    };
    setTimeout(() => {
      // SAST_FIX ['postMessage']
      window['postMessage'](EVENT, '*')
    }, 0);
  }

  handleChatPreviewModeEvent(data) {
    this.localStorageService.setChatAppStateParameter(STATE_PARAMETES.OPENED, data);
    this.localStorageService.setChatAppStateParameter(STATE_PARAMETES.PREVIEW_MODE, data);
  }

  handleLeftPanelOpenEvent(data) {
    this.localStorageService.setChatAppStateParameter(STATE_PARAMETES.LEFT_PANEL_OPENED, data);
  }

  handleLeftPanelCloseEvent(data) {
    this.localStorageService.setChatAppStateParameter(STATE_PARAMETES.LEFT_PANEL_OPENED, !data);
  }

  handleChatWindowMinimizeEvent(data) {
    this.localStorageService.setChatAppStateParameter(STATE_PARAMETES.MINIMIZED, data);
    //this.widgetOptions.minimized = data;
    if (this.localStorageService.getChatAppStateParameter(STATE_PARAMETES.MINIMIZED)) {
      // if (this.widgetOptions.minimized) {
      this.localStorageService.setChatAppStatePositionParameter(
        STATE_PARAMETES.TOP_BEFORE_MINIMIZE,
        this.localStorageService.getChatAppStatePositionParameter(STATE_PARAMETES.TOP)
      );
      //this.widgetOptions.windowPosition.topBeforeMinimize = this.widgetOptions.windowPosition.top;
      this.localStorageService.setChatAppStateSizeParameter(
        STATE_PARAMETES.HEIGHT_BEFORE_MINIMIZE,
        this.localStorageService.getChatAppStateSizeParameter(STATE_PARAMETES.HEIGHT)
      );
      //this.widgetOptions.windowSize.heightBeforeMinimize = this.widgetOptions.windowSize.height;
      this.localStorageService.setChatAppStatePositionParameter(
        STATE_PARAMETES.LEFT_BEFORE_MINIMIZE,
        this.localStorageService.getChatAppStatePositionParameter(STATE_PARAMETES.LEFT)
      );
      //this.widgetOptions.windowPosition.leftBeforeMinimize = this.widgetOptions.windowPosition.left;
      this.localStorageService.setChatAppStatePositionParameter(
        STATE_PARAMETES.TOP,
        window.innerHeight - 50
      );
      //this.widgetOptions.windowPosition.top = window.innerHeight - 50;
      this.localStorageService.setChatAppStateSizeParameter(
        STATE_PARAMETES.HEIGHT,
        50
      );
      //this.widgetOptions.windowSize.height = 50;
    } else {
      this.localStorageService.setChatAppStatePositionParameter(
        STATE_PARAMETES.TOP,
        this.localStorageService.getChatAppStatePositionParameter(STATE_PARAMETES.TOP_BEFORE_MINIMIZE)
      );
      //this.widgetOptions.windowPosition.top = this.widgetOptions.windowPosition.topBeforeMinimize;
      this.localStorageService.setChatAppStateSizeParameter(
        STATE_PARAMETES.HEIGHT,
        this.localStorageService.getChatAppStateSizeParameter(STATE_PARAMETES.HEIGHT_BEFORE_MINIMIZE)
      );
      //this.widgetOptions.windowSize.height = this.widgetOptions.windowSize.heightBeforeMinimize;
    }
    //this.localStorageService.setItem(KEY_ACA_CHAT_APP_STATE, this.widgetOptions);
  }

  destroy(subscription: Subscription) {
    subscription.unsubscribe();
  }

  calculateChatWindowPosition() {
    this.localStorageService.setChatAppStatePositionParameter(
      STATE_PARAMETES.LEFT,
      window.innerWidth - this.localStorageService.getChatAppStateSizeParameter(STATE_PARAMETES.WIDTH) - 50
    );
    //this._state.widgetOptions.windowPosition.left = window.innerWidth - this._state.widgetOptions.windowSize.width - 50;
    this.localStorageService.setChatAppStatePositionParameter(
      STATE_PARAMETES.TOP,
      window.innerHeight - this.localStorageService.getChatAppStateSizeParameter(STATE_PARAMETES.HEIGHT) - 150
    );
    //this._state.widgetOptions.windowPosition.top = window.innerHeight - this._state.widgetOptions.windowSize.height - 150;
    // if (this._state.widgetOptions.minimized) {
    //   this._state.widgetOptions.windowPosition.left = this._state.widgetOptions.windowPosition.leftBeforeMinimize;
    //   this._state.widgetOptions.windowPosition.top = window.innerHeight - 50;
    // }
  }

  reloadWidgetOptions(widgetOptionsInput) {
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
      if (
        tmpWidgetOptions &&
        !tmpWidgetOptions.views
      ) {
        tmpWidgetOptions.views = this._views;
      }
      const CHAT_APP_STATE = lodash.cloneDeep(tmpWidgetOptions);
      _debugX(ChatWidgetServiceV1.getClassName(), 'reloadWidgetOptions', {
        widgetOptionsDefault,
        widgetOptionsWindow,
        widgetOptionsInput,
        widgetOptionsLocalStorage,
        tmpWidgetOptions,
      });
      this.localStorageService.setItem(KEY_ACA_CHAT_APP_V2_STATE, CHAT_APP_STATE);
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
    window.localStorage.removeItem(KEY_ACA_CHAT_APP_V2_STATE);
  }

  getWidgetOptions() {
    return this.localStorageService.getItem(KEY_ACA_CHAT_APP_V2_STATE);
  }

  getWidgetOptionsFromLocalStorage() {
    return this.localStorageService.getItem(KEY_ACA_CHAT_APP_V2_STATE);
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

  setChatWindowPosition(top: any, left: any) {
    this.localStorageService.setChatAppStatePositionParameter(
      STATE_PARAMETES.TOP,
      top
    );
    //this.widgetOptions.windowPosition.top = top;
    this.localStorageService.setChatAppStatePositionParameter(
      STATE_PARAMETES.LEFT,
      left
    );
    //this.widgetOptions.windowPosition.left = left;
    //this.localStorageService.setItem(KEY_ACA_CHAT_APP_STATE, this.widgetOptions);
  }

  setChatWindowSize(height: any, width: any) {
    this.localStorageService.setChatAppStateSizeParameter(
      STATE_PARAMETES.HEIGHT,
      height
    );
    //this.widgetOptions.windowSize.height = height;
    this.localStorageService.setChatAppStateSizeParameter(
      STATE_PARAMETES.WIDTH,
      width
    );
    //this.widgetOptions.windowSize.width = width;
    //this.localStorageService.setItem(KEY_ACA_CHAT_APP_STATE, this.widgetOptions);
  }

  setChatWindowMinimized(minimized) {
    this.localStorageService.setChatAppStateParameter(
      STATE_PARAMETES.MINIMIZED,
      minimized
    );
    //this.widgetOptions.minimized = minimized;
    if (!this.localStorageService.getChatAppStateParameter(STATE_PARAMETES.MINIMIZED)) {
      // if (!this.widgetOptions.minimized) {
      this.localStorageService.setChatAppStatePositionParameter(
        STATE_PARAMETES.TOP,
        this.localStorageService.getChatAppStatePositionParameter(STATE_PARAMETES.TOP_BEFORE_MINIMIZE)
      );
      //this.widgetOptions.windowPosition.top = this.widgetOptions.windowPosition.topBeforeMinimize;
      this.localStorageService.setChatAppStateSizeParameter(
        STATE_PARAMETES.HEIGHT,
        this.localStorageService.getChatAppStateSizeParameter(STATE_PARAMETES.HEIGHT_BEFORE_MINIMIZE)
      );
      //this.widgetOptions.windowSize.height = this.widgetOptions.windowSize.heightBeforeMinimize;
    }
    //this.localStorageService.setItem(KEY_ACA_CHAT_APP_STATE, this.widgetOptions);
  }

  getChatAppHost() {
    let retVal;
    let chatAppHostByWindowAcaWidgetOptions;
    let chatAppHostByWidgetOptions;
    try {
      chatAppHostByWindowAcaWidgetOptions = ramda.path(['acaWidgetOptions', 'chatAppHost'], window);
      chatAppHostByWidgetOptions = this.getChatAppHostUrl();
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
      //chatAppUrlByWidgetOptions = this.widgetOptions?.chatAppHost;
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
