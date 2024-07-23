/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import {
  PlatformLocation,
  Location,
} from '@angular/common';

import {
  ActivatedRoute,
} from '@angular/router';

import {
  map,
  Observable,
} from 'rxjs';

import {
  _debugX,
} from 'client-shared-utils';

@Injectable()
export class ActivatedRouteServiceV1 {

  static getClassName() {
    return 'ActivatedRouteServiceV1';
  }

  constructor(
    public activatedRoute: ActivatedRoute,
    private platformLocation: PlatformLocation,
  ) { }

  queryParams(): Observable<any> {
    const RET_VAL = this.activatedRoute.queryParams.pipe(
      map((params: any) => {
        const RET_VAL = {};

        const SEARCH = this.platformLocation.search;
        const SEARCH_NORMALIZED = Location.normalizeQueryParams(SEARCH);
        const URL_SEARCH_PARAMS = new URLSearchParams(SEARCH_NORMALIZED);

        for (const KEY of URL_SEARCH_PARAMS.keys()) {
          RET_VAL[KEY] = URL_SEARCH_PARAMS.get(KEY);
        }

        for (const KEY of Object.keys(params)) {
          RET_VAL[KEY] = params[KEY];
        }
        _debugX(ActivatedRouteServiceV1.getClassName(), 'queryParams',
          {
            params,
            SEARCH,
            SEARCH_NORMALIZED,
            RET_VAL,
          });

        return RET_VAL;
      })
    );
    return RET_VAL;
  }

}
