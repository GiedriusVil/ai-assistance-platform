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
  CLASSIFIER_MESSAGES,
} from 'client-utils';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  ClassifierServiceV1,
} from 'client-services';

import { BaseModal } from 'client-shared-views';

@Component({
  selector: 'aca-classifier-model-import-modal',
  templateUrl: './classifier-model-import-modal-v1.html',
  styleUrls: ['./classifier-model-import-modal-v1.scss'],
})
export class ClassifierModelImportModal extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'ClassifierModelImportModal';
  }

  @Input() files = new Set();

  uploadButtonDisabled = true;

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private classifierService: ClassifierServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    //
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit(): void {
    //
  }

  show(): void {
    this.clearFileContainer();
    this.uploadButtonDisabled = true;
    this.superShow();
  }

  async import() {
    const FILE = ramda.path(['file'], this.files.values().next().value);
    _debugX(ClassifierModelImportModal.getClassName(), 'import', { FILE });
    this.classifierService.importFromFile(FILE).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleImportManyFromFile(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(ClassifierModelImportModal.getClassName(), 'import', { response });
      this.notificationService.showNotification(CLASSIFIER_MESSAGES.SUCCESS.IMPORT_MANY_FROM_FILE);
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(null);
      this.close();
    });
  }

  handleImportManyFromFile(error: any) {
    _errorX(ClassifierModelImportModal.getClassName(), 'handleImportManyFromFile', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(CLASSIFIER_MESSAGES.ERROR.IMPORT_MANY_FROM_FILE);
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

}
