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
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  BaseModal
} from 'client-shared-views';

import {
  QueriesConfigurationsService
} from 'client-services'

import {
  QUERIES_CONFIGURATION_MESSAGES
} from 'client-utils';

@Component({
  selector: 'aiap-queries-import-modal-v1',
  templateUrl: './query-import-modal-v1.html',
  styleUrls: ['./query-import-modal-v1.scss'],
})
export class QueryImportModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'QueryImportModalV1';
  }

  @Input() files = new Set();

  uploadButtonDisabled = true;

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private queriesService: QueriesConfigurationsService,
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
    this.queriesService.importFromFile(uploadedFile).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleImportError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      this.notificationService.showNotification(QUERIES_CONFIGURATION_MESSAGES.SUCCESS.IMPORT);
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(null);
      this.close();
    });
  }

  handleImportError(error: any) {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(QUERIES_CONFIGURATION_MESSAGES.ERROR.IMPORT);
    return of();
  }

  handleEventImport(event: any) {
    _debugX(QueryImportModalV1.getClassName(), 'handleEventImport',
      {
        event,
      });

    this.import()
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
