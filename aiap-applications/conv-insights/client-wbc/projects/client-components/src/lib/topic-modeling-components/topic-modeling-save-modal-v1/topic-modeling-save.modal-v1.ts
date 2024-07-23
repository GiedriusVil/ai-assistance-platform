/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  NotificationService
} from 'carbon-components-angular';

import {
  BaseModal
} from 'client-shared-views';


import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
} from 'client-shared-services';

import {
  TopicModelingSaveDataTabV1
} from './topic-modeling-save-data-tab-v1/topic-modeling-save-data.tab-v1';

import {
  TopicModelingService,
} from 'client-services';

import { TOPIC_MODELING_MESSAGES } from 'client-utils';

@Component({
  selector: 'aiap-topic-modeling-save-modal-v1',
  templateUrl: './topic-modeling-save.modal-v1.html',
  styleUrls: ['./topic-modeling-save.modal-v1.scss'],
})
export class TopicModelingSaveModalV1 extends BaseModal implements OnInit, AfterViewInit, OnDestroy {

  static getClassName() {
    return 'TopicModelingSaveModalV1';
  }

  _topic = {
    name: undefined,
    topicMinerUrl: undefined,
    dateRange: {},
    confidence: undefined
  };

  topic: any = lodash.cloneDeep(this._topic);

  _summary = {
    totalTranscripts: undefined,
    totalMessages: undefined,
    isLoaded: false,
    retrievingData: false
  };

  summary: any = lodash.cloneDeep(this._summary);

  @ViewChild('dataTab', { static: true }) dataTab: TopicModelingSaveDataTabV1;

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private topicModelingService: TopicModelingService,
    private sessionService: SessionServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngAfterViewInit() {
    //
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  loadFormData(id: any) {
    this.topicModelingService.findOneById(id).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.sendErrorNotification(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response) => {
      _debugX(TopicModelingSaveModalV1.getClassName(), 'loadFormData', { response });
      this.topic = response;
      this.superShow();
      this.eventsService.loadingEmit(false);
    });
  }

  handleDateRangeChange(dateRange) {
    _debugX(TopicModelingSaveModalV1.getClassName(), 'handleDateRangeChange', { dateRange });
    this.topic.dateRange = dateRange;
  }

  isSummaryDisabled() {
    let retVal = true;
    const DATE_RANGE = this.topic?.dateRange;
    const DATE_RANGE_FROM = DATE_RANGE?.from;
    const DATE_RANGE_TO = DATE_RANGE?.to;
    if (
      DATE_RANGE_FROM &&
      DATE_RANGE_TO
    ) {
      retVal = false;
    }
    return retVal;
  }

  _sanitizeQuery() {
    const FILTER = {
      dateRange: this.topic?.dateRange,
      confidenceRate: this.topic?.confidence
    };
    const QUERY = {
      filter: FILTER
    };
    return QUERY;
  }

  getSummary() {
    this.summary.retrievingData = true;
    const SANITIZED_QUERY = this._sanitizeQuery();
    this.topicModelingService.getSummaryByQuery(SANITIZED_QUERY).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.sendErrorNotification(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response) => {
      _debugX(TopicModelingSaveModalV1.getClassName(), 'getSummary', { response });
      this.summary = response;
      this.summary.isLoaded = true;
      this.summary.retrievingData = false;
      this.superShow();
      this.eventsService.loadingEmit(false);
    });
  }

  loadNewJob() {
    this.topicModelingService.getNewJob().pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.sendErrorNotification(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response) => {
      _debugX(TopicModelingSaveModalV1.getClassName(), 'loadFormData', { response });
      this.topic = response;
      this.superShow();
      this.eventsService.loadingEmit(false);
    });
  }

  private sendErrorNotification(error: any) {
    _errorX(TopicModelingSaveModalV1.getClassName(), 'loadData', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(TOPIC_MODELING_MESSAGES.ERROR.FIND_ONE_BY_ID);
    return of();
  }

  _sanitizedTopic() {
    const TOPIC = lodash.cloneDeep(this.topic);
    // const DATA_TAB = this.dataTab.getValue();
    // TOPIC.data = DATA_TAB;
    return TOPIC;
  }

  save() {
    const SANITIZED_TOPIC = this._sanitizedTopic();
    this.topicModelingService.saveOne(SANITIZED_TOPIC).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleSaveFormError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(TopicModelingSaveModalV1.getClassName(), 'save', { response });
      this.notificationService.showNotification(TOPIC_MODELING_MESSAGES.SUCCESS.SAVE_ONE);
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(undefined);
      this.close();
    });
  }

  isInvalid() {
    let retVal =
      !this.topic?.name ||
      !this.topic?.topicMinerUrl ||
      !this.topic?.dateRange?.from ||
      !this.topic?.dateRange?.to

    return retVal;
  }

  handleSaveFormError(error: any) {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(TOPIC_MODELING_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

  show(id: string) {
    _debugX(TopicModelingSaveModalV1.getClassName(), 'show', { id });
    this.summary = lodash.cloneDeep(this._summary);
    if (
      lodash.isString(id) &&
      !lodash.isEmpty(id)
    ) {
      this.loadFormData(id);
    } else {
      this.loadNewJob();
    }
  }
}
