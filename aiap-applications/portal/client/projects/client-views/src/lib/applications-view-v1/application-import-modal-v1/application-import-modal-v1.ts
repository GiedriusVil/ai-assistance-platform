/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, Input } from '@angular/core';
import { NotificationService } from 'client-shared-carbon';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  APPLICATIONS_MESSAGES,
} from 'client-utils';

import {
  BaseModal,
} from 'client-shared-views';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
} from 'client-shared-services';

import {
  ApplicationsServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-application-import-modal-v1',
  templateUrl: './application-import-modal-v1.html',
  styleUrls: ['./application-import-modal-v1.scss'],
})
export class ApplicationImportModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'ApplicationImportModalV1';
  }

  @Input() files = new Set();

  uploadButtonDisabled = true;

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationService,
    private applicationsService: ApplicationsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.superNgOnInit(this.eventsService);
  }

  ngOnDestroy(): void {
    this.superNgOnDestroy();
  }

  ngAfterViewInit(): void {
    //
  }

  show(): void {
    this.uploadButtonDisabled = true;
    this.superShow();
  }

  async import() {
    const uploadedFile = ramda.path(['file'], this.files.values().next().value);
    this.eventsService.loadingEmit(true);
    this.applicationsService.importFromFile(uploadedFile).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleImportError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(ApplicationImportModalV1.getClassName(), 'import',
        {
          response,
        });

      this.notificationService.showNotification(APPLICATIONS_MESSAGES.SUCCESS.IMPORT_MANY_BY_QUERY);
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(null);
      this.close();
    });
  }

  handleImportError(error: any) {
    _errorX(ApplicationImportModalV1.getClassName(), 'handleImportError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(APPLICATIONS_MESSAGES.ERROR.IMPORT_MANY_BY_QUERY);
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
