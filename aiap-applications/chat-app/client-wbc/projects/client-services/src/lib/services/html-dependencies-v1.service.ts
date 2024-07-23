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

import { HTMLElementsServiceV1 } from '.';

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
    private htmlElementsService: HTMLElementsServiceV1,
  ) { }

  async loadJSDependency(id: any, url: any) {
    let elAcaChatApp;
    let elJSScript;
    try {
      if (
        lodash.isEmpty(id)
      ) {
        const ERROR_MESSAGE = `Missing required id parameter!`;
        throwAcaError(HTMLDependenciesServiceV1.getClassName(), ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
      if (
        lodash.isEmpty(url)
      ) {
        const ERROR_MESSAGE = `Missing required url parameter!`;
        throwAcaError(HTMLDependenciesServiceV1.getClassName(), ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
      if (
        this.checkIfElementExists(id)
      ) {
        this.removeElementById(id);
      }
      this.state.js[id] = false;
      elAcaChatApp = this.htmlElementsService.getElementAcaChatApp() || document.body;
      const ON_LOAD_JS_SUCCESS = () => {
        this.state.js[id] = true;
        _debugX(HTMLElementsServiceV1.getClassName(), 'ON_LOAD_JS_SUCCESS', {
          this_state: this.state
        });
      }
      elJSScript = this.createElementScript(id, url);
      elJSScript.addEventListener('load', ON_LOAD_JS_SUCCESS);
      elAcaChatApp.before(elJSScript);
      _debugX(HTMLElementsServiceV1.getClassName(), 'loadJSDependency', {
        elAcaChatApp,
        elJSScript,
      });
    } catch (error) {
      _errorX(HTMLDependenciesServiceV1.getClassName(), 'loadJSDependency', {
        error,
        elAcaChatApp,
        elJSScript,
      });
      throw error;
    }
  }

  async loadCSSDependency(id: any, url: any) {
    let elAcaChatApp;
    let elCSSLink: HTMLLinkElement;
    try {
      if (
        lodash.isEmpty(id)
      ) {
        const ERROR_MESSAGE = `Missing required id parameter!`;
        throwAcaError(HTMLDependenciesServiceV1.getClassName(), ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
      if (
        lodash.isEmpty(url)
      ) {
        const ERROR_MESSAGE = `Missing required url parameter!`;
        throwAcaError(HTMLDependenciesServiceV1.getClassName(), ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
      if (
        this.checkIfElementExists(id)
      ) {
        return;
      }

      this.state.css[id] = false;
      elAcaChatApp = this.htmlElementsService.getElementAcaChatApp() || document.body;
      const ON_LOAD_CSS_SUCCESS = () => {
        this.state.css[id] = true;
        _debugX(HTMLElementsServiceV1.getClassName(), 'ON_LOAD_CSS_SUCCESS', {
          this_state: this.state
        });
      };

      const ON_LOAD_CSS_ERROR = () => {
        elCSSLink.remove();
        _debugX(HTMLElementsServiceV1.getClassName(), 'ON_LOAD_CSS_ERROR', {
          this_state: this.state
        });
      };

      elCSSLink = document.createElement('link');
      elCSSLink.id = id;
      elCSSLink.rel = 'stylesheet';
      elCSSLink.href = url;
      elCSSLink.addEventListener('load', ON_LOAD_CSS_SUCCESS);
      elCSSLink.addEventListener('error', ON_LOAD_CSS_ERROR);
      elAcaChatApp.before(elCSSLink);
      _debugX(HTMLElementsServiceV1.getClassName(), 'loadDependenciesCSS', {
        elAcaChatApp,
        elCSSLink,
      });
    } catch (error) {
      _errorX(HTMLDependenciesServiceV1.getClassName(), 'loadCSSDependency', {
        error,
        elAcaChatApp,
        elCSSLink,
      });
    }
  }

  areLoadedCSSDependencies() {
    let retVal = true;
    for (const key of Object.keys(this.state.css)) {
      if (
        !this.state.css[key]
      ) {
        retVal = false;
        break;
      }
    }
    return retVal;
  }

  areLoadedJSDependencies() {
    let retVal = true;
    for (const key of Object.keys(this.state.js)) {
      if (
        !this.state.js[key]
      ) {
        retVal = false;
        break;
      }
    }
    return retVal;
  }

  isLoadedJSDependency(id: any) {
    let retVal = false;
    if (
      this.state.js[id]
    ) {
      retVal = true;
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

  private createElementScript(id: any, src: any): HTMLScriptElement {
    const RET_VAL = document.createElement('script') as HTMLScriptElement;
    RET_VAL.id = id;
    RET_VAL.type = 'text/javascript';
    RET_VAL.src = src;
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
    if (
      !lodash.isEmpty(document)
    ) {
      _debugX(HTMLElementsServiceV1.getClassName(), 'elementRemoved', {
        id: id
      });
      document.getElementById(id).remove();
    }
  }

}
