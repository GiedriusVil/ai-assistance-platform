/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, Input } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  BaseModal
} from 'client-shared-views';

import {
  TOPIC_MODELING_MESSAGES,
} from 'client-utils';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
} from 'client-shared-services';

import {
  TopicModelingService,
} from 'client-services';

@Component({
  selector: 'aiap-topic-modeling-execute-modal-v1',
  templateUrl: './topic-modeling-execute.modal-v1.html',
  styleUrls: ['./topic-modeling-execute.modal-v1.scss']
})
export class TopicModelingExecuteModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'TopicModelingExecuteModalV1';
  }

  _topicModel: any = {
    id: undefined,
    name: undefined,
  }
  topicModel: any = lodash.cloneDeep(this._topicModel);

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private topicModelingService: TopicModelingService,
  ) {
    super();
  }

  ngOnInit() { }

  ngAfterViewInit(): void { }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  executeJob() {
    const TOPIC_MODEL_ID = this.topicModel?.id;
    _debugX(TopicModelingExecuteModalV1.getClassName(), 'train', { TOPIC_MODEL_ID });
    this.topicModelingService.executeJobById(TOPIC_MODEL_ID)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleTrainOneByIdError(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugX(TopicModelingExecuteModalV1.getClassName(), 'train', { response });
        this.notificationService.showNotification(TOPIC_MODELING_MESSAGES.SUCCESS.EXECUTE_JOB_BY_ID);
        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(undefined);
        this.close();
      });
  }


  handleTrainOneByIdError(error: any) {
    _debugX(TopicModelingExecuteModalV1.getClassName(), 'handleTrainOneByIdError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(TOPIC_MODELING_MESSAGES.ERROR.EXECUTE_JOB_BY_ID);
    return of();
  }

  show(topicModel: any) {
    _debugX(TopicModelingExecuteModalV1.getClassName(), 'show', { topicModel });
    if (
      !lodash.isEmpty(topicModel)
    ) {
      this.topicModel = lodash.cloneDeep(topicModel);
      this.superShow();
    } else {
      this.notificationService.showNotification(TOPIC_MODELING_MESSAGES.ERROR.SHOW_EXECUTE_MODAL);
    }
  }
}
