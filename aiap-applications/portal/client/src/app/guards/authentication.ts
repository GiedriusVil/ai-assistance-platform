/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
} from 'client-shared-services';

import {
  LoginServiceV1,
} from 'client-services';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  static getClassName() {
    return 'AuthenticationGuard';
  }

  constructor(
    private router: Router,
    private loginService: LoginServiceV1,
    private sessionService: SessionServiceV1,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.loginService.isLoggedIn()) {
      return true;
    }
    // navigate to login page
    this.router.navigate(['/login'], {
      replaceUrl: true
    });
    // you can save redirect url so after authing we can move them back to the page they requested
    return false;
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    let retVal = false;
    _debugX(AuthenticationGuard.getClassName(), `canActivateChild`, { next, state });
    if (
      (
        next?.data?.requiresTenantPolicy ||
        next?.data?.requiresApplicationPolicy
      )
    ) {
      const COMPONENT_IN_ROLE_TABLE = next.data.componentInRoleTable || next.data.component;
      retVal = this.sessionService.isViewAllowed(COMPONENT_IN_ROLE_TABLE);
      if (
        !retVal
      ) {
        this.router.navigate(['main-view/unauthorized']);
      }
    } else {
      retVal = true;
    }

    return of(retVal);
  }
}
