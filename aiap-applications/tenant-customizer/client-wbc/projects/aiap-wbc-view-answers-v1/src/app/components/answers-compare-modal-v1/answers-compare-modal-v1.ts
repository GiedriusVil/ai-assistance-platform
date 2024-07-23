/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
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
  QueryServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  ANSWERS_MESSAGES
} from '../../messages';

import {
  AnswersServiceV1,
} from 'client-services';

import { AcaJsonDifference } from 'client-shared-components';

@Component({
  selector: 'aiap-answers-compare-modal-v1',
  templateUrl: './answers-compare-modal-v1.html',
  styleUrls: ['./answers-compare-modal-v1.scss'],
})
export class AnswersCompareModalV1 extends BaseModalV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'AnswersCompareModalV1';
  }

  @ViewChild('jsonDiff') jsonDiff: AcaJsonDifference

  sourceArray: any[] = [];
  targetArray: any[] = [];

  _state = {
    queryType: DEFAULT_TABLE.ANSWERS.TYPE,
    defaultSort: DEFAULT_TABLE.ANSWERS.SORT,
    sourceDisplayName: '',
    targetDisplayName: '',
  }

  state: any = lodash.cloneDeep(this._state);

  constructor(
    private answersService: AnswersServiceV1,
    private queryService: QueryServiceV1,
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
  ) {
    super();
  }

  ngOnInit() {
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  sanitizeAnswersArray(answersArray) {
    answersArray.forEach(answer => {
      delete answer.id;
      if (!lodash.isArray(answer.values)) {
        answer.values = [];
      }
    });
  }

  async retrieveTargetArray(targetStoreId) {
    const QUERY_TYPE = this.state.queryType + '_' + targetStoreId;
    const DEFAULT_QUERY = this.queryService.query(QUERY_TYPE);
    DEFAULT_QUERY.pagination.size = 999999999;
    return this.answersService.findAnswersByQuery(targetStoreId, DEFAULT_QUERY)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleFindAnswersByQueryError(error)),
      ).subscribe((response: any) => {
        _debugX(AnswersCompareModalV1.getClassName(), `retrieveTargetArray`,
          {
            response,
          });

        if (lodash.isArray(response.items)) {
          this.targetArray = response?.items;
          this.sanitizeAnswersArray(this.targetArray);
          this.eventsService.loadingEmit(false);
          this.superShow();
        } else {
          this.showCompareErrorNotification();
        }
      });
  }

  handleFindAnswersByQueryError(error) {
    this.showCompareErrorNotification();
    return of();
  }

  showCompareErrorNotification() {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(ANSWERS_MESSAGES.ERROR.COMPARE);
  }

  show(params) {
    this.state = lodash.cloneDeep(this._state);

    const SOURCE = params?.source;
    const TARGET = params?.target;
    this.state.sourceDisplayName = SOURCE.displayName;
    this.state.targetDisplayName = TARGET.displayName;


    this.jsonDiff.createMonacoEditor();
    if (lodash.isArray(SOURCE.answers)) {
      this.sourceArray = SOURCE.answers;
      if (lodash.isArray(TARGET.answers)) {
        this.targetArray = TARGET.answers;
        this.sanitizeAnswersArray(this.targetArray);
        this.superShow();
      } else if (!lodash.isEmpty(TARGET.answerStoreId)) {
        this.retrieveTargetArray(TARGET.answerStoreId);
      }
    } else {
      this.showCompareErrorNotification();
    }
  }

  close() {
    this.jsonDiff.clearMonacoContainer();
    super.close();
  }
}
