/*
  © Copyright IBM Corporation 2022. All Rights Reserved 

  SPDX-License-Identifier: EPL-2.0
*/
import {
  TranslateService,
} from '@ngx-translate/core';

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import {
  EnvironmentServiceV1,
  LocalStorageServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

export abstract class BaseAppWbcV1 {

  static getClassName() {
    return 'BaseAppWbcV1';
  }

  constructor(
    protected document: Document,
    protected environmentService: EnvironmentServiceV1,
    protected localStorageService: LocalStorageServiceV1,
    protected translateService: TranslateService,
    protected translateHelperServiceV1: TranslateHelperServiceV1,
  ) { }

  protected async initTranslations(
    configuration: {
      app: string,
      host: string,
      path: string,
    }
  ) {
    try {
      await this.translateHelperServiceV1.load(configuration);
      await this.translateHelperServiceV1.setTranslateService(this.translateService);
    } catch (error) {
      _errorW(BaseAppWbcV1.getClassName(), 'initTranslations',
        {
          error,
        });
      throw error;
    }
  }

  protected async loadStyle(
    configuration: {
      wbcId: string,
      host: string,
    },
  ) {
    try {
      const HEAD = this.document.getElementsByTagName('head')[0];
      const WBC_STYLE_HREF = `${configuration.host}/styles.css`;
      const THEME_LINK = this.document.getElementById(configuration?.wbcId) as HTMLLinkElement;
      if (
        THEME_LINK
      ) {
        THEME_LINK.href = WBC_STYLE_HREF;
      } else {
        const WBC_STYLE_EL = this.document.createElement('link');
        WBC_STYLE_EL.id = configuration?.wbcId;
        WBC_STYLE_EL.rel = 'stylesheet';
        WBC_STYLE_EL.href = WBC_STYLE_HREF;
        _debugW(BaseAppWbcV1.getClassName(), 'loadStyle',
          {
            WBC_STYLE_EL,
          });
        HEAD.appendChild(WBC_STYLE_EL);
      }
    } catch (error) {
      _errorW(BaseAppWbcV1.getClassName(), 'loadStyle',
        {
          error: error,
        });
      throw error;
    }
  }

  protected async loadScripts(
    configuration: {
      wbcId: string,
      host: string,
    },
  ) {
    try {
      const HEAD = this.document.getElementsByTagName('head')[0];
      const WBC_SCRIPT_ID = `${configuration?.wbcId}-script`;
      const WBC_SCRIPTS_HREF = `${configuration?.host}/scripts.js`;
      const SCRIPT_ELEMENT = this.document.getElementById(WBC_SCRIPT_ID) as HTMLScriptElement;
      if (
        SCRIPT_ELEMENT
      ) {
        SCRIPT_ELEMENT.remove();
      }
      const WBC_SCRIPT = this.document.createElement('script');
      WBC_SCRIPT.id = WBC_SCRIPT_ID;
      WBC_SCRIPT.src = WBC_SCRIPTS_HREF
      _debugW(BaseAppWbcV1.getClassName(), 'loadScripts',
        {
          WBC_SCRIPT,
        });
      HEAD.appendChild(WBC_SCRIPT);
    } catch (error) {
      _errorW(BaseAppWbcV1.getClassName(), 'loadStyle',
        {
          error: error,
        });
      throw error;
    }
  }

}
