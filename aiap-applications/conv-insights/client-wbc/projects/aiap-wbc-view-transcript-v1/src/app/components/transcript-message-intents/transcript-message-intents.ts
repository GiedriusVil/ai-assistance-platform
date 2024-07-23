/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { of } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { catchError, take } from 'rxjs/operators';

import * as lodash from 'lodash';

import { NotificationService } from 'carbon-components-angular';

import {
  _errorX,
  _debugX, 
} from 'client-shared-utils';

import {
  TRANSCRIPTS_MESSAGES,
} from 'client-utils';

import {
  EventsServiceV1,
  TranslateHelperServiceV1,
  SessionServiceV1
} from 'client-shared-services';

import {
  UtteranceService,
} from 'client-services';

import {
  AiServiceChangeRequestModalV1
} from '../ai-service-change-request-modal-v1/ai-services-change-request-modal-v1';

@Component({
  selector: 'aca-transcript-message-intents',
  templateUrl: './transcript-message-intents.html',
  styleUrls: ['./transcript-message-intents.scss'],
})
export class TranscriptMessageIntents implements OnInit, OnChanges {

  static getClassName() {
    return 'TranscriptMessageIntents';
  }

  @Input() value: any;

  @ViewChild('aiServiceChangeRequestModalV1') aiServiceChangeRequestModalV1: AiServiceChangeRequestModalV1;

  buttonName: string = '';

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private utteranceService: UtteranceService,
    private translateHelperServiceV1: TranslateHelperServiceV1,
    private sessionServiceV1: SessionServiceV1
  ) { }

  ngOnInit(): void { 
    //
  }

  ngOnChanges(): void {
    this.checkAiChangeRequest();
  }

  checkAiChangeRequest() {
    this.buttonName = this.translateHelperServiceV1.instant('transcript_view_v1.transcript_message_intents.btn_request_changes');
    const AI_SERVICE_CHANGE_REQUEST_ID = this.value?.aiChangeRequest?.id;

    if (!lodash.isEmpty(AI_SERVICE_CHANGE_REQUEST_ID)) {
      this.buttonName = this.translateHelperServiceV1.instant('transcript_view_v1.transcript_message_intents.btn_update_changes');
    }
  }

  isRequestChangeDisabled() {
    let retVal = true;
    const IS_ACTION_ALLOWED = this.sessionServiceV1.isActionAllowed({ action: 'change-request.view.action_view.create' });

    if (IS_ACTION_ALLOWED) {
      retVal = false;
    }
    return retVal;
  }

  isBotMessage() {
    const RET_VAL = this.value?.type == 'bot';
    return RET_VAL;
  }

  isUserMessage() {
    const RET_VAL = this.value?.type == 'user';
    return RET_VAL;
  }

  checkAiServiceType(type: any) {
    const RET_VAL = this.value?.aiService?.type === type;
    return RET_VAL;
  }

  hasIntents() {
    let retVal = false;
    switch (this.value?.aiServiceResponse?.type) {
      case 'WA':
        if (
          !lodash.isEmpty(this.value?.aiServiceResponse?.external?.result?.intents)
        ) {
          retVal = true;
        }
        break;
      case 'WA_V2':
          if (
            !lodash.isEmpty(this.value?.aiServiceResponse?.external?.result.output?.intents)
          ) {
            retVal = true;
          }
          break;
      default:
        break;
    }

    return retVal;
  }

  retrieveIntents() {
    const RET_VAL = [];
    let intents;
    try {
      switch (this.value?.aiServiceResponse?.type) {
        case 'WA':
          intents = this.value?.aiServiceResponse?.external?.result?.intents;          
          break;
        case 'WA_V2':
          intents = this.value?.aiServiceResponse?.external?.result?.output?.intents;          
          break;
        default:
          break;
      }
      if (
        !lodash.isEmpty(intents) &&
        lodash.isArray(intents)
      ) {
        if (this.value?.expanded) {
          RET_VAL.push(...intents);
        } else {
          RET_VAL.push(...intents.slice(0, 1));
        }
      }
    } catch (error) {
      _errorX(TranscriptMessageIntents.getClassName(), 'retrieveIntents', { error, intents });
    }
    return RET_VAL;
  }

  onFalsePositiveCheckClicked(utteranceId: string, event: boolean) {
    this.utteranceService.markTopIntentAsFalsePositive(utteranceId, event)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleMarkFalsePositiveError(error)),
        take(1)
      ).subscribe(value => {
        this.notificationService.showNotification(TRANSCRIPTS_MESSAGES.SUCCESS.MARKED_UTTERANCE_FALSE_POSITIVE_FLAG);

        this.eventsService.loadingEmit(false);
      });
  }

  handleMarkFalsePositiveError(error) {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(TRANSCRIPTS_MESSAGES.ERROR.UNABLE_TO_MARK_FALSE_POSITIVE);
    return of();
  }

  handleShowChangeRequestEvent(intentName) {
    const RECORD = lodash.cloneDeep(this.value);
    const AI_CHANGE_REQUEST_PARAMS = {
      aiService: RECORD?.aiService,
      intentName: intentName,
      utteranceId: RECORD?.utteranceId
    }
    _debugX(TranscriptMessageIntents.getClassName(), 'handleShowChangeRequestEvent', {AI_CHANGE_REQUEST_PARAMS})
    this.aiServiceChangeRequestModalV1.show(AI_CHANGE_REQUEST_PARAMS);
  }

}
