/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  of,
  Subject
} from 'rxjs';

import {
  catchError,
  takeUntil
} from 'rxjs/operators';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  _errorX
} from 'client-utils';

import {
  LocalStorageServiceV1
} from 'client-services';

import {
  ChatAppButtonConsentService,
  StylesService
} from '.';

const KEY_ACA_WBC_CHAT_APP_BUTTON_STATE = 'aiap-wbc-chat-app-button-state';
const CLIENT_WBC = '/client-wbc'

@Injectable()
export class ChatAppButtonService {

  static getClassName() {
    return 'ChatAppButtonService';
  }

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageServiceV1,
    private stylesService: StylesService,
    private chatAppButtonConsentService: ChatAppButtonConsentService,
  ) { }

  private _destroyed$: Subject<void> = new Subject<void>();

  _state = {
    loaded: {
      wbcChatAppButtonOptionsEngagement: false,
    },
    wbcChatAppButtonOptions: null
  };
  state = lodash.cloneDeep(this._state);

  getWbcChatAppButtonOptions() {
    return this.localStorageService.getItem(KEY_ACA_WBC_CHAT_APP_BUTTON_STATE) ||
      this.state.wbcChatAppButtonOptions;
  }

  setWbcChatAppButtonOptions(options = this.state.wbcChatAppButtonOptions) {
    return this.localStorageService.setItem(KEY_ACA_WBC_CHAT_APP_BUTTON_STATE, options);
  }

  isWbcChatAppButtonOptionsLoaded() {
    return this.state?.loaded?.wbcChatAppButtonOptionsEngagement;
  }

  reloadWbcChatAppButtonOptions(wbcChatAppButtonOptionsInput) {
    let wbcChatAppButtonOptionsEngagement;
    let wbcChatAppButtonOptionsLocalStorage;
    let wbcChatAppButtonOptionsWindow;
    let query;
    let tmpWidgetOptions;
    try {
      wbcChatAppButtonOptionsLocalStorage = this.getWbcChatAppButtonOptions();
      wbcChatAppButtonOptionsWindow = JSON.parse(window?.['aiapChatAppButtonOptions']);
      
      if (
        !lodash.isEmpty(wbcChatAppButtonOptionsWindow)
      ) {
        tmpWidgetOptions = wbcChatAppButtonOptionsWindow;
      } else if (
        !lodash.isEmpty(wbcChatAppButtonOptionsInput)
      ) {
        tmpWidgetOptions = wbcChatAppButtonOptionsInput;
      }
      _debugX(ChatAppButtonService.getClassName(), 'reloadWbcChatAppButtonOptions', {
        wbcChatAppButtonOptionsLocalStorage,
        wbcChatAppButtonOptionsWindow,
        wbcChatAppButtonOptionsInput,
        tmpWidgetOptions
      });
      const URL = `${this.getChatAppButtonHost(wbcChatAppButtonOptionsInput)}/get-wbc-chat-app-button-options`;
      query = {
        engagementId: tmpWidgetOptions?.engagementId,
        tenantId: tmpWidgetOptions?.tenantId,
      };
      this.httpClient.post(URL, query).pipe(
        catchError((error: any) => {
          _errorX(ChatAppButtonService.getClassName(), 'reloadWbcChatAppButtonOptions', { error });
          return of();
        }),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        const WBC_CHAT_APP_BUTTON_OPTIONS_MERGED = ramda.mergeDeepRight(tmpWidgetOptions, response);
        wbcChatAppButtonOptionsInput = WBC_CHAT_APP_BUTTON_OPTIONS_MERGED;
        this.state.wbcChatAppButtonOptions = WBC_CHAT_APP_BUTTON_OPTIONS_MERGED;
        const WBC_CHAT_APP_BUTTON_CONSENT = this.chatAppButtonConsentService.retrieveUserConsent(wbcChatAppButtonOptionsInput?.chatAppButton);
        if (WBC_CHAT_APP_BUTTON_CONSENT) {
          this.setWbcChatAppButtonOptions(WBC_CHAT_APP_BUTTON_OPTIONS_MERGED);
        }
        this.applyCustomCss(WBC_CHAT_APP_BUTTON_OPTIONS_MERGED);
        this.state.loaded.wbcChatAppButtonOptionsEngagement = true;
        _debugX(ChatAppButtonService.getClassName(), 'reloadWbcChatAppButtonOptions', {
          response,
          WBC_CHAT_APP_BUTTON_OPTIONS_MERGED,
        });
      });
    } catch (error) {
      _errorX(ChatAppButtonService.getClassName(), 'reloadWbcChatAppButtonOptions', {
        error,
        wbcChatAppButtonOptionsEngagement,
        wbcChatAppButtonOptionsInput,
        wbcChatAppButtonOptionsLocalStorage,
        tmpWidgetOptions,
      });
    }
  }

  getChatAppButtonHost(wbcChatAppButtonOptionsInput = {}) {
    let retVal;
    let chatAppHostByWindowAcaWidgetOptions;
    let chatAppHostByWidgetOptions;
    try {
      const WINDOW_OPTIONS_PARSED_STRING = JSON.parse(window?.['aiapChatAppButtonOptions']);
      chatAppHostByWindowAcaWidgetOptions = WINDOW_OPTIONS_PARSED_STRING?.chatAppHost;
      chatAppHostByWidgetOptions = this.getWbcChatAppButtonOptions()?.chatAppHost;

      if (
        !lodash.isEmpty(chatAppHostByWindowAcaWidgetOptions)
      ) {
        retVal = chatAppHostByWindowAcaWidgetOptions;
      } else if (
        !lodash.isEmpty(wbcChatAppButtonOptionsInput)
      ) {
        retVal = wbcChatAppButtonOptionsInput;
      } else {
        retVal = chatAppHostByWidgetOptions;
      }
      _debugX(ChatAppButtonService.getClassName(), 'getChatAppButtonHost', {
        chatAppHostByWindowAcaWidgetOptions,
        chatAppHostByWidgetOptions
      });

      return retVal;
    } catch (error) {
      _errorX(ChatAppButtonService.getClassName(), 'getChatAppButtonHost', {
        error,
        retVal,
        chatAppHostByWindowAcaWidgetOptions,
        chatAppHostByWidgetOptions,
      });
    }
  }

  getClientWbcUrl() {
    let retVal;
    let acaChatAppButtonOptions;
    let chatAppButtonUrlByWindowOptions;
    let chatAppUrlByDefaultWidgetOptions;
    try {
      acaChatAppButtonOptions = this.getWbcChatAppButtonOptions();
      const WINDOW_OPTIONS_PARSED_STRING = JSON.parse(window?.['aiapChatAppButtonOptions']);
      chatAppButtonUrlByWindowOptions = WINDOW_OPTIONS_PARSED_STRING?.chatAppHost;
      chatAppUrlByDefaultWidgetOptions = acaChatAppButtonOptions?.chatAppHost;
      if (
        !lodash.isEmpty(chatAppUrlByDefaultWidgetOptions)
      ) {
        retVal = chatAppUrlByDefaultWidgetOptions;
      } else {
        retVal = chatAppButtonUrlByWindowOptions;
      }
      // retVal will be undefined when chat app v1 is used.
      if (lodash.isEmpty(retVal)) {
        retVal = '';
      }
      return retVal + CLIENT_WBC;
    } catch (error) {
      _errorX(ChatAppButtonService.getClassName(), 'getClientWbcUrl', {
        error,
        retVal,
        chatAppButtonUrlByWindowOptions,
        chatAppUrlByDefaultWidgetOptions,
      });
      throw error;
    }
  }

  async applyCustomCss(wbcChatAppButtonOptions) {
    try {
      const CHAT_APP_HOST_URL = this.getChatAppButtonHost();
      const TENANT_ID = wbcChatAppButtonOptions?.tenantId;
      const TENANT_HASH = wbcChatAppButtonOptions?.tenantHash;
      const ENGAGEMENT_ID = wbcChatAppButtonOptions?.engagementId;
      const ASSISTANT_ID = wbcChatAppButtonOptions?.assistantId;
      if (
        lodash.isEmpty(TENANT_ID)
      ) {
        const ACA_ERROR = {
          type: 'VALIDATION_ERROR',
          message: ` Missing required params.tenantId attribute!`
        };
        throw ACA_ERROR;
      }
      await this.stylesService.applyCustomCss({
        tenantId: TENANT_ID,
        tenantHash: TENANT_HASH,
        engagementId: ENGAGEMENT_ID,
        assistantId: ASSISTANT_ID,
        chatAppHostUrl: CHAT_APP_HOST_URL,
      });
    } catch (error) {
      _errorX(ChatAppButtonService.getClassName(), 'applyCustomCss', { error });
    }
  }

  appendChatAppScripts() {

    const CHAT_APP_OPTIONS = this.getWbcChatAppButtonOptions();
    const TENANT_ID = CHAT_APP_OPTIONS?.tenantId;
    const ASSISTANT_ID = CHAT_APP_OPTIONS?.assistantId;
    const ENGAGEMENT_ID = CHAT_APP_OPTIONS?.engagementId;
    const CHAT_APP_HOST_URL = CHAT_APP_OPTIONS?.chatAppHost;

    // [jg] TODO this will replace the below 3 scripts once migration to wbc-chat-app-button is done
    // const WIDGET_OPTIONS_URL = `${CHAT_APP_HOST_URL}/get-widget-options?tenantId=${TENANT_ID}&assistantId=${ASSISTANT_ID}&engagementId=${ENGAGEMENT_ID}`;
    // const WIDGET_URL = `${CHAT_APP_HOST_URL}/get-widget?tenantId=${TENANT_ID}&assistantId=${ASSISTANT_ID}&engagementId=${ENGAGEMENT_ID}`;
    // const WIDGET_DEFAULT_URL = `${CHAT_APP_HOST_URL}/get-widget-default?tenantId=${TENANT_ID}&assistantId=${ASSISTANT_ID}&engagementId=${ENGAGEMENT_ID}`;

    const WIDGET_OPTIONS_URL = `${CHAT_APP_HOST_URL}/v1/get-widget-options?tenantId=${TENANT_ID}&assistantId=${ASSISTANT_ID}&engagementId=${ENGAGEMENT_ID}`;
    const WIDGET_URL = `${CHAT_APP_HOST_URL}/v1/get-widget?tenantId=${TENANT_ID}&assistantId=${ASSISTANT_ID}&engagementId=${ENGAGEMENT_ID}`;
    const WIDGET_DEFAULT_URL = `${CHAT_APP_HOST_URL}/v1/get-widget-default?tenantId=${TENANT_ID}&assistantId=${ASSISTANT_ID}&engagementId=${ENGAGEMENT_ID}`;

    _debugX(ChatAppButtonService.getClassName(), 'appendChatAppScripts', {
      CHAT_APP_OPTIONS,
      CHAT_APP_HOST_URL,
      TENANT_ID,
      ASSISTANT_ID,
      ENGAGEMENT_ID,
      WIDGET_OPTIONS_URL
    });

    return new Promise(resolve => {
      const SHADOW_DOM = document.head;

      const WIDGET_OPTIONS_SCRIPT = document.getElementById('get-widget-options');
      if (!lodash.isElement(WIDGET_OPTIONS_SCRIPT)) {
        const WIDGET_OPTIONS_SCRIPT_EL = document.createElement('script');
        WIDGET_OPTIONS_SCRIPT_EL.id = 'get-widget-options';
        WIDGET_OPTIONS_SCRIPT_EL.type = 'text/javascript';
        WIDGET_OPTIONS_SCRIPT_EL.src = WIDGET_OPTIONS_URL;
        SHADOW_DOM.appendChild(WIDGET_OPTIONS_SCRIPT_EL);
      }

      const WIDGET_SCRIPT = document.getElementById('get-widget');
      if (!lodash.isElement(WIDGET_SCRIPT)) {
        const WIDGET_SCRIPT_EL = document.createElement('script');
        WIDGET_SCRIPT_EL.id = 'get-widget';
        WIDGET_SCRIPT_EL.type = 'text/javascript';
        WIDGET_SCRIPT_EL.src = WIDGET_URL;
        SHADOW_DOM.appendChild(WIDGET_SCRIPT_EL);
      }

      const WIDGET_DEFAULT_SCRIPT = document.getElementById('get-widget-default');
      if (!lodash.isElement(WIDGET_DEFAULT_SCRIPT)) {
        const WIDGET_DEFAULT_EL = document.createElement('script');
        WIDGET_DEFAULT_EL.id = 'get-widget-default';
        WIDGET_DEFAULT_EL.type = 'text/javascript';
        WIDGET_DEFAULT_EL.src = WIDGET_DEFAULT_URL;
        SHADOW_DOM.appendChild(WIDGET_DEFAULT_EL);
      }

      setTimeout(() => {
        resolve(true);
      }, 0);
    });
  }

}
