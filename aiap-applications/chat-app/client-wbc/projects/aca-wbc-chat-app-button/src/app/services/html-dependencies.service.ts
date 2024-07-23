/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
} from 'client-utils';

import { AppComponent } from '../app.component';

import { ChatAppButtonService } from '.';

@Injectable()
export class HTMLDependenciesServiceV1 {

  static getClassName() {
    return 'HTMLDependenciesServiceV1';
  }

  state: any = {
    js: {},
    css: {},
  };

  constructor(
    private chatAppButtonService: ChatAppButtonService,
  ) { }


  async loadCSSDependencies() {
    let elementAcaChatAppButton;
    let chatAppButtonHostUrl;
    let wbcAcaChatAppButtonId;
    let elementStylesCSSLink: HTMLLinkElement;
    try {
      wbcAcaChatAppButtonId = AppComponent.getWbcId();
      chatAppButtonHostUrl = this.chatAppButtonService.getClientWbcUrl();
      elementAcaChatAppButton = document.querySelector(AppComponent.getElementTag());

      const URL_STYLES_DEPENDENCIES = `${chatAppButtonHostUrl}/${wbcAcaChatAppButtonId}/styles.css`;

      this.state.css[wbcAcaChatAppButtonId] = false;

      const ON_LOAD_CSS_SUCCESS = () => {
        this.state.css[wbcAcaChatAppButtonId] = true;
        _debugX(HTMLDependenciesServiceV1.getClassName(), 'ON_LOAD_CSS_SUCCESS', {
          this_state: this.state
        });
      };
      const ON_LOAD_CSS_ERROR = () => {
        elementStylesCSSLink.remove();
        _debugX(HTMLDependenciesServiceV1.getClassName(), 'ON_LOAD_CSS_ERROR', {
          this_state: this.state
        });
      };

      elementStylesCSSLink = document.createElement('link');
      elementStylesCSSLink.id = `${wbcAcaChatAppButtonId}-styles`;
      elementStylesCSSLink.rel = 'stylesheet';
      elementStylesCSSLink.href = URL_STYLES_DEPENDENCIES;

      elementStylesCSSLink.addEventListener('load', ON_LOAD_CSS_SUCCESS);
      elementStylesCSSLink.addEventListener('error', ON_LOAD_CSS_ERROR);

      elementAcaChatAppButton.before(elementStylesCSSLink);

      _debugX(HTMLDependenciesServiceV1.getClassName(), 'loadCSSDependencies', {
        elementAcaChatAppButton,
        elementStylesCSSLink,
      });
    } catch (error) {
      _errorX(HTMLDependenciesServiceV1.getClassName(), 'loadCSSDependencies', {
        error,
        elementAcaChatAppButton,
        elementStylesCSSLink,
      });
    }
  }

  areLoadedCSSDependencies() {
    let retVal = true;
    for (let key of Object.keys(this.state.css)) {
      if (
        !this.state.css[key]
      ) {
        retVal = false;
        break;
      }
    }
    return retVal;
  }

  idLoadedCSSDependency(id: any) {
    let retVal = false;
    if (
      this.state.css[id]
    ) {
      retVal = true;
    }
    return retVal;
  }
}
