/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
  ACA_ERROR_TYPE,
  throwAcaError,
} from 'client-utils';

import {
  AppComponent
} from '../app.component';


@Injectable({ providedIn: 'root' })
export class HTMLElementsServiceV1 {

  static getClassName() {
    return 'HTMLElementsServiceV1';
  }

  boxJSReady = false;
  boxCSSReady = false;

  constructor() { }

  async loadDependenciesJS() {
    let elementBox;
    let wbcIdMultimedia;

    let elementScriptBox;
    try {

      elementBox = this.getElementAcaChatApp() || document.body;
      wbcIdMultimedia = AppComponent.getElementTag();

      const BOX_ELEMENT_ID = `${wbcIdMultimedia}-box-script`;
      const DEPENDENCIES_IDS = [BOX_ELEMENT_ID];

      const URL_BOX = 'https://cdn01.boxcdn.net/platform/preview/2.84.0/en-US/preview.js';

      DEPENDENCIES_IDS.forEach(id => {
        if (this.checkIfElementExists(id)) {
          this.removeElementById(id);
        }
      });

      const ON_LOAD_SUCCESS_SCRIPT_BOX = () => {
        this.boxJSReady = true;
        _debugX(HTMLElementsServiceV1.getClassName(), 'ON_LOAD_SUCCESS_SCRIPT_BOX', {
          this_boxJSReady: this.boxJSReady
        });
      }
      elementScriptBox = this.createElementScript(BOX_ELEMENT_ID, URL_BOX);
      elementScriptBox.addEventListener('load', ON_LOAD_SUCCESS_SCRIPT_BOX);
      elementBox.before(elementScriptBox);
      _debugX(HTMLElementsServiceV1.getClassName(), 'loadDependenciesJS', {
        elementBox,
        elementScriptBox
      });
    } catch (error) {
      _errorX(HTMLElementsServiceV1.getClassName(), 'loadDependenciesJS', {
        elementBox,
        wbcIdMultimedia,
        error,
      });
      throw error;
    }
  }

  areLoadedJSDependencies() {
    const RET_VAL = this.boxJSReady;
    return RET_VAL;
  }

  async loadDependenciesCSS() {
    let elementsBox;
    let stylesBox;
    let wbcIdMutlimedia;

    try {
      elementsBox = document.querySelector('aca-wbc-mult-response-v2');
      wbcIdMutlimedia = AppComponent.getElementTag();

      const URL_STYLES_DEPENDENCIES = 'https://cdn01.boxcdn.net/platform/preview/2.84.0/en-US/preview.css';

      const ON_LOAD_SUCCESS_LINK_BOX = () => {
        this.boxCSSReady = true;
        _debugX(HTMLElementsServiceV1.getClassName(), 'ON_LOAD_SUCCESS_LINK_BOX', {
          this_boxCSSReady: this.boxCSSReady
        });
      }
      stylesBox = document.createElement('link');
      stylesBox.id = `${wbcIdMutlimedia}-box-style`;
      stylesBox.rel = 'stylesheet';
      stylesBox.href = URL_STYLES_DEPENDENCIES;
      stylesBox.addEventListener('load', ON_LOAD_SUCCESS_LINK_BOX)
      elementsBox.before(stylesBox);

      _debugX(HTMLElementsServiceV1.getClassName(), 'loadDependenciesCSS', {
        elementsBox,
        stylesBox,
      });
    } catch (error) {
      _errorX(HTMLElementsServiceV1.getClassName(), 'loadDependenciesCSS', {
        elementsBox,
        wbcIdMutlimedia,
        error,
      });
      throw error;
    }
  }

  areLoadedCSSDependencies() {
    const RET_VAL = true;
    return RET_VAL;
  }

  private checkIfElementExists(id: any) {
    let retVal = false;
    const ELEMENT = document.getElementById(id);
    if (!lodash.isEmpty(ELEMENT)) {
      retVal = true;
    }
    return retVal;
  }

