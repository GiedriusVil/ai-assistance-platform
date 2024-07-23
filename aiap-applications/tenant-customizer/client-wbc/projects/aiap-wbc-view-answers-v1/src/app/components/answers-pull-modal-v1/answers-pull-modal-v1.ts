/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, ViewChild } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  BaseModalV1
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
  ANSWERS_MESSAGES,
} from '../../messages';

import {
  AnswersCompareModalV1
} from '../answers-compare-modal-v1/answers-compare-modal-v1';

@Component({
  selector: 'aiap-answers-pull-modal-v1',
  templateUrl: './answers-pull-modal-v1.html',
  styleUrls: ['./answers-pull-modal-v1.scss'],
})
export class AnswersPullModalV1 extends BaseModalV1 {

  static getClassName() {
    return 'AnswersPullModalV1';
  }

  @ViewChild('answersCompareModal') answersCompareModal: AnswersCompareModalV1;

  _state = {
    showComparison: true,
  }
  _answerStore: any = {
    id: undefined,
    name: undefined,
    assistant: undefined,
    pullConfiguration: undefined
  };
  state: any = lodash.cloneDeep(this._state);
  answerStore: any = lodash.cloneDeep(this._answerStore);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private answersService: AnswersServiceV1
  ) {
    super();
  }

  pull() {
    const ANSWER_STORE_ID = this.answerStore.id;
    _debugX(AnswersPullModalV1.getClassName(), 'pull', { ANSWER_STORE_ID });

    this.answersService.pullAnswerStore(ANSWER_STORE_ID)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handlePullAnswerStoreError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response) => {
        _debugX(AnswersPullModalV1.getClassName(), 'pull', { response });
        this.notificationService.showNotification(ANSWERS_MESSAGES.SUCCESS.ANSWER_STORE_PULLED);
        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(null);
        if (this.state.showComparison) {
          const ANSWERS_BEFORE = ramda.pathOr([], ['before', 'answers'], response);
          const ANSWERS_AFTER = ramda.pathOr([], ['after', 'answers'], response);
          const COMPARE_DATA = {
            source: {
              answers: ANSWERS_BEFORE,
              displayName: 'version before pull'
            },
            target: {
              answers: ANSWERS_AFTER,
              displayName: 'version after pull'
            },
          };
          this.answersCompareModal.show(COMPARE_DATA);
        }
        this.close();
      });
  }

  handleShowComparisonToggle() {
    this.state.showComparison = !this.state.showComparison;
  }

  handlePullAnswerStoreError(error: any) {
    this.close();
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(ANSWERS_MESSAGES.ERROR.FAILED_TO_PULL_ANSWER_STORE);
    return of();
  }

  show(store: any) {
    this.state = lodash.cloneDeep(this._state);
    _debugX(AnswersPullModalV1.getClassName(), 'show', { store });
    if (
      store?.id
    ) {
      this.answerStore = store;
      this.superShow();
    } else {
      this.notificationService.showNotification(ANSWERS_MESSAGES.ERROR.FAILED_TO_PULL_ANSWER_STORE);
    }
  }

}
