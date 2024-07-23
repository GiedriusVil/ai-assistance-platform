/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TranslateLoader } from '@ngx-translate/core';

import {
  _debugX,
} from 'client-shared-utils';

import { LocalStorageServiceV1 } from '../services/local-storage-service-v1';

@Injectable()
export class UITranslateLoaderV1 implements TranslateLoader {

  static getClassName() {
    return 'UITranslateLoaderV1';
  }

  constructor(
    private localStorageService: LocalStorageServiceV1,
  ) { }

  getTranslation(lang: string): Observable<any> {
    const TRANSLATIONS = this.localStorageService.getTranslations(lang);
    _debugX(UITranslateLoaderV1.getClassName(), 'getTranslation',
      {
        lang: lang,
        TRANSLATIONS: TRANSLATIONS,
      });
    const RET_VAL = of(TRANSLATIONS);
    return RET_VAL;
  }
}
