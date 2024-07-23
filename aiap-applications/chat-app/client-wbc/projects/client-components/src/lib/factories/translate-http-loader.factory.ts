/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { _errorX } from 'client-utils';

export function createTranslateHttpLoaderFactory(elementTag: any) {
  const RET_VAL = (httpClient: HttpClient) => {
    let url;
    let acaWidgetOptionsDefaultAsString;
    let acaWidgetOptionsDefault;
    let windowAcaWidgetOptions;
    try {
      acaWidgetOptionsDefaultAsString = window.localStorage.getItem('aiap-widget-options-default');
      windowAcaWidgetOptions = window['acaWidgetOptions'];
      if (
        windowAcaWidgetOptions?.chatAppHost
      ) {
        url = windowAcaWidgetOptions?.chatAppHost;
      } else {
        acaWidgetOptionsDefault = JSON.parse(acaWidgetOptionsDefaultAsString);
        url = acaWidgetOptionsDefault?.chatAppHost;
      }
    } catch (error) {
      _errorX('createHttpLoaderFactory', 'createHttpLoaderFactory', { error });
    } finally {
      url = url || '';
      let prefix = `${url}/client-wbc/${elementTag}/assets/i18n/`;
      let suffix = '.json';
      let retVal = new TranslateHttpLoader(httpClient, prefix, suffix);
      return retVal;
    }
  }
  return RET_VAL;
}
