/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { Router, NavigationStart, } from '@angular/router';

import * as lodash from 'lodash'

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EnvironmentServiceV1
} from '.';


@Injectable({
  providedIn: 'root'
})
export class WbcLocationServiceV1 {

  static getClassName() {
    return 'WbcLocationServiceV1';
  }

  constructor(
    private router: Router,
    private environmentService: EnvironmentServiceV1,
  ) { }

  public handleNavigation() {
    this.router.events.subscribe((val: any) => {
      if (val instanceof NavigationStart) {
        if (val.id === 1 && val.navigationTrigger === 'imperative' || val.navigationTrigger === 'popstate') {
          const FULL_URL = val.url;
          const PARENTHESIS_START_INDEX = FULL_URL.indexOf('(');
          const PARENTHESIS_END_INDEX = FULL_URL.indexOf(')') + 1;
          const MICRO_OUTLET_URL = `/${FULL_URL.substring(PARENTHESIS_START_INDEX, PARENTHESIS_END_INDEX)}`;
          this.router.navigateByUrl(MICRO_OUTLET_URL);
        }
      }
    });
  }

  public navigateToPath(path: any, extras: any) {
    let url;
    let query = '';
    try {
      if (
        !lodash.isEmpty(extras?.queryParams) &&
        lodash.isObject(extras?.queryParams)
      ) {
        for (const KEY in extras?.queryParams) {
          const value: any = extras?.queryParams[KEY];
          // HTTP ESCAPE has to be added!!!
          query = `${query}&${KEY}=${value}`;
        }
        query = query.substring(1);
      }
      url = `${path}?${query}`;
      _debugX(WbcLocationServiceV1.getClassName(), 'navigateToPath',
        {
          url,
          path,
          extras,
        });
      this.router.navigateByUrl(url);
    } catch (error) {
      _errorX(WbcLocationServiceV1.getClassName(), 'navigateToPath',
        {
          error,
          url,
          path,
          extras,
        });
      throw error;
    }
  }

  public navigateToPathByEnvironmentServiceV1(path: any, extras: any) {
    let url;
    let query = '';
    try {
      if (
        !lodash.isEmpty(extras?.queryParams) &&
        lodash.isObject(extras?.queryParams)
      ) {
        for (const key in extras?.queryParams) {
          const value: any = extras?.queryParams[key];
          // HTTP ESCAPE has to be added!!!
          query = `${query}&${key}=${value}`;
        }
        query = query.substring(1);
      }
      url = `${path}?${query}`;
      _debugX(WbcLocationServiceV1.getClassName(), 'navigateToPathByEnvironmentService',
        {
          url,
          path,
          extras,
        });
      const ROUTER = this.environmentService.getRouter();
      const NG_ZONE = this.environmentService.getNgZone();
      _debugX(WbcLocationServiceV1.getClassName(), 'navigateToPathByEnvironmentService',
        {
          ROUTER,
          this_envService: this.environmentService,
        });
      NG_ZONE.run(() => { ROUTER.navigateByUrl(url) });
    } catch (error) {
      _errorX(WbcLocationServiceV1.getClassName(), 'navigateToPathByEnvironmentService',
        {
          error,
          url,
          path,
          extras,
        });
      throw error;
    }
  }

}
