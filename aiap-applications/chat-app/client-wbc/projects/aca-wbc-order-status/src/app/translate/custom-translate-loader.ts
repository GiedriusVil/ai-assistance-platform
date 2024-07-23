/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { _errorX } from 'client-utils';
import { ConfigsServiceV1, LocalStorageServiceV1 } from 'client-services';
export class CustomTranslateLoader implements TranslateLoader {
  static getElementTag() {
    return 'aca-wbc-order-status';
  }
  translateAssetsURL: any;
  constructor(
    private httpClient: HttpClient,
    private configsService: ConfigsServiceV1,
    private localStorageService: LocalStorageServiceV1
  ) { }

  static getClassName() {
    return 'CustomTranslateLoader';
  }

  getTranslation(lang: string): Observable<any> {
    const HOST = this.localStorageService.getItem('aiap-widget-options-default');
    const PRE_URL = `${HOST.chatAppHost
      }${this.configsService.getPath()}/assets/i18n/${lang}.json`;
    const URL = PRE_URL.replace('0.0.1', 'client-wbc');
    return this.httpClient.get(URL).pipe(
      catchError((error) => {
        _errorX(CustomTranslateLoader.getClassName(), `getTranslation`, {
          error,
        });
        return this.httpClient.get(`en.json`);
      })
    );
  }
}
