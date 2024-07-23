/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';
import moment from 'moment';

import { NotificationService } from 'client-shared-carbon';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';



@Injectable()
export class LoginServiceV1 {

  static getClassName() {
    return 'LoginServiceV1';
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private environmentService: EnvironmentServiceV1,
    private eventsService: EventsServiceV1,
    private notificationService: NotificationService,
    private sessionService: SessionServiceV1,
  ) { }

  protected _hostUrl() {
    const ENVIRONMENT = this.environmentService.getEnvironment();
    const RET_VAL = ENVIRONMENT.hostUrl;
    return RET_VAL;
  }

  async postData(endpoint: string, body: any = {}) {
    return this.http.post(endpoint, body).toPromise();
  }

  async login(params) {
    const username = params.username;
    const password = params.password;
    const token = params.token;
    let loginUrl;
    let loginRequest;
    if (username && password) {
      loginUrl = `${this._hostUrl()}auth`;
      loginRequest = {
        username: username,
        password: password
      };
    } else {
      loginUrl = `${this._hostUrl()}sso-auth`;
      loginRequest = {
        token: token
      };
    }
    const RET_VAL = this.postData(loginUrl, loginRequest)
      .then(response => {
        this.sessionService.setSession(response);
        return response;
      });
    return RET_VAL;
  }

  authorizeSession(tenant: any, application: any) {
    const REQUEST_URL = `${this._hostUrl()}authorize/session`;
    const AUTH_HEADERS = this.sessionService.getAuthHeaders();
    if (!lodash.isEmpty(application)) {
      /*
       * Value prevents updates
       */
      delete application.value;
    }
    _debugX(LoginServiceV1.getClassName(), 'authorizeSession',
      {
        tenant,
        application,
      });

    this.http.post(REQUEST_URL, {
      tenant,
      application
    }, AUTH_HEADERS).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleAuthorizeTenantError(error))
    ).subscribe((response: any) => {
      _debugX(LoginServiceV1.getClassName(), 'authorizeSession',
        {
          response,
        });

      this.sessionService.setSession(response);
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';

      const SESSION = response?.session;
      const SESSION_APPLICATION_ID = SESSION?.application?.id;
      const SESSION_TENANT_ID = SESSION?.tenant?.id;
      const ACCESS_GROUP_TENANT = SESSION?.accessGroup?.tenants?.find(el => el.id === SESSION_TENANT_ID);
      const IS_APPLICATION_IN_ACCESS_GROUP = ACCESS_GROUP_TENANT?.applications?.find(el => el.id === SESSION_APPLICATION_ID);

      let routeTo = '/main-view/unauthorized';
      if (
        !lodash.isEmpty(IS_APPLICATION_IN_ACCESS_GROUP)
      ) {
        routeTo = SESSION?.application?.configuration?.route;
      }

      if (
        lodash.isEmpty(routeTo) ||
        !lodash.isString(routeTo)
      ) {
        routeTo = '/main-view';
      }

      _debugX(LoginServiceV1.getClassName(), 'authorizeSession',
        {
          routeTo,
        });

      this.router.navigateByUrl(routeTo).then(() => {
        window.location.reload();
      });

      this.eventsService.loadingEmit(false);
    });
  }

  authorizeTenant(tenant: any) {
    const REQUEST_URL = `${this._hostUrl()}authorize/tenant`;
    const AUTH_HEADERS = this.sessionService.getAuthHeaders();
    this.http
      .post(REQUEST_URL, tenant, AUTH_HEADERS)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleAuthorizeTenantError(error))
      ).subscribe((response: any) => {
        this.sessionService.setSession(response);

        const CURRENT_URL = this.router.url;

        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([CURRENT_URL]);
        this.eventsService.loadingEmit(false);
      });
  }

  private handleAuthorizeTenantError(error: any) {
    this.eventsService.loadingEmit(false);
    _errorX(LoginServiceV1.getClassName(), 'handleAuthorizeTenantError',
      {
        error,
      });

    // TODO -> Return and brainstorm error management & display
    let message;
    if (error instanceof HttpErrorResponse) {
      message = `[${error.status} - ${error.statusText}] ${error.message} - ${JSON.stringify(error.error)}`;
    } else {
      message = `${JSON.stringify(error)}`;
    }
    const NOTIFICATION: any = {
      type: 'error',
      title: 'Tenant authorization',
      subtitle: 'Tenant authorization',
      caption: 'Caption',
      message: message,
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  logout() {
    const REQUEST_URL = `${this._hostUrl()}api/v1/app/session/terminate`;
    const AUTH_HEADERS = this.sessionService.getAuthHeaders();
    this.http
      .post(REQUEST_URL, {}, AUTH_HEADERS)
      .subscribe((response: any) => {
        this.sessionService.clearSession();
      });
  }

  isLoggedIn() {
    const EXPIRATION = this.sessionService.getExpiration();
    return moment(new Date().toISOString()).isBefore(EXPIRATION);
  }
}
