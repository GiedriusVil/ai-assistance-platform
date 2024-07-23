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


@Injectable()
export class HTMLElementsService {

  static getClassName() {
    return 'HTMLElementsService';
  }

  constructor() { }

  getElementAcaChatApp(): Element | null {
    const EL_TAG_NAME = 'aca-chat-app';
    try {
      const RET_VAL = document.querySelector(EL_TAG_NAME);
      _debugX(HTMLElementsService.getClassName(), 'getElementAcaChatApp', { RET_VAL });
      return RET_VAL;
    } catch (error) {
      _errorX(HTMLElementsService.getClassName(), 'getElementAcaChatApp', {
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
      _debugX(HTMLElementsService.getClassName(), 'getElementAcaChatWindow', { retVal });
      return retVal;
    } catch (error) {
      _errorX(HTMLElementsService.getClassName(), 'getElementAcaChatWindow', {
        EL_TAG_NAME,
        error,
      });
      throw error;
    }
  }

  getElementAcaChatWindowInner(): Element | null {
    const EL_ID = 'chat--window--inner';
    try {
      const EL_CHAT_WINDOW = this.getElementAcaChatWindow();
      const RET_VAL = EL_CHAT_WINDOW.querySelector(`#${EL_ID}`);
      _debugX(HTMLElementsService.getClassName(), 'getElementAcaChatWindowInner', { RET_VAL });
      return RET_VAL;
    } catch (error) {
      _errorX(HTMLElementsService.getClassName(), 'getElementAcaChatWindowInner', {
        EL_ID,
        error,
      });
      throw error;
    }
  }

  getElementAcaLeftPanel(): Element | null {
    const EL_TAG_NAME = 'aca-chat-left-panel';
    try {
      const RET_VAL = document.querySelector(EL_TAG_NAME);
      _debugX(HTMLElementsService.getClassName(), 'getElementAcaChatApp', { RET_VAL });
      return RET_VAL;
    } catch (error) {
      _errorX(HTMLElementsService.getClassName(), 'getElementAcaChatApp', {
        EL_TAG_NAME,
        error,
      });
      throw error;
    }
  }

  appendChildToAcaChatWindow(element: Element): void {
    try {
      _debugX(HTMLElementsService.getClassName(), 'appendChildToAcaChatWindow', { element });
      const ELEMENT = this.getElementAcaChatWindow();
      if (
        lodash.isEmpty(ELEMENT)
      ) {
        const MESSAGE = 'Unable to retrieve HTML element <aca-chat-app />!';
        throwAcaError(HTMLElementsService.getClassName(), ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      ELEMENT.appendChild(element);
    } catch (error) {
      _errorX(HTMLElementsService.getClassName(), 'appendChildToAcaChatWindow', {
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
