/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit } from '@angular/core';

import * as lodash from 'lodash';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugW, _debugX,
} from 'client-shared-utils';

import {
  ActivatedRouteServiceV1,
  TimezoneServiceV1,
} from 'client-shared-services';

import {
  BaseViewWbcV1,
} from 'client-shared-views';

import {
  CONVERSATIONS_MESSAGES,
  OUTLETS, TRANSCRIPTS_MESSAGES, _errorX,
} from 'client-utils';

import {
  ConversationService,
} from 'client-services';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'aiap-wbc-transcript-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class TranscriptViewV1 extends BaseViewWbcV1 implements OnInit {

  static getClassName() {
    return 'TranscriptViewV1';
  }

  outlet = OUTLETS.convInsights;

  messageId: any = null;
  data: any = null;
  parentIds = {};
  tags = [];

  reviewed: any = null;
  reviewedBy = 'none';
  reviewDate;

  userId = null;

  _state = {
    conversationId: null,
  }
  state: any = lodash.cloneDeep(this._state);

  constructor(
    private ActivatedRouteServiceV1: ActivatedRouteServiceV1,
    public timezoneService: TimezoneServiceV1,
    protected notificationService: NotificationService,
    private conversationService: ConversationService,
  ) {
    super(notificationService);
  }

  ngOnInit(): void {
    this.subscribeToQueryParams();
  }

  subscribeToQueryParams() {
    this.ActivatedRouteServiceV1.queryParams()
      .subscribe((params: any) => {
        const NEW_STATE = lodash.cloneDeep(this.state);
        NEW_STATE.conversationId = params?.id;
        this.state = NEW_STATE;
        _debugX(TranscriptViewV1.getClassName(), 'subscribeToQueryParams', { params, NEW_STATE });
      });
  }

  saveTags(event: any) {
    const PARAMS = {
      conversationId: this.state?.conversationId,
      tags: event.value,
    };
    _debugX(TranscriptViewV1.getClassName(), 'saveTags', { PARAMS });
    this.conversationService.saveTags(PARAMS)
      .pipe(
        catchError((error: any) => {
          const NOTIFICATION = TRANSCRIPTS_MESSAGES.ERROR.SAVE_TAGS;
          return this.handleTagsError(error, NOTIFICATION);
        })
      ).subscribe((response: any) => {
        const NOTIFICATION = CONVERSATIONS_MESSAGES.SUCCESS.SAVE_TAGS;
        this.notificationService.showNotification(NOTIFICATION);
      });
  }

  removeTags(event: any) {
    const PARAMS = {
      conversationId: this.state?.conversationId,
      tags: event.value,
    };
    _debugX(TranscriptViewV1.getClassName(), 'saveTags', { PARAMS });
    this.conversationService.removeTags(PARAMS)
      .pipe(
        catchError((error: any) => {
          const NOTIFICATION = TRANSCRIPTS_MESSAGES.ERROR.REMOVE_TAG;
          return this.handleTagsError(error, NOTIFICATION);
        })
      ).subscribe((response: any) => {
        const NOTIFICATION = TRANSCRIPTS_MESSAGES.SUCCESS.REMOVE_TAG;
        this.notificationService.showNotification(NOTIFICATION);
      })
  }

  handleTagsLoad(tags: any) {
    this.tags = tags;
  }

  private handleTagsError(error: any, notification: any) {
    _errorX(TranscriptViewV1.getClassName(), 'handleTagsError', { error });
    this.notificationService.showNotification(notification);
    this.state.isLoading = false;
    return of();
  }
}
