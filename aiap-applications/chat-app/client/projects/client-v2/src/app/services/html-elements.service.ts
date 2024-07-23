/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  _debugX,
  _errorX,
  ACA_ERROR_TYPE,
  throwAcaError,
} from "client-utils";

import {
  AppComponent,
} from '../app.component';

import {
  ChatWindowPanel,
} from '../layout';

import {
  SessionServiceV2,
  ChatWidgetServiceV1,
  EventsServiceV1,
} from "client-services";

import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HTMLElementsService {

  static getClassName() {
    return 'HTMLElementsService';
  }

  __readyScripts = {
    jQuery: false,
    popper: false,
    bootstrap: false,
    acaJquery: false,
  }
  __readyStylesDependencies = false;

  constructor(
    private chatWidgetService: ChatWidgetServiceV1,
    private sessionService: SessionServiceV2,
    private eventsService: EventsServiceV1,
  ) { }

  getElementAcaChatApp(): Element {
    const EL_TAG_NAME = AppComponent.getHTMLTagName();
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
    const EL_TAG_NAME = ChatWindowPanel.getHTMLTagName();
    try {
      const EL_CHAT_APP = this.getElementAcaChatApp();
      const RET_VAL = EL_CHAT_APP.querySelector(EL_TAG_NAME);
      _debugX(HTMLElementsService.getClassName(), 'getElementAcaChatWindow', { RET_VAL });
      return RET_VAL;
    } catch (error) {
      _errorX(HTMLElementsService.getClassName(), 'getElementAcaChatWindow', {
        EL_TAG_NAME,
        error,
      });
      throw error;
    }
  }

  getElementAcaChatWindowInner(): Element {
    const EL_ID = ChatWindowPanel.getInnerElementId();
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

  async loadDependenciesJS() {
    let elementAcaChatApp;
    let chatAppHostUrl;
    let wbcIdAcaChatApp;

    let elementScriptJquery;
    let elementAcaJqueryPlugin;

    let sessionEvent: Subscription;
    try {
      chatAppHostUrl = this.chatWidgetService.getChatAppHostUrl();
      elementAcaChatApp = this.getElementAcaChatApp();
      wbcIdAcaChatApp = AppComponent.getWbcId();

      if (lodash.isEmpty(this.sessionService.getSession())) {
        sessionEvent = this.eventsService.sessionEmitter.subscribe((session) => {
          this.loadBootstrapDependenciesJS();
          sessionEvent.unsubscribe();
        })
      } else {
        this.loadBootstrapDependenciesJS();
      }

      const JQEURY_ELEMENT_ID = `${wbcIdAcaChatApp}-scripts-jquery`;
      const ACA_JQUERY_ELEMENT_ID = `${wbcIdAcaChatApp}-scripts-acaJquery`;
      const URL_JQUERY = `${chatAppHostUrl}/en-US/jquery/jquery.slim.min.js`;
      const URL_ACA_JQUERY_PLUGIN = `${chatAppHostUrl}/en-US/assets/aca-jquery-plugin.js`;

      elementScriptJquery = this.loadDependencyJS(JQEURY_ELEMENT_ID, URL_JQUERY, 'jQuery')
      elementAcaJqueryPlugin = this.loadDependencyJS(ACA_JQUERY_ELEMENT_ID, URL_ACA_JQUERY_PLUGIN, 'acaJquery')

      _debugX(HTMLElementsService.getClassName(), 'loadDependenciesJS', {
        elementAcaChatApp,
        elementScriptJquery,
        elementAcaJqueryPlugin
      });
    } catch (error) {
      _errorX(HTMLElementsService.getClassName(), 'loadDependenciesJS', {
        chatAppHostUrl,
        elementAcaChatApp,
        wbcIdAcaChatApp,
        error,
      });
      throw error;
    }
  }

  loadBootstrapDependenciesJS() {
    if (!this.sessionService.getSession()?.engagement?.chatApp?.loadBootstrap) {
      return
    }
    let elementAcaChatApp;
    let chatAppHostUrl;
    let wbcIdAcaChatApp;

    let elementScriptBootstrap;
    let elementScriptPopper;
    try {
      chatAppHostUrl = this.chatWidgetService.getChatAppHostUrl();
      elementAcaChatApp = this.getElementAcaChatApp();
      wbcIdAcaChatApp = AppComponent.getWbcId();

      const BOOTSTRAP_ELEMENT_ID = `${wbcIdAcaChatApp}-scripts-bootstrap`;
      const POPPER_ELEMENT_ID = `${wbcIdAcaChatApp}-scripts-popper`;
      const URL_BOOTSTRAP = `${chatAppHostUrl}/en-US/bootstrap/bootstrap.min.js`;
      const URL_POPPER = `${chatAppHostUrl}/en-US/popper/umd/popper.min.js`;
      elementScriptBootstrap = this.loadDependencyJS(BOOTSTRAP_ELEMENT_ID, URL_BOOTSTRAP, 'bootstrap');
      elementScriptPopper = this.loadDependencyJS(POPPER_ELEMENT_ID, URL_POPPER, 'popper');
    } catch (error) {
      _errorX(HTMLElementsService.getClassName(), 'loadBootstrapDependenciesJS', {
        chatAppHostUrl,
        elementAcaChatApp,
        wbcIdAcaChatApp,
        error,
      });
      throw error;
    }
  }


  loadDependencyJS(elementId, url, scriptName) {
    let elementAcaChatApp;
    let chatAppHostUrl;
    let wbcIdAcaChatApp;

    let retVal;
    try {
      chatAppHostUrl = this.chatWidgetService.getChatAppHostUrl();
      elementAcaChatApp = this.getElementAcaChatApp();
      wbcIdAcaChatApp = AppComponent.getWbcId();

      if (this.checkIfElementExists(elementId)) {
        this.removeElementById(url);
      }

      const ON_SCRIPT_LOAD_SUCCESS = () => {
        this.__readyScripts[scriptName] = true;
        _debugX(HTMLElementsService.getClassName(), 'ON_SCRIPT_LOAD_SUCCESS', {
          ready: this.__readyScripts[scriptName],
          url,
          elementId
        });
      }

      retVal = this.createElementScript(elementId, url);
      retVal.addEventListener('load', ON_SCRIPT_LOAD_SUCCESS);
      elementAcaChatApp.before(retVal);

      _debugX(HTMLElementsService.getClassName(), 'loadDependencyJS', {
        elementAcaChatApp,
        elementScript: retVal
      });

      return retVal;
    } catch (error) {
      _errorX(HTMLElementsService.getClassName(), 'loadDependencyJS', {
        chatAppHostUrl,
        elementAcaChatApp,
        wbcIdAcaChatApp,
        error,
      });
      throw error;
    }
  }

  areLoadedJSDependencies() {
    const RET_VAL = this.__readyScripts.jQuery && this.__readyScripts.acaJquery
    return RET_VAL;
  }

  async loadDependenciesCSS() {
    let elementAcaChatApp;
    let chatAppHostUrl;
    let wbcIdAcaChatApp;

    let elementStylesDependencies;
    try {
      elementAcaChatApp = document.querySelector('aca-chat-app');
      chatAppHostUrl = this.chatWidgetService.getChatAppHostUrl();
      wbcIdAcaChatApp = AppComponent.getWbcId();

      const URL_STYLES_DEPENDENCIES = `${chatAppHostUrl}/en-US/styles-dependencies.css`;

      elementStylesDependencies = document.createElement('link');
      elementStylesDependencies.id = `${wbcIdAcaChatApp}-styles-dependencies`;
      elementStylesDependencies.rel = 'stylesheet';
      elementStylesDependencies.href = URL_STYLES_DEPENDENCIES;

      elementAcaChatApp.before(elementStylesDependencies);

      _debugX(HTMLElementsService.getClassName(), 'loadDependenciesCSS', {
        elementAcaChatApp,
        elementStylesDependencies,
      });
    } catch (error) {
      _errorX(HTMLElementsService.getClassName(), 'loadDependenciesCSS', {
        chatAppHostUrl,
        elementAcaChatApp,
        wbcIdAcaChatApp,
        error,
      });
      throw error;
    }
  }

  areLoadedCSSDependencies() {
    const RET_VAL = true;
    return RET_VAL;
  }

  private removeElementById(id: any) {
    _debugX(HTMLElementsService.getClassName(), 'elementRemoved', {
      id: id
    });
    document.getElementById(id).remove();
  }

  private checkIfElementExists(id: any) {
    let retVal = false;
    const ELEMENT = document.getElementById(id);
    if (!lodash.isEmpty(ELEMENT)) {
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

}
