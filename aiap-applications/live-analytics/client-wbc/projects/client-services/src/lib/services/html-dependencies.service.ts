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

import { HTMLElementsService } from './html-elements.service';

@Injectable()
export class HTMLDependenciesServiceV1 {

  static getClassName() {
    return 'HTMLDependenciesService';
  }

  state: any = {
    js: {},
    css: {},
  };

  constructor(
    private htmlElementsService: HTMLElementsService,
  ) { }

  async loadJSDependency(id: any, url: any) {
    let head;
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
      head = document.head;
      const ON_LOAD_JS_SUCCESS = () => {
        this.state.js[id] = true;
        _debugX(HTMLElementsService.getClassName(), 'ON_LOAD_JS_SUCCESS', {
          this_state: this.state
        });
      }
      elJSScript = this.createElementScript(id, url);
      elJSScript.addEventListener('load', ON_LOAD_JS_SUCCESS);
      head.appendChild(elJSScript);
      _debugX(HTMLElementsService.getClassName(), 'loadJSDependency', {
        head,
        elJSScript,
      });
    } catch (error) {
      _errorX(HTMLDependenciesServiceV1.getClassName(), 'loadJSDependency', {
        error,
        head,
        elJSScript,
      });
      throw error;
    }
  }

  async loadCSSDependency(id: any, url: any) {
    let head;
    let elCSSLink;
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
      this.state.css[id] = false;
      head = document.head;
      const ON_LOAD_CSS_SUCCESS = () => {
        this.state.css[id] = true;
        _debugX(HTMLElementsService.getClassName(), 'ON_LOAD_CSS_SUCCESS', {
          this_state: this.state
        });
      }
      elCSSLink = document.createElement('link');
      elCSSLink.id = id;
      elCSSLink.rel = 'stylesheet';
      elCSSLink.href = url;
      elCSSLink.addEventListener('load', ON_LOAD_CSS_SUCCESS);
      head.appendChild(elCSSLink);
      _debugX(HTMLElementsService.getClassName(), 'loadDependenciesCSS', {
        head,
        elCSSLink,
      });
    } catch (error) {
      _errorX(HTMLDependenciesServiceV1.getClassName(), 'loadCSSDependency', {
        error,
        head,
        elCSSLink,
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

  areLoadedJSDependencies() {
    let retVal = true;
    for (let key of Object.keys(this.state.js)) {
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
    RET_VAL.type = "text/javascript";
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
      _debugX(HTMLElementsService.getClassName(), 'elementRemoved', {
        id: id
      });
      document.getElementById(id).remove();
    }
  }

}
