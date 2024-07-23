/*
  © Copyright IBM Corporation 2022. All Rights Reserved 

  SPDX-License-Identifier: EPL-2.0
*/

import { TranslateService } from '@ngx-translate/core';

import {
  _errorW,
  _debugW,
} from 'client-shared-utils';

import {
  EnvironmentServiceV1,
  LocalStorageServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

export abstract class BaseAppWbcViewV1 {

  static getClassName() {
    return 'BaseAppWbcViewV1';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected localStorageService: LocalStorageServiceV1,
    protected translateHelperServiceV1: TranslateHelperServiceV1,
    protected translateService: TranslateService,
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
      _errorW(BaseAppWbcViewV1.getClassName(), '__initTranslations',
        {
          error,
        });
      throw error;
    }
  }

  protected async initiliseEnvironmentServiceV1(
    context: {
      activatedRoute: any,
      router: any,
      ngZone: any,
    },
    wbc: any,
  ) {
    this.environmentService.setActivatedRoute(context?.activatedRoute);
    this.environmentService.setRouter(context?.router);
    this.environmentService.setNgZone(context?.ngZone);
    this.environmentService.setEnvironmentByWBCConfiguration(wbc);
  }

  protected async loadHTMLDependencies() {
    const EL_CSS_LINK_ID = this.elCSSLinkId();
    const CLIENT_WBC_URL_BASE = `${this.environmentService.getHost()}/client-wbc/${EL_CSS_LINK_ID}`;
    const CLIENT_WBC_STYLES_URL = `${CLIENT_WBC_URL_BASE}/styles.css`;
    _debugW(BaseAppWbcViewV1.getClassName(), 'loadHTMLDependencies', {
      EL_CSS_LINK_ID,
      CLIENT_WBC_URL_BASE,
      CLIENT_WBC_STYLES_URL,
    });
    this.loadCSSDependency(EL_CSS_LINK_ID, CLIENT_WBC_STYLES_URL);
  }

  protected abstract isReady(): boolean;

  protected abstract elCSSLinkId(): string;

  protected abstract loadCSSDependency(linkId: string, styleUrl: string): Promise<void>;

}
