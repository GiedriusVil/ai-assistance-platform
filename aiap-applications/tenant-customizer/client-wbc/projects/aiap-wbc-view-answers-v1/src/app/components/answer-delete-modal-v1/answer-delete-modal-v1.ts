/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as lodash from 'lodash';

import {
  BaseModal
} from 'client-shared-views';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  AnswersServiceV1,
} from 'client-services';

import {
  _debugX,
} from 'client-shared-utils';

import {
  ANSWERS_MESSAGES
} from '../../messages';

@Component({
  selector: 'aiap-answer-delete-modal-v1',
  templateUrl: './answer-delete-modal-v1.html',
  styleUrls: ['./answer-delete-modal-v1.scss'],
})
export class AnswerDeleteModalV1 extends BaseModal {

  static getClassName() {
    return 'AnswerDeleteModalV1';
  }

  comment: boolean = undefined;

  answerStoreId: string = undefined;
  _answerKeys: string[] = [];
  answerKeys: string[] = lodash.cloneDeep(this._answerKeys);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private answersService: AnswersServiceV1
  ) {
    super();
  }

  delete() {
    this.answersService.deleteManyByKeys(this.answerStoreId, this.answerKeys)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleDeleteError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response) => {
        _debugX(AnswerDeleteModalV1.getClassName(), 'delete', response);
        this.notificationService.showNotification(ANSWERS_MESSAGES.SUCCESS.DELETE_MANY_BY_KEYS);
        this.eventsService.loadingEmit(false);
        this.close();
      });
  }

  handleDeleteError(error: any) {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(ANSWERS_MESSAGES.ERROR.DELETE_MANY_BY_KEYS);
    return of();
  }

  show(answerStoreId: any, answerKeys: Array<any>) {
    this.answerStoreId = answerStoreId;
    this.answerKeys = answerKeys;
    this.comment = undefined;
    super.superShow();
  }

  close() {
    super.close();
    this.eventsService.filterEmit(null);
  }

}
