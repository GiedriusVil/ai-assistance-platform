/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  BaseModalV1
} from 'client-shared-views';

import {
  _debugX,
  _errorX
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
  selector: 'aiap-answer-stores-pull-modal-v1',
  templateUrl: './answer-stores-pull-modal-v1.html',
  styleUrls: ['./answer-stores-pull-modal-v1.scss']
})
export class AnswerStoresPullModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AnswerStoresPullModalV1';
  }

  aiServiceId: any;
  _selectedAnswerStores: Array<any> = [];
  selectedAnswerStores = lodash.cloneDeep(this._selectedAnswerStores);
  _ids: Array<any> = [];
  ids: Array<any> = lodash.cloneDeep(this._ids);


  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private answerStoresService: AnswerStoresServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.superNgOnInit(this.eventsService);
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit() {
    //
  }

  pull(): void {
    const IDS = this.sanitizeAnswerStoresPullIds();
    _debugX(AnswerStoresPullModalV1.getClassName(), 'pull', { IDS: IDS });
    this.eventsService.loadingEmit(true);
    this.answerStoresService.pullManyByIds(IDS)
      .pipe(
        catchError((error) => this.handlePullManyByIdsError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(AnswerStoresPullModalV1.getClassName(), 'pull', { response });
        this.eventsService.loadingEmit(false)
        this.notificationService.showNotification(ANSWER_STORES_MESSAGES.SUCCESS.PULL_MANY_BY_IDS);
        this.close();
      });
  }

  sanitizeAnswerStoresPullIds() {
    const RET_VAL = [];
    for (const ANSWER_STORE of this.selectedAnswerStores) {
      const ANSWER_STORE_ID = ANSWER_STORE?.id;
      const ANSWER_STORE_PULL_CONFIG = ANSWER_STORE?.pullConfiguration;
      if (
        lodash.isObject(ANSWER_STORE_PULL_CONFIG) &&
        !lodash.isEmpty(ANSWER_STORE_PULL_CONFIG)
      ) {
        RET_VAL.push(ANSWER_STORE_ID);
      }
    }
    return RET_VAL;
  }

  private handlePullManyByIdsError(error: any): Observable<void> {
    this.eventsService.loadingEmit(false);
    _errorX(AnswerStoresPullModalV1.getClassName(), 'handlePullManyByIdsError', { error });
    this.notificationService.showNotification(ANSWER_STORES_MESSAGES.ERROR.PULL_MANY_BY_IDS);
    return of();
  }

  retrieveSelectedAnswerStoresIds(selectedAnswerStores) {
    const RET_VAL = [];
    for (const ANSWER_STORE of selectedAnswerStores) {
      const ANSWER_STORE_ID = ANSWER_STORE?.id;
      RET_VAL.push(ANSWER_STORE_ID);
    }
    return RET_VAL;
  }

  isPullDisabled() {
    let retVal = true;
    for (const ANSWER_STORE of this.selectedAnswerStores) {
      const ANSWER_STORE_PULL_CONFIG = ANSWER_STORE?.pullConfiguration;
      if (
        lodash.isObject(ANSWER_STORE_PULL_CONFIG) &&
        !lodash.isEmpty(ANSWER_STORE_PULL_CONFIG)
      ) {
        retVal = false;
      }
    }
    return retVal;
  }

  show(selectedAnswerStores: any) {
    if (
      lodash.isArray(selectedAnswerStores) &&
      !lodash.isEmpty(selectedAnswerStores)
    ) {
      this.selectedAnswerStores = lodash.cloneDeep(selectedAnswerStores);
      super.superShow();
    } else {
      this.notificationService.showNotification(ANSWER_STORES_MESSAGES.ERROR.SHOW_PULL_MODAL);
    }
  }

  close() {
    super.close();
    this.eventsService.filterEmit(null);
  }

}
