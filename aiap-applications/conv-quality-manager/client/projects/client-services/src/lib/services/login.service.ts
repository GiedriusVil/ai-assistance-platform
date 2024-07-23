/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import * as moment from 'moment';

import {
  _debugX,
  _errorX,
  _error,
  _info
} from 'client-shared-utils';

import {
  SessionServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  EventsServiceV1,
  LocalStorageServiceV1,
} from 'client-shared-services';

const LOCAL_STORAGE_KEY = {
  TOKEN: 'token',
  SESSION: 'session',
  TOKEN_EXPIRATION: 'token_expires_at'
};

@Injectable()
export class LoginService {

  static getClassName() {
    return 'LoginService';
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private sessionService: SessionServiceV1,
    private localStorageService: LocalStorageServiceV1,
  ) { }

  protected _hostUrl() {
    // const ENVIRONMENT = this.environmentService.getEnvironment();
    // console.log(ENVIRONMENT);
    // const RET_VAL = ENVIRONMENT.hostUrl;
    // return RET_VAL;
    return 'http://localhost:3001/';
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
      .then((response) => {
        this.sessionService.setSession(response);
        return response;
      });
    return RET_VAL;
  }

  authorizeSession(tenant: any, application: any) {
    const REQUEST_URL = `${this._hostUrl()}authorize/session`;
    const AUTH_HEADERS = this.sessionService.getAuthHeaders();

    const PLATFORM_SETTINGS = this.localStorageService.get('acaAiAssistantsPlatform');
    const REDIRECT_TO = ramda.pathOr('/main-view', [application?.id, 'lastOpenViewPath'], PLATFORM_SETTINGS);

    if (!lodash.isEmpty(application)) {

      /*
       * Value prevents updates
       */
      delete application.value;
    }

    this.http.post(REQUEST_URL, {
      tenant,
      application
    }, AUTH_HEADERS).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleAuthorizeTenantError(error))
    ).subscribe((response: any) => {
      this.sessionService.setSession(response);
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      let routeCurrent = this.router.url;
      let routeTo = response?.session?.application?.configuration?.route;
      if (
        lodash.isEmpty(routeTo) || !lodash.isString(routeTo)
      ) {
        routeTo = REDIRECT_TO;
      }
      _debugX(LoginService.getClassName(), 'authorizeSession', { routeCurrent, routeTo });
      this.router.navigate([routeTo]);
      this.eventsService.loadingEmit(false);
    });
  }

  /** Deprecated, please use 'authorizeSession' */
  authorizeTenant(tenant: any) {
    this.authorizeSession(tenant, null);
  }

  private handleAuthorizationError(error: any) {
    this.eventsService.loadingEmit(false);
    _error(`[${LoginService.name}] | handleAuthorizationError`, { error });

    let message;
    if (error instanceof HttpErrorResponse) {
      message = `${error.statusText} (${error.status})`;
    } else {
      message = `${JSON.stringify(error)}`;
    }

    const NOTIFICATION = {
      type: "error",
      title: "Authorization error",
      message: message,
      target: ".notification-container",
      duration: 10000
    };

    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  private handleAuthorizeTenantError(error: any) {
    this.eventsService.loadingEmit(false);
    _error(`[${LoginService.name}] | handleAuthorizeTenantError`, { error });
    // TO_DO -> Return and brainstorm error management & display
    let message;
    if (error instanceof HttpErrorResponse) {
      message = `[${error.status} - ${error.statusText}] ${error.message} - ${JSON.stringify(error.error)}`;
    } else {
      message = `${JSON.stringify(error)}`;
    }
    const NOTIFICATION = {
      type: "error",
      title: "Tenant authorization",
      message: message,
      target: ".notification-container",
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  logout() {
    this.sessionService.clearSession();
  }

  isLoggedIn() {
    const EXPIRATION: any = this.sessionService.getExpiration();
    return moment(new Date().toISOString()).isBefore(EXPIRATION);
  }

}
