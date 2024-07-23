/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import * as lodash from 'lodash';

@Injectable()
export class BrowserServiceV1 {

  _browser: any;

  constructor() {
    this._browser = (window as any);
  }

  openInNewTab(url) {
    this._browser.open(url, '_blank');
  }

  openInNewTabWithParams(route: string, queryParams: object = {}) {
    let queryParamsString = '';
    if (
      !lodash.isEmpty(queryParams)
    ) {
      queryParamsString = '?';
      Object.entries(queryParams).forEach(([key, value]) => {
        queryParamsString = queryParamsString + key + '=' + value + '&';
      });
    }
    const NAVIGATE_TO_ROUTE = route + queryParamsString;

    this._browser.open(NAVIGATE_TO_ROUTE, '_blank');
  }

  redirectToUrl(url) {
    this._browser.open(url, '_self');
  }

  randomFloat() {
    const RANDOMNESS_BUFFER = new Uint32Array(1);
    const RANDOM_INT = this._browser.crypto.getRandomValues(RANDOMNESS_BUFFER)[0];
    const RET_VAL = RANDOM_INT / 2 ** 32;
    return RET_VAL;
  }

  reloadPage() {
    this._browser.location.reload();
  }

}
