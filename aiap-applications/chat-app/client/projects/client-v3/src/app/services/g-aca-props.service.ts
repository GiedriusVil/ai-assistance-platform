/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';


import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { _debugX, Language, LANG } from 'client-utils';

@Injectable()
export class GAcaPropsServiceV1 {

  static getClassName() {
    return 'GAcaPropsServiceV1';
  }

  private gAcaProps: any;

  constructor() {}

  applyHostPageInfo(info: any) {
    this.ensureGAcaPropsExistance();
    this.gAcaProps = ramda.mergeDeepRight(this.gAcaProps, info);
    this.reCalcISOLangAttribute();
    _debugX(GAcaPropsServiceV1.getClassName(), 'applyHostPageInfo', { this_gAcaProps: this.gAcaProps });
  }

  applyUserSelectedLanguage(language: Language) {
    if (!language) {
      _debugX(GAcaPropsServiceV1.getClassName(), 'applyUserSelectedLanguage_No_language', { this_gAcaProps: this.gAcaProps });
      return;
    }
    this.ensureGAcaPropsExistance();
    this.gAcaProps = ramda.mergeDeepRight(this.gAcaProps, { userSelectedLanguage: language });
    this.reCalcISOLangAttribute();
    _debugX(GAcaPropsServiceV1.getClassName(), 'applyUserSelectedLanguage', { this_gAcaProps: this.gAcaProps });
  }

  mergeGAcaProps(value: any) {
    this.gAcaProps = ramda.mergeDeepRight(this.gAcaProps, value);
    this.reCalcISOLangAttribute();
    _debugX(GAcaPropsServiceV1.getClassName(), 'mergeGAcaProps', { this_gAcaProps: this.gAcaProps });
  }

  private ensureGAcaPropsExistance() {
    if (
      lodash.isEmpty(this.gAcaProps)
    ) {
      this.gAcaProps = {};
    }
  }

  private reCalcISOLangAttribute() {
    delete this.gAcaProps.isoLang;
    const LANG = this.gAcaProps?.lang;
    let isoLang: Language;
    if (
      !lodash.isEmpty(LANG)
    ) {
      isoLang = LANG;
    }
    this.gAcaProps.isoLang = isoLang;
  }

  getGAcaProps() {
    return this.gAcaProps
  }

  getGAcaPropsJSONString(): string {
    let retVal = '';
    const G_ACA_PROPS = this.getGAcaProps();
    if (G_ACA_PROPS) {
      retVal = JSON.stringify(G_ACA_PROPS);
    }
    return retVal;
  }
}
