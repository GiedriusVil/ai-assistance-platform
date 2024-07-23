import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';

import {
  ConfigServiceV1,
  DataServiceV1,
  StylesServiceV1,
} from "client-services";

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as R from 'ramda';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  config = {};

  constructor(
    private router: Router,
    private configService: ConfigServiceV1,
    private dataService: DataServiceV1,
    private stylesService: StylesServiceV1,
  ) {
    this.config = this.configService.getConfig();
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(async resolve => {
      if (R.pathOr(false, ['jwtRequired'], this.config)) {
        const decoded = await this.dataService.verifyJwt(route.queryParamMap.get('jwt') || undefined);
        if (decoded) {
          this.configService.setJwt(decoded);
          resolve(true);
        } else {
          // redirect to some view explaining what happened
          await this.router.navigateByUrl('/auth');
          resolve(false);
        }
      } else {
        resolve(true);
      }
    });
  }
}
