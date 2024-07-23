/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import moment from 'moment';
import * as ramda from 'ramda';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

const defaultFilters = () => {
  return {
    dateFrom: moment().subtract(7, 'days').format('MM/DD/YYYY'),
    dateTo: moment().format('MM/DD/YYYY'),
    rangeLength: 'month',
    conversationId: null,
    confidence: 0.5,
    showSystemMessages: true
  };
};

const PREFIX = 'aiap';
const KEY_LOCALE = `${PREFIX}.locale`;
const KEY_TRANSLATION = `${PREFIX}.translation`;
const KEY_ZOOM = `${PREFIX}.zoom`;

@Injectable()
export class LocalStorageServiceV1 {

  static getClassName() {
    return 'LocalStorageServiceV1';
  }

  constructor() {
    //
  }

  set(key: string, data: any) {
    const temp = this.get(key);
    localStorage.setItem(key, JSON.stringify(ramda.mergeAll([temp, data])));
  }

  get(key: string) {
    let data = JSON.parse(localStorage.getItem(key));
    if (key == 'filters') {
      data = ramda.mergeLeft(data, defaultFilters());
    }
    return data;
  }

  setLocale(data: string) {
    localStorage.setItem(KEY_LOCALE, data);
  }

  getLocale() {
    return localStorage.getItem(KEY_LOCALE);
  }

  setTranslations(
    locale: string,
    translations: any,
  ) {
    _debugX(LocalStorageServiceV1.getClassName(), 'setTranslations',
      {
        locale,
        translations,
      });

    const KEY_TRANSLATION_BY_LOCALE = `${KEY_TRANSLATION}.${locale}`;
    const TRANSLATIONS_STRINGIFIED = JSON.stringify(translations);

    localStorage.setItem(KEY_TRANSLATION_BY_LOCALE, TRANSLATIONS_STRINGIFIED);
  }

  getTranslations(locale: string) {
    const KEY_TRANSLATION_BY_LOCALE = `${KEY_TRANSLATION}.${locale}`;
    let retVal;
    try {
      const TRANSLATIONS_STRINGIFIED = localStorage.getItem(KEY_TRANSLATION_BY_LOCALE);
      _debugX(LocalStorageServiceV1.getClassName(), 'getTranslations',
        {
          locale,
          KEY_TRANSLATION_BY_LOCALE,
          TRANSLATIONS_STRINGIFIED,
        });

      const RET_VAL = JSON.parse(TRANSLATIONS_STRINGIFIED);
      return RET_VAL;
    } catch (error) {
      _errorX(LocalStorageServiceV1.getClassName(), 'getTranslations',
        {
          error,
        });
    }
    return retVal;
  }

  setZoom(data: string) {
    localStorage.setItem(KEY_ZOOM, data);
  }

  getZoom() {
    return localStorage.getItem(KEY_ZOOM);
  }

}
