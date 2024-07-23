/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { _errorX } from 'client-utils';

export function createTranslateHttpLoaderFactory(elementTag: any) {
  const RET_VAL = (httpClient: HttpClient) => {
    let url;
    let aiapChatAppButtonOptionsAsString;
    let aiapChatAppButtonOptions;
    let aiapChatAppButtonOptionsWindow;
    try {
      aiapChatAppButtonOptionsAsString = window.localStorage.getItem('aiap-wbc-chat-app-button-options');
      aiapChatAppButtonOptionsWindow = window['aiapChatAppButtonOptions'];
      if (
        aiapChatAppButtonOptionsWindow?.chatAppHost
      ) {
        url = aiapChatAppButtonOptionsWindow?.chatAppHost;
      } else {
        aiapChatAppButtonOptions = JSON.parse(aiapChatAppButtonOptionsAsString);
        url = aiapChatAppButtonOptions?.chatAppHost;
      }
    } catch (error) {
      _errorX('createTranslateHttpLoaderFactory', 'createTranslateHttpLoaderFactory', { error });
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
