/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, merge, fromEvent } from 'rxjs';

import { UserIdleService } from 'angular-user-idle';

import {
  _debugX,
} from 'client-shared-utils';

import {
  ConfigServiceV1,
  SessionServiceV1,
} from 'client-shared-services';

import {
  LoginServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-session-expiration-modal-v1',
  templateUrl: './session-expiration-modal-v1.html',
  styleUrls: ['./session-expiration-modal-v1.scss'],
})
export class SessionExpirationModalV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'SessionExpirationModalV1';
  }

  isOpen = false;

  private idleStatusChangedSubscription: Subscription;
  private timerStartSubscription: Subscription;
  private timeoutSubscription: Subscription;
  private pingSubscription: Subscription;

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private configService: ConfigServiceV1,
    private userIdleService: UserIdleService,
    private loginService: LoginServiceV1,
    private sessionService: SessionServiceV1,
  ) { }

  ngOnInit() {
    const CONFIG = this.configService.getConfig();
    _debugX(SessionExpirationModalV1.getClassName(), 'configs',
      {
        userIdleService: CONFIG?.userIdleService,
      });

    this.userIdleService.setConfigValues({
      idle: CONFIG?.userIdleService?.idle, // Allowed idle time period
      timeout: CONFIG?.userIdleService?.timeout, // Counter of timeout
      ping: CONFIG?.userIdleService?.ping,
      idleSensitivity: CONFIG?.userIdleService?.idleSensitivity,
    });
    this.userIdleService.setCustomActivityEvents(
      merge(
        fromEvent(window, 'mousemove'),
        fromEvent(window, 'resize'),
        fromEvent(document, 'keydown'),
        fromEvent(document, 'touchstart'),
        fromEvent(document, 'touchend'),
      ));

    this.ngZone.runOutsideAngular(() => {
      this.userIdleService.startWatching();
    });
    this.idleStatusChangedSubscription = this.userIdleService.onIdleStatusChanged().subscribe((status) => {
      _debugX(SessionExpirationModalV1.getClassName(), 'ngOnInit | onIdleStatusChanged',
        {
          status,
        });

    });
    this.timerStartSubscription = this.userIdleService.onTimerStart().subscribe((count) => {
      _debugX(SessionExpirationModalV1.getClassName(), 'ngOnInit | onTimerStart',
        {
          count,
        });

      this.show();
    });
    this.timeoutSubscription = this.userIdleService.onTimeout().subscribe(() => {
      _debugX(SessionExpirationModalV1.getClassName(), 'ngOnInit | onTimeout',
        {
          message: 'Time is up!'
        });

      this._logout();
    });
    this.pingSubscription = this.userIdleService.ping$.subscribe((ping) => {
      _debugX(SessionExpirationModalV1.getClassName(), 'ngOnInit | ping$',
        {
          ping,
        });
    });
  }

  ngOnDestroy(): void {
    this.userIdleService.stopWatching();
    this.removeSubscriptions();
  }

  extendSession() {
    this.userIdleService.stopWatching();
    const USER = this.sessionService.getUser();
    const TENANT = USER?.session?.tenant;
    const APPLICATION = USER?.session?.application;
    _debugX(SessionExpirationModalV1.getClassName(), 'extendSession',
      {
        TENANT,
        APPLICATION,
      });

    this.loginService.authorizeSession(TENANT, APPLICATION);
  }

  removeSubscriptions() {
    this.idleStatusChangedSubscription.unsubscribe();
    this.timerStartSubscription.unsubscribe();
    this.timeoutSubscription.unsubscribe();
    this.pingSubscription.unsubscribe();
  }

  close() {
    this._logout();
  }

  _logout() {
    this.userIdleService.stopWatching();
    this.removeSubscriptions();
    this.router.navigateByUrl('/login').then(() => {
      this.loginService.logout();
    });
  }

  show() {
    this.isOpen = true;
  }

}
