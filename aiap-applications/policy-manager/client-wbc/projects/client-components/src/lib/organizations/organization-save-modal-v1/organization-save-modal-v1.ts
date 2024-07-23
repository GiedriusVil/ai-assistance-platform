/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  NotificationService,
} from 'carbon-components-angular'

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import {
  BaseModal,
} from 'client-shared-views';

import {
  EventsServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  OrganizationsServiceV1,
  OrganizationsImportServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-organization-save-modal-v1',
  templateUrl: './organization-save-modal-v1.html',
  styleUrls: ['./organization-save-modal-v1.scss']
})
export class OrganizationSaveModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'OrganizationSaveModalV1';
  }

  @Input() isImport: boolean = false;

  isEditEnabled = false;

  _organization: any = {
    id: null,
    external: {
      id: null
    },
    name: null,
    isBuyer: true,
    isSeller: false,
    isAuthorized: false
  };
  organization = lodash.cloneDeep(this._organization);

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

  ngAfterViewInit(): void { }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  save() {
    const ORGANIZATION = lodash.cloneDeep(this.organization);
    _debugW(OrganizationSaveModalV1.getClassName(), 'save', { ORGANIZATION });
    let service;
    if (
      this.isImport
    ) {
      service = this.organizationsImportService;
    } else {
      service = this.organizationsService;
    }
    service.saveOne(this.organization).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError(error => this.handleSaveOneError(error)),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugW(OrganizationSaveModalV1.getClassName(), 'save', { response });
      const NOTIFICATION = {
        type: 'success',
        title: this.translateService.instant('organization_save_modal_v1.notification.success.created'),
        target: '.notification-container',
        duration: 10000
      };
      this.notificationService.showNotification(NOTIFICATION);
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(undefined);
      this.isOpen = false;
    });
  }

  toggleEditMode() {
    this.isEditEnabled = !this.isEditEnabled;
  }

  handleSaveOneError(error: any) {
    _debugW(OrganizationSaveModalV1.getClassName(), 'handleSaveOneError', { error });
    this.eventsService.loadingEmit(false);
    let message;
    if (error instanceof HttpErrorResponse) {
      message = `[${error.status} - ${error.statusText}] ${error.message} - ${JSON.stringify(error.error)}`;
    } else {
      message = `${JSON.stringify(error)}`;
    }
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('organization_save_modal_v1.notification.error.created'),
      subtitle: this.translateService.instant('organization_save_modal_v1.notification.error.subtitle'),
      message: message,
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of({
      items: []
    });
  }

  close() {
    this.isOpen = false;
  }

  onChangeIsBuyer(event: any) {
    _debugW(OrganizationSaveModalV1.getClassName(), 'onChangeIsBuyer', { event });
    this.organization.isBuyer = event.checked;
  }

  onChangeIsSeller(event: any) {
    _debugW(OrganizationSaveModalV1.getClassName(), 'onChangeIsSeller', { event });
    this.organization.isSeller = event.checked;
  }

  onChangeIsAuthorized(event: any) {
    _debugW(OrganizationSaveModalV1.getClassName(), 'onChangeIsAuthorized', { event });
    this.organization.isAuthorized = event.checked;
  }

  show(organization: any) {
    _debugW(OrganizationSaveModalV1.getClassName(), 'onChangeIsAuthorized', { organization });
    if (
      !lodash.isEmpty(organization)
    ) {
      this.organization = lodash.cloneDeep(organization);
    } else {
      this.organization = lodash.cloneDeep(this._organization);
    }
    this.isEditEnabled = lodash.isEmpty(this.organization?.id);
    this.isOpen = true;
  }
}
