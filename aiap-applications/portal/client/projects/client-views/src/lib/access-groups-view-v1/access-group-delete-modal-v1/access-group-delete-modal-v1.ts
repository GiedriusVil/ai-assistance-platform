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
  BaseModal,
} from 'client-shared-views';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
} from 'client-shared-services';

import {
  AccessGroupsServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-access-group-delete-modal-v1',
  templateUrl: './access-group-delete-modal-v1.html',
  styleUrls: ['./access-group-delete-modal-v1.scss'],
})
export class AccessGroupDeleteModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AccessGroupDeleteModalV1';
  }

  comment = undefined;

  _groups: any = [];
  groups: any = lodash.cloneDeep(this._groups);

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private accessGroupsService: AccessGroupsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.superNgOnInit(this.eventsService);
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngAfterViewInit() {
    //
  }

  hanldeDeleteManyByIds() {
    this.accessGroupsService.deleteManyByIds(this.groups)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.hanldeDeleteManyByIdsError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response) => {
        _debugX(AccessGroupDeleteModalV1.getClassName(), 'hanldeDeleteManyByIds',
          {
            response,
          });

        const NOTIFICATION = {
          type: 'success',
          title: 'Access groups were deleted',
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
    _debugX(AccessGroupDeleteModalV1.getClassName(), 'hanldeDeleteManyByIdsError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: 'Unable to delete access groups',
      target: '.notification-container',
      duration: 10000
    }
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  show(groups: Array<any>) {
    _debugX(AccessGroupDeleteModalV1.getClassName(), 'show',
      {
        groups,
      });

    this.comment = undefined;
    if (
      !lodash.isEmpty(groups)
    ) {
      this.groups = lodash.cloneDeep(groups);
      this.superShow();
    }
  }

}
