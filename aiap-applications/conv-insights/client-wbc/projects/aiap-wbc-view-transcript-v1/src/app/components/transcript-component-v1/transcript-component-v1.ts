/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnChanges, OnDestroy, Input, Output, SimpleChanges, EventEmitter, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as lodash from 'lodash';

import { NotificationService, PaginationModel } from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
} from 'client-shared-services';

import {
  TRANSCRIPTS_MESSAGES,
  CONVERSATIONS_MESSAGES,
} from 'client-utils';

import {
  ConversationService,
  TranscriptsService,
} from 'client-services';

@Component({
  selector: 'aiap-transcript-component-v1',
  templateUrl: './transcript-component-v1.html',
  styleUrls: ['./transcript-component-v1.scss'],
})
export class TranscriptComponent implements OnInit, OnChanges, OnDestroy {

  static getClassName() {
    return 'TranscriptComponent';
  }

  @Output() onTagsLoad: EventEmitter<any[]> = new EventEmitter<any[]>();

  @Input() conversationId: any;

  _state = {
    model: new PaginationModel(),
    modelPageSizeOption: [25, 50, 75, 100],
    isLoading: false,
    showSystemMessages: true,
    reviewed: false,
    transcript: {
      conversationId: undefined,
      messagesTotal: 0,
      messages: [],
      reviewers: [],
      tags:[],
      lastReview: {
        date: undefined,
        user: {
          id: undefined
        }
      }
    }
  }
  state = lodash.cloneDeep(this._state);

  constructor(
    private notificationService: NotificationService,
    private conversationService: ConversationService,
    private transcriptsService: TranscriptsService,
    private sessionService: SessionServiceV1,
  ) {
    _debugX(TranscriptComponent.getClassName(), 'constructor', {});
    this.state.model.currentPage = 1;
    this.state.model.pageLength = 25;
  }

  ngOnInit(): void {
    //
  }

  ngOnChanges(changes: SimpleChanges): void {
    _debugX(TranscriptComponent.getClassName(), 'ngOnChanges', { changes });
    this.loadTranscript();
  }

  private checkIfReviewedByUser() {
    const REVIEWERS = this.state?.transcript?.reviewers;
    const USER_ID = this.sessionService.getUser().id;
    if (
      lodash.isArray(REVIEWERS) &&
      !lodash.isEmpty(REVIEWERS)
    ) {
      const IS_REVIEWED_BY_USER = REVIEWERS.find(reviewer => reviewer.userId === USER_ID);
      if (IS_REVIEWED_BY_USER) {
        this.state.reviewed = true;
      }
    } else {
      this.state.reviewed = false;
    }

  }

  ngOnDestroy(): void {
    //
  }

  handleShowSystemMessagesEvent(event: any) {
    _debugX(TranscriptComponent.getClassName(), 'handleShowSystemMessagesEvent', { event });
    const NEW_STATE = lodash.cloneDeep(this.state);
    NEW_STATE.showSystemMessages = event;
    this.state = NEW_STATE;
    this.loadTranscript();
  }

  isAiServiceDetailsVisible(index: any): boolean {
    let retVal = false;
    let messages;
    try {
      messages = this.state.transcript?.messages;
      if (
        !lodash.isEmpty(messages) &&
        lodash.isArray(messages)
      ) {
        if (
          !lodash.isEmpty(messages[index]?.aiService?.id) &&
          !lodash.isEmpty(messages[index]?.aiService?.type) &&
          !lodash.isEmpty(messages[index]?.aiService?.name) &&
          index > 0
        ) {
          retVal = messages[index]?.aiService?.id !== messages[index - 1]?.aiService?.id;
        } else if (
          !lodash.isEmpty(messages[index]?.aiService?.id)
        ) {
          retVal = true;
        }
        if (
          !retVal
        ) {
          if (
            !lodash.isEmpty(messages[index]?.aiService?.aiSkill?.id) &&
            index > 0
          ) {
            retVal = messages[index]?.aiService?.aiSkill?.id !== messages[index - 1]?.aiService?.aiSkill?.id;
          } else if (
            !lodash.isEmpty(messages[index]?.aiService?.type)
          ) {
            retVal = true;
          }
        }
      }
      return retVal;
    } catch (error) {
      _errorX(TranscriptComponent.getClassName(), 'isAiServiceDetailsVisible', { error });
      throw error;
    }
  }


