/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseModal,
} from 'client-shared-views';

import {
  OrganizationsImportServiceV1,
} from 'client-services';


@Component({
  selector: 'aiap-organization-clear-modal-v1',
  templateUrl: './organization-clear-modal-v1.html',
  styleUrls: ['./organization-clear-modal-v1.scss']
})
export class OrganizationClearModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'OrganizationClearModalV1';
  }

  @Input() isImport: boolean = false;
  @Output() onClear = new EventEmitter<void>();

  isOpen = false;

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private organizationImportService: OrganizationsImportServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.superNgOnInit(this.eventsService);
  }

  ngAfterViewInit(): void { }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  clear() {
    this.organizationImportService.clearImport().pipe(
      catchError(error => this.hanldeClearError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response) => {
      _debugX(OrganizationClearModalV1.getClassName(), 'clear', { response });
      const NOTIFICATION = {
        type: 'success',
        title: this.translateService.instant('organizations_import_v1.clear_modal_v1.notification.success.title'),
        target: '.notification-container',
        duration: 5000
      };
      this.notificationService.showNotification(NOTIFICATION);
      this.isOpen = false;
      this.onClear.emit();
    });
  }

  private hanldeClearError(error: any) {
    this.eventsService.loadingEmit(false);
    let message;
    if (error instanceof HttpErrorResponse) {
      message = `[${error.status} - ${error.statusText}] ${error.message} - ${JSON.stringify(error.error)}`;
    } else {
      message = `${JSON.stringify(error)}`;
    }
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('organizations_import_v1.clear_modal_v1.notification.error.title'),
      message: message,
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  show(event: any) {
    _debugX(OrganizationClearModalV1.getClassName(), 'show', { event });
    if (
      !lodash.isEmpty(event)
    ) {
      this.isOpen = true;
    }
  }

}
