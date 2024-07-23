/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  _errorX
} from 'client-utils';


@Injectable()
export class ChatAppButtonConsentService {

  static getClassName() {
    return 'ChatAppButtonConsentService';
  }

  retrieveUserConsent(chatAppButton) {
    let retVal: boolean = false;
    const ENGAGEMENT_CHAT_APP_BUTTON = chatAppButton;
    try {
      const WINDOW_FUNCTION_RETRIEVE_USER_CONSENT = this.getRetrieveUserConsentFunction(chatAppButton);
      const RESULT_PARAMS_PATH = ENGAGEMENT_CHAT_APP_BUTTON?.consent?.functions?.retrieveUserConsent?.resultParamPath ?? [];
      if (lodash.isFunction(WINDOW_FUNCTION_RETRIEVE_USER_CONSENT)) {
        const EXECUTE_RESULT = WINDOW_FUNCTION_RETRIEVE_USER_CONSENT();
        retVal = ramda.pathOr(false, [...RESULT_PARAMS_PATH], EXECUTE_RESULT);
      } else if (ENGAGEMENT_CHAT_APP_BUTTON?.consent?.fallback) {
        retVal = this.executeRetrieveUserConsentFallbackFunction();
      }
      _debugX(ChatAppButtonConsentService.getClassName(), 'retrieveUserConsent', { retVal });
      return retVal;
    } catch (error) {
      if (ENGAGEMENT_CHAT_APP_BUTTON?.consent?.fallback) {
        retVal = this.executeRetrieveUserConsentFallbackFunction();
      }
      _errorX(ChatAppButtonConsentService.getClassName(), 'retrieveUserConsent', {
        error,
        retVal,
        ENGAGEMENT_CHAT_APP_BUTTON,
      });
      return retVal;
    }
  }

  confirmUserConsent(chatAppButton) {
    const ENGAGEMENT_CHAT_APP_BUTTON = chatAppButton;
    try {
      const WINDOW_FUNCTION_CONFIRM_USER_CONSENT = this.getConfirmUserConsentFunction(chatAppButton);
      const INPUT_PARAMS = ENGAGEMENT_CHAT_APP_BUTTON?.consent?.functions?.confirmUserConsent?.inputParams ?? [];
      if (lodash.isFunction(WINDOW_FUNCTION_CONFIRM_USER_CONSENT)) {
        WINDOW_FUNCTION_CONFIRM_USER_CONSENT(...INPUT_PARAMS);
      } else if (ENGAGEMENT_CHAT_APP_BUTTON?.consent?.fallback) {
        this.executeConfirmUserConsentFallbackFunction();
      }
    } catch (error) {
      _errorX(ChatAppButtonConsentService.getClassName(), 'confirmUserConsent', {
        error,
        ENGAGEMENT_CHAT_APP_BUTTON,
      });
      if (ENGAGEMENT_CHAT_APP_BUTTON?.consent?.fallback) {
        this.executeConfirmUserConsentFallbackFunction();
      }
    }
  }

  getConfirmUserConsentFunction(chatAppButton) {
    const CONSENT_FUNCTIONS = chatAppButton?.consent?.functions;
    const FUNCTION_NAME = CONSENT_FUNCTIONS?.confirmUserConsent?.name;
    const FUNCTION_PATH = CONSENT_FUNCTIONS?.confirmUserConsent?.path ?? [];
    const RET_VAL = ramda.path([...FUNCTION_PATH, FUNCTION_NAME], window);
    return RET_VAL;
  }

  getRetrieveUserConsentFunction(chatAppButton) {
    const CONSENT_FUNCTIONS = chatAppButton?.consent?.functions;
    const FUNCTION_NAME = CONSENT_FUNCTIONS?.retrieveUserConsent?.name;
    const FUNCTION_PATH = CONSENT_FUNCTIONS?.retrieveUserConsent?.path ?? [];
    const RET_VAL = ramda.path([...FUNCTION_PATH, FUNCTION_NAME], window);
    return RET_VAL;
  }

  executeRetrieveUserConsentFallbackFunction() {
    try {
      const EXECUTE_RESULT = window['aiap']?.getUserConsentFromLocalStorage();
      const RET_VAL = ramda.pathOr(false, ['consent', 'chat-app'], EXECUTE_RESULT);
      _debugX(ChatAppButtonConsentService.getClassName(), 'executeRetrieveUserConsentFallbackFunction', { RET_VAL });
      return RET_VAL;
    } catch (error) {
      _errorX(ChatAppButtonConsentService.getClassName(), 'executeRetrieveUserConsentFallbackFunction', { error });
    }
  }

  executeConfirmUserConsentFallbackFunction() {
    try {
      window['aiap']?.setUserConsentToLocalStorage('chat-app', true);
      _debugX(ChatAppButtonConsentService.getClassName(), 'executeConfirmUserConsentFallbackFunction');
    } catch (error) {
      _errorX(ChatAppButtonConsentService.getClassName(), 'executeConfirmUserConsentFallbackFunction', { error });
    }
  }

  consentFunctionsExist(chatAppButton) {
    let retVal = false;
    const CONSENT_CONFIGS = chatAppButton?.consent;
    const WINDOW_FUNCTION_CONFIRM_USER_CONSENT = this.getConfirmUserConsentFunction(chatAppButton);
    const WINDOW_FUNCTION_RETRIEVE_USER_CONSENT = this.getRetrieveUserConsentFunction(chatAppButton);
    if (
      lodash.isFunction(WINDOW_FUNCTION_CONFIRM_USER_CONSENT) &&
      lodash.isFunction(WINDOW_FUNCTION_RETRIEVE_USER_CONSENT)
    ) {
      retVal = true;
    } else {
      _debugX(ChatAppButtonConsentService.getClassName(), 'Consent functions missing!', { CONSENT_CONFIGS });
      if (CONSENT_CONFIGS?.fallback) {
        _debugX(ChatAppButtonConsentService.getClassName(), 'Using fallback consent functions.', { CONSENT_CONFIGS });
        retVal = true;
      }
    }
    return retVal;
  }
}