  private loadTranscript() {
    _debugX(TranscriptComponent.getClassName(), 'loadTranscript', { this_state: this.state });
    this.state.isLoading = true;

    const PARAMS: any = {
      id: this.conversationId,
      showSystemMessages: this.state?.showSystemMessages,
      pagination: {
        page: this.state.model.currentPage,
        size: this.state.model.pageLength,
      }
    }

    this.transcriptsService.findOneById(PARAMS)
      .pipe(
        catchError((error: any) => this.handleFindOneByIdError(error))
      ).subscribe((response: any) => {
        _debugX(TranscriptComponent.getClassName(), 'loadTranscript', { response });
        const NEW_STATE = lodash.cloneDeep(this.state);
        const TAGS = response?.tags?.map(({ tags }) => ({ display: tags, value: tags })) || [];
        this.onTagsLoad.emit(TAGS);

        NEW_STATE.transcript = lodash.cloneDeep(this._state.transcript);
        NEW_STATE.transcript.reviewers = [];
        NEW_STATE.transcript.tags = [];
        if (
          !lodash.isEmpty(response?.messages) &&
          lodash.isArray(response?.messages)
        ) {
          NEW_STATE.transcript.messages = lodash.cloneDeep(response?.messages);
        }
        if (
          lodash.isNumber(response?.messagesTotal) &&
          response?.messagesTotal > 0
        ) {
          NEW_STATE.transcript.messagesTotal = response?.messagesTotal;
        }
        if (
          lodash.isArray(response?.reviews) &&
          !lodash.isEmpty(response?.reviews)
        ) {
          NEW_STATE.transcript.lastReview.date = response?.reviews[0]?.reviewDate;
          NEW_STATE.transcript.lastReview.user.id = response?.reviews[0]?.userId;
          NEW_STATE.transcript.reviewers = response?.reviews;
        }
        NEW_STATE.transcript.conversationId = this.conversationId;
        NEW_STATE.model.totalDataLength = NEW_STATE.transcript.messagesTotal
        NEW_STATE.isLoading = false;
        this.state = NEW_STATE;
        this.checkIfReviewedByUser();
        _debugX(TranscriptComponent.getClassName(), 'loadTranscript', { NEW_STATE, TAGS });
      });
  }

  private handleFindOneByIdError(error: any) {
    _errorX(TranscriptComponent.getClassName(), 'handleFindOneByIdError'), { error };
    const NOTIFICATION = TRANSCRIPTS_MESSAGES.ERROR.FIND_ONE_BY_ID;
    this.notificationService.showNotification(NOTIFICATION);
    this.state.isLoading = false;
    return of();
  }

  private addReview() {
    const PARAMS = {
      conversationId: this.state?.transcript?.conversationId,
    };
    _debugX(TranscriptComponent.getClassName(), 'addReview', { PARAMS });
    this.conversationService.addReview(PARAMS)
      .pipe(
        catchError((error: any) => this.handleAddReviewError(error))
      ).subscribe((response: any) => {
        const NOTIFICATION = CONVERSATIONS_MESSAGES.SUCCESS.ADD_REVIEW;
        this.notificationService.showNotification(NOTIFICATION);
        this.loadTranscript();
      });
  }

  private handleAddReviewError(error: any) {
    _errorX(TranscriptComponent.getClassName(), 'handleAddReviewError', { error });
    const NOTIFICATION = CONVERSATIONS_MESSAGES.ERROR.ADD_REVIEW;
    this.notificationService.showNotification(NOTIFICATION);
    this.state.isLoading = false;
    return of();
  }

  private removeReview() {
    const PARAMS = {
      conversationId: this.state?.transcript?.conversationId,
    };
    _debugX(TranscriptComponent.getClassName(), 'removeReview', { PARAMS });
    this.conversationService.removeReview(PARAMS)
      .pipe(
        catchError((error: any) => this.handleRemoveReviewError(error))
      ).subscribe((response: any) => {
        const NOTIFICATION = CONVERSATIONS_MESSAGES.SUCCESS.REMOVE_REVIEW;
        this.notificationService.showNotification(NOTIFICATION);
        this.state.reviewed = false;
        this.loadTranscript();
      });
  }

  private handleRemoveReviewError(error: any) {
    _errorX(TranscriptComponent.getClassName(), 'handleRemoveReviewError', { error });
    const NOTIFICATION = CONVERSATIONS_MESSAGES.ERROR.REMOVE_REVIEW;
    this.notificationService.showNotification(NOTIFICATION);
    this.state.isLoading = false;
    return of();
  }

  handlePageSelection(event: any) {
    _debugX(TranscriptComponent.getClassName(), 'handleShowSystemMessagesEvent', {
      event: event,
      this_state_model: this.state.model,
    });
    this.state.model.currentPage = event;
    this.loadTranscript();
  }

  handleMarkTranscriptReviewStateEvent(event: any) {
    _debugX(TranscriptComponent.getClassName(), 'handleShowSystemMessagesEvent', { event });
    if (event) {
      this.addReview();
    } else {
      this.removeReview();
    }
  }

  handleTranscriptMessageTrackBy(index, transcriptMessage) {
    const MESSAGE = lodash.cloneDeep(transcriptMessage);
    delete MESSAGE.expanded;
    return JSON.stringify(MESSAGE);
  }
}
