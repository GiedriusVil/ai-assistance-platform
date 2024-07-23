/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Injectable,
  NgZone,
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import { of } from 'rxjs';

import {
  _debugX,
} from 'client-shared-utils';


@Injectable({
  providedIn: 'root',
})
export class EnvironmentServiceV1 {

  static getClassName() {
    return 'EnvironmentServiceV1';
  }

  private environment: any = {
    host: undefined,
    hostUrl: undefined,
    path: undefined,
    tag: undefined,
    activatedRoute: undefined,
    router: undefined
  };

  constructor(
    environment: any
  ) {
    this.environment = environment;
  }

  getEnvironment() {
    return this.environment;
  }

  setEnvironment(environment: any) {
    this.environment = environment;
  }

  public addWbcDetailsToEnvironment(wbc: any) {
    const WBC_HOST = wbc?.host;
    const WBC_PATH = this.retrievePathFromWbcPath(wbc?.path);
    const WBC_TAG = wbc?.tag;
    _debugX(EnvironmentServiceV1.getClassName(), 'setEnvironmentByWBCConfiguration',
      {
        WBC_HOST,
        WBC_PATH,
        WBC_TAG,
      });

    this.setHost(WBC_HOST);
    this.setPath(WBC_PATH);
    this.setTag(WBC_TAG)
  }

  // [LEGO] -> DEPRECATED -> PLEASE DO NOT USE!
  public setEnvironmentByWBCConfiguration(wbc: any) {
    this.addWbcDetailsToEnvironment(wbc);
  }

  private retrievePathFromWbcPath(path: string) {
    const LAST_PATH_SPLIT_INDEX = path.lastIndexOf('/');
    if (
      LAST_PATH_SPLIT_INDEX === -1
    ) {
      return '';
    }
    return path.slice(0, LAST_PATH_SPLIT_INDEX);
  }

  public getActivatedRoute() {
    const RET_VAL = this.environment?.activatedRoute;
    return RET_VAL;
  }

  public setRouter(router: Router) {
    this.environment.router = router;
  }

  public getRouter() {
    const RET_VAL = this.environment?.router;
    return RET_VAL;
  }

  public setNgZone(ngZone: NgZone) {
    this.environment.ngZone = ngZone;
  }

  public getNgZone() {
    const RET_VAL = this.environment?.ngZone;
    return RET_VAL;
  }

  public setActivatedRoute(activatedRoute: ActivatedRoute) {
    this.environment.activatedRoute = activatedRoute;
  }

  public setHost(host: any) {
    this.environment.host = host;
    this.environment.hostUrl = host;
  }

  public getHost() {
    const RET_VAL = this.environment?.host;
    return RET_VAL;
  }

  public setPath(path: any) {
    this.environment.path = path;
  }

  public getPath() {
    const RET_VAL = this.environment?.path;
    return RET_VAL;
  }

  public setTag(tag: any) {
    this.environment.tag = tag;
  }

  public getTag() {
    const RET_VAL = this.environment?.tag;
    return RET_VAL;
  }

  findManyByQuery(query: any = undefined) {
    const ENVIRONMENTS = [
      {
        id: 'dev',
        name: 'dev',
      },
      {
        id: 'test',
        name: 'test',
      },
      {
        id: 'prod',
        name: 'prod',
      }
    ];
    const RET_VAL = of(ENVIRONMENTS);
    return RET_VAL;
  }

}
