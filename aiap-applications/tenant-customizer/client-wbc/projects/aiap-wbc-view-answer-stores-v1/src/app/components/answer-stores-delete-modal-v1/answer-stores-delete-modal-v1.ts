/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as lodash from 'lodash';

import {
  BaseModalV1
} from 'client-shared-views';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  AnswerStoresServiceV1,
} from 'client-services';

import {
  ANSWER_STORES_MESSAGES,
} from '../../messages';

@Component({
  selector: 'aiap-answer-stores-delete-modal-v1',
  templateUrl: './answer-stores-delete-modal-v1.html',
  styleUrls: ['./answer-stores-delete-modal-v1.scss'],
})
export class AnswerStoresDeleteModalV1 extends BaseModalV1 {

  static getClassName() {
    return 'AnswerStoresDeleteModalV1';
  }

  comment: string = undefined;

  _answersStoresIds = [];
  answersStoresIds = lodash.cloneDeep(this._answersStoresIds);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private answerStoresService: AnswerStoresServiceV1,
  ) {
    super();
  }

  close(): void {
    super.close();
    this.eventsService.filterEmit(null);
  }

  delete() {
    this.answerStoresService.deleteManyByIds(this.answersStoresIds, this.comment)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleDeleteError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response) => {
        _debugX(AnswerStoresDeleteModalV1.getClassName(), 'answer-store-delete-modal | delete | response',
          {
            response,
          });

        this.notificationService.showNotification(ANSWER_STORES_MESSAGES.SUCCESS.DELETE_MANY_BY_IDS);
        this.eventsService.loadingEmit(false);
        this.close();
      });
  }

  handleDeleteError(error: any) {
    _debugX(AnswerStoresDeleteModalV1.getClassName(), 'handleDeleteError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(ANSWER_STORES_MESSAGES.ERROR.DELETE_MANY_BY_IDS);
    return of();
  }

  show(storeIds: any) {
    _debugX(AnswerStoresDeleteModalV1.getClassName(), 'answer-store-delete-modal | show | storeIds',
      {
        storeIds,
      });

    if (
      lodash.isArray(storeIds) &&
      !lodash.isEmpty(storeIds)
    ) {
      this.answersStoresIds = storeIds;
    } else {
      this.answersStoresIds = lodash.cloneDeep(this._answersStoresIds);
    }
    this.comment = undefined;
    super.superShow();
  }

}
