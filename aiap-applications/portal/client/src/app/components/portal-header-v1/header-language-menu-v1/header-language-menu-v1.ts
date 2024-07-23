/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, Input } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import {
  _debugX,
} from 'client-shared-utils';

import {
  LocalStorageServiceV1,
  BrowserServiceV1,
} from 'client-shared-services';

enum LanguageMap {
  'de-DE' = 'German',
  'en-US' = 'English',
  'en-GB' = 'English',
}

@Component({
  selector: 'aiap-header-language-menu-v1',
  templateUrl: './header-language-menu-v1.html',
  styleUrls: ['./header-language-menu-v1.scss'],
})
export class HeaderLanguageMenuV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'HeaderLanguageMenu';
  }

  @Input() user;

  languages: any[];

  selectedLanguage: {
    code: string,
    label: string,
  };


  constructor(
    private browserServiceV1: BrowserServiceV1,
    private localStorageService: LocalStorageServiceV1,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    const CURRENT_LANGUAGE = this.localStorageService.getLocale() ? this.localStorageService.getLocale() : this.translateService.currentLang;
    this.selectedLanguage = {
      code: CURRENT_LANGUAGE,
      label: LanguageMap[CURRENT_LANGUAGE]
    };
    const TRANSLATE_SERVICE_LANGS = this.translateService.getLangs();
    _debugX(HeaderLanguageMenuV1.getClassName(), 'ngOnInit', {
      TRANSLATE_SERVICE_LANGS,
    });
    this.languages = TRANSLATE_SERVICE_LANGS.map(lang => {
      const RET_VAL = {
        code: lang,
        label: LanguageMap[lang]
      };
      return RET_VAL;
    })


  }

  ngOnDestroy(): void {
    //
  }

  handleLanguageSelectionEvent(language: any) {
    _debugX(HeaderLanguageMenuV1.getClassName(), 'handleLanguageSelectionEvent',
      {
        language,
      });

    this.selectedLanguage = language;
    this.localStorageService.setLocale(language.code);
    this.browserServiceV1.reloadPage();
  }
}
