/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, Input } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  AnswerStoresServiceV1,
} from 'client-services';

import { BaseModalV1 } from 'client-shared-views';

import {
  ANSWER_STORES_MESSAGES,
} from '../../messages';

@Component({
  selector: 'aiap-answers-stores-import-modal-v1',
  templateUrl: './answer-stores-import-modal-v1.html',
  styleUrls: ['./answer-stores-import-modal-v1.scss'],
})
export class AnswerStoresImportModalV1 extends BaseModalV1 implements OnDestroy {

  static getClassName() {
    return 'AnswerStoresImportModalV1';
  }

  @Input() files = new Set();

  uploadButtonDisabled = true;

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private answerStoresService: AnswerStoresServiceV1,
  ) {
    super();
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  show(): void {
    this.clearFileContainer();
    this.uploadButtonDisabled = true;
    super.superShow();
  }

  close(): void {
    super.close();
    this.eventsService.filterEmit(null);
  }

  async import() {
    const FILE = ramda.path(['file'], this.files.values().next().value);
    _debugX(AnswerStoresImportModalV1.getClassName(), 'import',
      {
        FILE,
      });

    this.answerStoresService.importFromFile(FILE).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleImportManyFromFile(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(AnswerStoresImportModalV1.getClassName(), 'import', { response });
      this.notificationService.showNotification(ANSWER_STORES_MESSAGES.SUCCESS.IMPORT_MANY_FROM_FILE);
      this.eventsService.loadingEmit(false);
      this.close();
    });
  }

  handleImportManyFromFile(error: any) {
    _errorX(AnswerStoresImportModalV1.getClassName(), 'handleImportManyFromFile',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(ANSWER_STORES_MESSAGES.ERROR.IMPORT_MANY_FROM_FILE);
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
