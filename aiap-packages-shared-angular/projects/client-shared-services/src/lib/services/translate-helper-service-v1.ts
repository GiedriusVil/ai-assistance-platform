/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, lastValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import lodash from 'lodash';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  LocalStorageServiceV1,
} from './local-storage-service-v1';

const DEFAULT_LOCALE = 'en-US';
const DEFAULT_LOCALES = [
  'en-US',
  'de-DE'
];

@Injectable({
  providedIn: 'root'
})
export class TranslateHelperServiceV1 {

  static getClassName() {
    return 'TranslateHelperServiceV1';
  }

  translateService: TranslateService;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageServiceV1,
  ) { }

  async setTranslateService(translateService: TranslateService) {
    try {
      this.translateService = translateService;
      //
      const LOCALE = this.getLocale();
      // this.translateService.setDefaultLang();
      this.translateService.addLangs(DEFAULT_LOCALES);
      const OBSERVABLE_USE = this.translateService.use(LOCALE);
      await lastValueFrom(OBSERVABLE_USE)
    } catch (error) {
      _errorX(TranslateHelperServiceV1.getClassName(), 'setTranslateService',
        {
          error,
        });

      throw error;
    }
  }

  async load(
    configuration: {
      app: string,
      host: string,
      path: string,
    },
  ) {
    try {
      switch (configuration?.app) {
        case 'portal':
          await this.reloadTranslationsMain(configuration);
          break;
        default:
          await this.reloadTranslationsWbc(configuration);
          break;
      }
    } catch (error) {
      _errorX(TranslateHelperServiceV1.getClassName(), 'load',
        {
          this: this,
          configuration: configuration,
          error: error,
        });
      throw error;
    }
  }

  private async reloadTranslationsMain(
    configuration: {
      host: string,
      path: string,
    },
  ) {
    let url: string;
    let translations;
    try {
      _debugX(TranslateHelperServiceV1.getClassName(), 'reloadTranslationsMain',
        {
          this: this,
          configuration: configuration,
        });

      url = `${configuration?.host}${configuration?.path}/${this.getLocale()}.json`;
      const RESPONSE_OBSERVABLE = await this.http.get(url)
        .pipe(
          catchError((error) => this.handleLoadError(error)),
        );
      translations = await lastValueFrom(RESPONSE_OBSERVABLE);
      this.localStorageService.setTranslations(this.getLocale(), translations);
    } catch (error) {
      _errorX(TranslateHelperServiceV1.getClassName(), 'reloadTranslationsMain', {
        this: this,
        configuration: configuration,
        error: error,
      });
      throw error;
    }
  }

  private async reloadTranslationsWbc(
    configuration: {
      host: string,
      path: string,
    },
  ) {
    let url
    let translations;
    let translationsAddition;
    try {
      _debugX(TranslateHelperServiceV1.getClassName(), 'reloadTranslationsWbc',
        {
          this: this,
          configuration: configuration,
        });

      url = `${configuration?.host}${configuration?.path}/${this.getLocale()}.json`;
      translations = this.localStorageService.getTranslations(this.getLocale());

      const RESPONSE_OBSERVABLE = await this.http.get(url)
        .pipe(
          catchError((error) => this.handleLoadError(error)),
        );
      translationsAddition = await lastValueFrom(RESPONSE_OBSERVABLE);
      const TRANSLATIONS_NEW = {
        ...translations,
        ...translationsAddition,
      }
      this.localStorageService.setTranslations(this.getLocale(), TRANSLATIONS_NEW);
    } catch (error) {
      _errorX(TranslateHelperServiceV1.getClassName(), '__reloadTranslationsAddition', {
        this: this,
        configuration: configuration,
        error: error,
      });
    }
  }

  private handleLoadError(error: any) {
    _errorX(TranslateHelperServiceV1.getClassName(), 'handleLoadError',
      {
        error,
      });
    return of();
  }

  private getLocale() {
    let retVal = this.localStorageService.getLocale();
    if (
      lodash.isEmpty(retVal)
    ) {
      retVal = DEFAULT_LOCALE;
      this.localStorageService.setLocale(DEFAULT_LOCALE);
    }
    return retVal;
  }

  instant(key: string, interpolateParams?: any) {
    try {
      const RET_VAL = this.translateService.instant(key, interpolateParams);
      return RET_VAL;
    } catch (error) {
      _errorX(TranslateHelperServiceV1.getClassName(), 'instant',
        {
          error,
        });
      throw error;
    }
  }

}
