/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ChatWidgetServiceV1 } from 'client-services';
import { _debugX, _errorX } from 'client-utils';
import { AppComponent } from '../app.component';
export class CustomTranslateLoader implements TranslateLoader {
  constructor(private httpClient: HttpClient, private chatWidgetService: ChatWidgetServiceV1) { }

  static getClassName() {
    return 'CustomTranslateLoader';
  }

  getTranslation(lang: string): Observable<any> {
    const CLIENT_WBC_URL = this.chatWidgetService.getClientWbcUrl();
    const URL = `${CLIENT_WBC_URL}/${AppComponent.getElementTag()}/assets/i18n/${lang}.json`;
    _debugX(CustomTranslateLoader.getClassName(), 'getTranslation footerV1', { URL });

    return this.httpClient.get(URL).pipe(catchError((error) => {
      _errorX(CustomTranslateLoader.getClassName(), `getTranslation`, { error });
      return this.httpClient.get(`/assets/i18n/en.json`)
    }));
  }
}
