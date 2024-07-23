/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  NotificationService,
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
  ApplicationsServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-application-delete-modal-v1',
  templateUrl: './application-delete-modal-v1.html',
  styleUrls: ['./application-delete-modal-v1.scss']
})
export class ApplicationDeleteModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'ApplicationDeleteModalV1';
  }

  _applicationsIds: any = [];
  applicationsIds: any = lodash.cloneDeep(this._applicationsIds);

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private applicationService: ApplicationsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.superNgOnInit(this.eventsService);
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  delete() {
    this.applicationService.deleteManyByIds(this.applicationsIds)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleDeleteManyByIdsErrors(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugX(ApplicationDeleteModalV1.getClassName(), 'delete',
          {
            response,
          });

        const NOTIFICATION = {
          type: 'success',
          title: 'Applications removed!',
          target: '.notification-container',
          duration: 5000
        };
        this.notificationService.showNotification(NOTIFICATION);
        this.eventsService.loadingEmit(false);
        this.close();
        this.eventsService.filterEmit(undefined);
      });
  }

  handleDeleteManyByIdsErrors(error: any) {
    _debugX(ApplicationDeleteModalV1.getClassName(), 'handleDeleteManyByIdsErrors',
      {
        error,
      });
    this.eventsService.loadingEmit(false);
    let message;
    if (
      error instanceof HttpErrorResponse
    ) {
      message = `[${error.status} - ${error.statusText}] ${error.message} - ${JSON.stringify(error.error)}`;
    } else {
      message = `${JSON.stringify(error)}`;
    }
    const NOTIFICATION = {
      type: 'error',
      title: 'Unable delete applications',
      message: message,
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  show(applicationsIds: any) {
    if (
      !lodash.isEmpty(applicationsIds)
    ) {
      this.applicationsIds = lodash.cloneDeep(applicationsIds);
      this.superShow();
    } else {
      const NOTIFICATION = {
        type: 'error',
        title: 'Unable delete applications',
        target: '.notification-container',
        duration: 10000
      };
      this.notificationService.showNotification(NOTIFICATION);
    }
  }

}
