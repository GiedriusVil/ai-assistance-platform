/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import {
  SessionServiceV1,
} from 'client-shared-services';

import {
  _debugX
} from 'client-shared-utils';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  static getClassName() {
    return 'AuthenticationGuard';
  }

  constructor(
    private router: Router,
    private sessionService: SessionServiceV1,
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    _debugX(AuthenticationGuard.getClassName(), 'canActivate', {
      isSessionActive: this.sessionService.isSessionActive()
    })
    if (this.sessionService.isSessionActive()) {
      return true;
    }
    // navigate to login page
    alert('MISSING_LOGIN_STATE');
    this.router.navigateByUrl('/login');
    // you can save redirect url so after authing we can move them back to the page they requested
    return false;
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    let retVal = false;
    _debugX(AuthenticationGuard.getClassName(), `canActivateChild`, { next, state });
    retVal = this.sessionService.isViewAllowed(next.data.component);
    if (
      !retVal
    ) {
      this.router.navigate(['main-view/unauthorized']);
    }

    return of(retVal);
  }
}
