/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  NotificationService
} from 'client-shared-carbon';

import {
  BaseModal
} from 'client-shared-views';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
} from 'client-shared-services';

import {
  UsersServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-user-delete-modal-v1',
  templateUrl: './user-delete-modal-v1.html',
  styleUrls: ['./user-delete-modal-v1.scss'],
})
export class UserDeleteModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'UserDeleteModalV1';
  }

  _users: any = [];
  users: any = lodash.cloneDeep(this._users);

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private userService: UsersServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit() {
    //
  }

  hanldeDeleteManyByIds() {
    this.userService.deleteManyByIds(this.users)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.hanldeDeleteManyByIdsError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(UserDeleteModalV1.getClassName(), 'hanldeDeleteManyByIds',
          {
            response,
          });

        const NOTIFICATION = {
          type: 'success',
          title: 'Users were deleted',
          target: '.notification-container',
          duration: 10000
        }
        this.notificationService.showNotification(NOTIFICATION);
        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(undefined);
        this.close();
      });
  }

  hanldeDeleteManyByIdsError(error: any) {
    _debugX(UserDeleteModalV1.getClassName(), 'hanldeDeleteManyByIdsError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: 'Unable to delete users',
      target: '.notification-container',
      duration: 10000
    }
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  show(users: Array<any>) {
    _debugX(UserDeleteModalV1.getClassName(), 'show',
      {
        users,
      });
    if (
      !lodash.isEmpty(users)
    ) {
      this.users = lodash.cloneDeep(users);
      this.superShow();
    }
  }

}
