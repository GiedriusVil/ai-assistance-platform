/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, Input } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  ANSWERS_MESSAGES
} from '../../messages';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  AnswersServiceV1,
} from 'client-services';

import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { BaseModalV1 } from 'client-shared-views';

@Component({
  selector: 'aiap-answer-store-import-modal-v1',
  templateUrl: './answer-stores-import-modal-v1.html',
  styleUrls: ['./answer-stores-import-modal-v1.scss'],
})
export class AnswerStoresImportModalV1 extends BaseModalV1 implements OnDestroy {

  static getClassName() {
    return 'AnswerStoresImportModalV1';
  }

  uploadButtonDisabled = true;
  answerStoreId: string = undefined;

  @Input() files = new Set();

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private answersService: AnswersServiceV1,
  ) {
    super()
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  show(answerStoreId: string): void {
    this.clearFileContainer();
    this.answerStoreId = answerStoreId;
    this.uploadButtonDisabled = true;
    this.superShow();
  }

  async import() {
    const FILE = ramda.path(['file'], this.files.values().next().value);
    this.checkFile(FILE);
    _debugX(AnswerStoresImportModalV1.getClassName(), 'import', { FILE });
    this.answersService.importAnswers(this.answerStoreId, FILE).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleImportManyFromFile(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(AnswerStoresImportModalV1.getClassName(), 'import', { response });
      this.notificationService.showNotification(ANSWERS_MESSAGES.SUCCESS.IMPORT_MANY_FROM_FILE);
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(null);
      this.close();
    });
  }

  handleImportManyFromFile(error: any) {
    _errorX(AnswerStoresImportModalV1.getClassName(), 'handleImportManyFromFile', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(ANSWERS_MESSAGES.ERROR.IMPORT_MANY_FROM_FILE);
    return of();
  }

  clearFileContainer(): void {
    this.files.clear();
  }

  checkFile(FILE) {
    const FILE_TYPE = ramda.pathOr('N/A', ['type'], FILE);
    switch (FILE_TYPE) {
      case 'application/json':
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        this.uploadButtonDisabled = false;
        break;
      default:
        this.uploadButtonDisabled = true;
    }
  }

  onFileAdd(event: any): void {
    if (!lodash.isEmpty(event)) {
      this.uploadButtonDisabled = false;
    } else {
      this.uploadButtonDisabled = true;
    }
  }
}