  private removeElementById(id: any) {
    _debugX(HTMLElementsServiceV1.getClassName(), 'elementRemoved', {
      id: id
    });
    document.getElementById(id).remove();
  }

  private createElementScript(id: any, src: any): HTMLScriptElement {
    const RET_VAL = document.createElement('script') as HTMLScriptElement;
    RET_VAL.id = id;
    RET_VAL.type = "text/javascript";
    RET_VAL.src = src;
    return RET_VAL;
  }

  getElementAcaChatApp(): Element {
    const EL_TAG_NAME = 'aca-chat-app';
    try {
      const RET_VAL = document.querySelector(EL_TAG_NAME);
      _debugX(HTMLElementsServiceV1.getClassName(), 'getElementAcaChatApp', { RET_VAL });
      return RET_VAL;
    } catch (error) {
      _errorX(HTMLElementsServiceV1.getClassName(), 'getElementAcaChatApp', {
        EL_TAG_NAME,
        error,
      });
      throw error;
    }
  }

  getElementAcaChatWindow(): Element {
    const EL_TAG_NAME = 'aca-chat-window-panel';
    let retVal;
    try {
      const EL_CHAT_APP = this.getElementAcaChatApp();
      // If aca-chat-app was not found most likely it means that chat app v1 is currently in use.
      if (!EL_CHAT_APP) {
        retVal = document.querySelector('app-component');
      } else {
        retVal = EL_CHAT_APP.querySelector(EL_TAG_NAME);
      }
      _debugX(HTMLElementsServiceV1.getClassName(), 'getElementAcaChatWindow', { retVal });
      return retVal;
    } catch (error) {
      _errorX(HTMLElementsServiceV1.getClassName(), 'getElementAcaChatWindow', {
        EL_TAG_NAME,
        error,
      });
      throw error;
    }
  }

  getElementAcaChatWindowInner(): Element {
    const EL_ID = 'chat--window--inner'
    try {
      const EL_CHAT_WINDOW = this.getElementAcaChatWindow();
      const RET_VAL = EL_CHAT_WINDOW.querySelector(`#${EL_ID}`);
      _debugX(HTMLElementsServiceV1.getClassName(), 'getElementAcaChatWindowInner', { RET_VAL });
      return RET_VAL;
    } catch (error) {
      _errorX(HTMLElementsServiceV1.getClassName(), 'getElementAcaChatWindowInner', {
        EL_ID,
        error,
      });
      throw error;
    }
  }

  getElementAcaLeftPanel(): Element {
    const EL_TAG_NAME = 'aca-chat-left-panel';
    try {
      const RET_VAL = document.querySelector(EL_TAG_NAME);
      _debugX(HTMLElementsServiceV1.getClassName(), 'getElementAcaChatApp', { RET_VAL });
      return RET_VAL;
    } catch (error) {
      _errorX(HTMLElementsServiceV1.getClassName(), 'getElementAcaChatApp', {
        EL_TAG_NAME,
        error,
      });
      throw error;
    }
  }

  appendChildToAcaChatWindow(element: Element): void {
    try {
      _debugX(HTMLElementsServiceV1.getClassName(), 'appendChildToAcaChatWindow', { element });
      const ELEMENT = this.getElementAcaChatWindow();
      if (
        lodash.isEmpty(ELEMENT)
      ) {
        const MESSAGE = 'Unable to retrieve HTML element <aca-chat-app />!';
        throwAcaError(HTMLElementsServiceV1.getClassName(), ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      ELEMENT.appendChild(element);
    } catch (error) {
      _errorX(HTMLElementsServiceV1.getClassName(), 'appendChildToAcaChatWindow', {
        error,
      });
      throw error;
    }
  }

  chatWindowChildById(id: string): Element | null {
    const CHAT_WINDOW = this.getElementAcaChatWindow();
    const RET_VAL = CHAT_WINDOW.children.namedItem(id);
    return RET_VAL;
  }
}
