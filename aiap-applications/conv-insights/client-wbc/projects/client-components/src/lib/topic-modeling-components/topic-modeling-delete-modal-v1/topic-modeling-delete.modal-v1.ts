/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  BaseModal
} from 'client-shared-views';

import {
  EventsServiceV1,
} from 'client-shared-services';

import {
  TopicModelingService
} from 'client-services';

import {
  TOPIC_MODELING_MESSAGES,
} from 'client-utils';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-topic-modeling-delete-modal-v1',
  templateUrl: './topic-modeling-delete.modal-v1.html',
  styleUrls: ['./topic-modeling-delete.modal-v1.scss']
})
export class TopicModelingDeleteModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'TopicModelingDeleteModalV1';
  }

  _ids: Array<any> = [];
  ids: any = lodash.cloneDeep(this._ids);

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private topicModelingService: TopicModelingService,
  ) {
    super();
  }

  ngOnInit() { }

  ngAfterViewInit(): void { }

  ngOnDestroy() { }

  delete() {
    _debugX(TopicModelingDeleteModalV1.getClassName(), 'delete', { this_ids: this.ids });
    this.topicModelingService.deleteManyByIds(this.ids)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleDeleteManyByIdsErrors(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugX(TopicModelingDeleteModalV1.getClassName(), 'delete', { response });
        this.notificationService.showNotification(TOPIC_MODELING_MESSAGES.SUCCESS.DELETE_MANY_BY_IDS);
        this.eventsService.loadingEmit(false);
        this.close();
        this.eventsService.filterEmit(undefined);
      });
  }

  handleDeleteManyByIdsErrors(error: any) {
    _debugX(TopicModelingDeleteModalV1.getClassName(), 'handleDeleteManyByIdsErrors', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(TOPIC_MODELING_MESSAGES.ERROR.DELETE_MANY_BY_IDS);
    return of();
  }

  show(ids: any) {
    _debugX(TopicModelingDeleteModalV1.getClassName(), 'show', { ids });
    if (
      !lodash.isEmpty(ids)
    ) {
      this.ids = lodash.cloneDeep(ids);
      this.superShow();
    } else {
      this.notificationService.showNotification(TOPIC_MODELING_MESSAGES.ERROR.MISSING_MANY);
    }
  }

}
