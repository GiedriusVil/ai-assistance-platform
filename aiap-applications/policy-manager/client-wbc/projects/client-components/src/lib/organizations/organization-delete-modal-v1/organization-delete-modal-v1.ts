/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugW,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseModal,
} from 'client-shared-views';

import {
  OrganizationsServiceV1,
  OrganizationsImportServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-organization-delete-modal-v1',
  templateUrl: './organization-delete-modal-v1.html',
  styleUrls: ['./organization-delete-modal-v1.scss']
})
export class OrganizationDeleteModalV1 extends BaseModal implements OnInit, OnDestroy {

  static getClassName() {
    return 'OrganizationDeleteModalV1';
  }

  @Input() isImport: boolean = false;

  _ids: any = [];
  ids: any = lodash.cloneDeep(this._ids);

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private organizationsService: OrganizationsServiceV1,
    private organizationsImportService: OrganizationsImportServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.superNgOnInit(this.eventsService);
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  delete() {
    let service;
    if (
      this.isImport
    ) {
      service = this.organizationsImportService;
    } else {
      service = this.organizationsService;
    }
    service.deleteManyByIds(this.ids)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.hanldeDeleteManyByIdsErrors(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugW(OrganizationDeleteModalV1.getClassName(), 'delete', { response });
        const NOTIFICATION = {
          type: 'success',
          title: this.translateService.instant('organizations_delete_modal_v1.notification.success.removed'),
          target: '.notification-container',
          duration: 5000
        };
        this.notificationService.showNotification(NOTIFICATION);
        this.eventsService.loadingEmit(false);
        this.close();
        this.eventsService.filterEmit(undefined);
        this.ids = lodash.cloneDeep(this._ids);
      });
  }

  hanldeDeleteManyByIdsErrors(error: any) {
    this.eventsService.loadingEmit(false);
    let message;
    if (error instanceof HttpErrorResponse) {
      message = `[${error.status} - ${error.statusText}] ${error.message} - ${JSON.stringify(error.error)}`;
    } else {
      message = `${JSON.stringify(error)}`;
    }
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('organizations_delete_modal_v1.notification.error.delete'),
      message: message,
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  show(ids: any[]) {
    _debugW(OrganizationDeleteModalV1.getClassName(), 'show', { ids });
    if (
      !lodash.isEmpty(ids)
    ) {
      this.ids = lodash.cloneDeep(ids);
      this.superShow();
    } else {
      const NOTIFICATION = {
        type: 'error',
        title: this.translateService.instant('organizations_delete_modal_v1.notification.error.delete'),
        target: '.notification-container',
        duration: 10000
      };
      this.notificationService.showNotification(NOTIFICATION);
    }
  }
}
