/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as ramda from 'ramda';

import {
  BaseModal
} from 'client-shared-views';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  DataService,
} from 'client-services';

import {
  _debugX,
} from 'client-shared-utils';

@Component({
  selector: 'aca-utterance-intent-modal-v1',
  templateUrl: './utterance-intent.modal-v1.html',
  styleUrls: ['./utterance-intent.modal-v1.scss']
})
export class UtteranceIntentModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  intentsSearch: any = null;

  intents: Array<any> = [];
  utterance: any = {};

  constructor(
    private eventsService: EventsServiceV1,
    private dataService: DataService,
    private notificationService: NotificationServiceV2,
  ) {
    super();
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  ngAfterViewInit() {

  }

  resetIntentsSearch() {
    this.intentsSearch = null;
  }

  getIntentsSearchCloseClass() {
    if (!this.intentsSearch) {
      return 'bx--search-close--hidden';
    }
    return;
  }

  handleGetIntentsError(error: any) {
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: "error",
      title: "Unable to load utterance intents!",
      target: ".notification-container",
      duration: 10000
    }
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  handleUpdateIntentError(error: any) {
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: "error",
      title: "Unable to update utterance intent!",
      target: ".notification-container",
      duration: 10000
    }
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  show(utterance: any) {
    _debugX(UtteranceIntentModalV1.getClassName(), '[ACA] DEBUG | show', { utterance });
    this.utterance = utterance;

    const SERVICE_ID = ramda.pathOr('default', ['serviceId'], this.utterance);
    const SKILL_ID = ramda.path(['skillId'], this.utterance);

    this.dataService.retrieveIntents(
      SERVICE_ID,
      SKILL_ID
    ).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleGetIntentsError(error)),
      takeUntil(this._destroyed$)
    ).subscribe((intents: Array<any>) => {
      _debugX(UtteranceIntentModalV1.getClassName(), '[ACA] DEBUG | intents', { intents });
      this.intents = intents;
      this.eventsService.loadingEmit(false);
      this.superShow();
      this.resetIntentsSearch();
    });
  }

  update() {
    this.eventsService.loadingEmit(true);

    const SERVICE_ID = ramda.pathOr('default', ['serviceId'], this.utterance);
    const SKILL_NAME = ramda.path(['skillName'], this.utterance);
    const SKILL_ID = ramda.path(['skillId'], this.utterance);
    const INTENT_ID = ramda.path(['intent_id'], this.utterance);
    const UTTERANCE_TEXT = ramda.path(['utterance_text'], this.utterance);
    const MESSAGE_ID = ramda.path(['messageId'], this.utterance);

    this.dataService.updateIntent(
      SERVICE_ID,
      SKILL_NAME,
      SKILL_ID,
      INTENT_ID,
      UTTERANCE_TEXT,
      MESSAGE_ID
    ).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleUpdateIntentError(error)),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(UtteranceIntentModalV1.getClassName(), '[ACA] Response |', { response });
      this.close();
    });
  }

}
