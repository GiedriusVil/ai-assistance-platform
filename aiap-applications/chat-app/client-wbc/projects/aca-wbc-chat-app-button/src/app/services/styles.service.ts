/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
} from 'client-utils';

@Injectable()
export class StylesService {

  static getClassName() {
    return 'StylesService';
  }

  static getWbcId() {
    return 'aca-wbc-chat-app-button';
  }

  state = {
    customCssLoaded: false,
  };

  applyCustomCss(params: any) {
    const TENANT_ID = params?.tenantId;
    const TENANT_HASH = params?.tenantHash;
    const ASSISTANT_ID = params?.assistantId;
    const ENGAGEMENT_ID = params?.engagementId;
    const HOST_URL = params?.chatAppHostUrl;
    const CUSTOM_CSS_URL = `${HOST_URL}/style/${ENGAGEMENT_ID}/${TENANT_ID}/${TENANT_HASH}/${ASSISTANT_ID}/custom.chat.min.css`;

    let wbcStyleElLink: HTMLLinkElement;
    try {
      const WBC_ID = `${StylesService.getWbcId()}-styles-engagement`;

      const LINK_EL = document.getElementById(WBC_ID);
      if (lodash.isElement(LINK_EL)) {
        LINK_EL.remove();
      }

      const SHADOW_DOM = document.querySelector(`${StylesService.getWbcId()}`);
      this.state.customCssLoaded = false;

      const ON_LOAD_CSS_SUCCESS = () => {
        this.state.customCssLoaded = true;
        _debugX(StylesService.getClassName(), 'ON_LOAD_CUSTOM_CSS_SUCCESS', {
          this_state: this.state
        });
      };
      const ON_LOAD_CSS_ERROR = () => {
        wbcStyleElLink.remove();
        this.state.customCssLoaded = true;
        _debugX(StylesService.getClassName(), 'ON_LOAD_CUSTOM_CSS_ERROR', {
          this_state: this.state
        });
      };

      wbcStyleElLink = document.createElement('link');
      wbcStyleElLink.id = WBC_ID;
      wbcStyleElLink.rel = 'stylesheet';
      wbcStyleElLink.href = CUSTOM_CSS_URL;
      wbcStyleElLink.addEventListener('load', ON_LOAD_CSS_SUCCESS);
      wbcStyleElLink.addEventListener('error', ON_LOAD_CSS_ERROR);
      SHADOW_DOM.before(wbcStyleElLink);

    } catch (error) {
      _errorX(StylesService.getClassName(), 'applyCustomCss', {
        error,
        wbcStyleElLink
      });
    }
  }

  isCustomCssLoaded() {
    return this.state?.customCssLoaded;
  }

}
