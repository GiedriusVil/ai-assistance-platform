/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, Input } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  NotificationService
} from 'client-shared-carbon';

import {
  BaseModal
} from 'client-shared-views';

import {
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
} from 'client-shared-services';

import {
  TenantsServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-tenants-import-modal-v1',
  templateUrl: './tenants-import-modal-v1.html',
  styleUrls: ['./tenants-import-modal-v1.scss'],
})
export class TenantsImportModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'TenantsImportModalV1';
  }

  @Input() files = new Set();

  uploadButtonDisabled = true;

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationService,
    private tenantsService: TenantsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit(): void {
    //
  }

  showImportModal(): void {
    this.uploadButtonDisabled = true;
    this.superShow();
  }

  async import() {
    const uploadedFile = ramda.path(['file'], this.files.values().next().value);
    this.eventsService.loadingEmit(true);
    this.tenantsService.importFromFile(uploadedFile).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleImportError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      const NOTIFICATION = {
        type: 'success',
        title: 'Tenants imported',
        target: '.notification-container',
        duration: 10000
      }
      this.notificationService.showNotification(NOTIFICATION);
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(null);
      this.close();
    });
  }

  handleImportError(error: any) {
    _errorX(TenantsImportModalV1.getClassName(), 'handleImportError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: 'Unable to import tenants',
      target: '.notification-container',
      duration: 10000
    }
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  clearFileContainer(): void {
    this.files.clear();
  }

  onFileAdd(event: any): void {
    if (!lodash.isEmpty(event)) {
      this.uploadButtonDisabled = false;
    } else {
      this.uploadButtonDisabled = true;
    }
  }

  close() {
    super.close();
    this.clearFileContainer();
  }
}
