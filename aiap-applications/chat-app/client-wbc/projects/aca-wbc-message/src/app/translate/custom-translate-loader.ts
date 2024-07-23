/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigsServiceV1 } from 'client-services';
import { _errorX } from 'client-utils';
export class CustomTranslateLoader implements TranslateLoader {
  constructor(private httpClient: HttpClient, private configsService: ConfigsServiceV1) { }

  static getClassName() {
    return 'CustomTranslateLoader';
  }

  getTranslation(lang: string): Observable<any> {
    const URL = `${this.configsService.getHost()}${this.configsService.getPath()}/assets/i18n/${lang}.json`;

    return this.httpClient.get(URL).pipe(catchError((error) => {
      _errorX(CustomTranslateLoader.getClassName(), `getTranslation`, { error });
      return this.httpClient.get(`/assets/i18n/en.json`)
    }));
  }
}
