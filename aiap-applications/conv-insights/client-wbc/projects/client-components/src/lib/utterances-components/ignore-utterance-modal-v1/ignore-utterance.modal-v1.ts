/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as ramda from 'ramda';

import {
  _debugX,
} from 'client-shared-utils';

import {
  BaseModal
} from 'client-shared-views';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  UtteranceService,
} from 'client-services';

@Component({
  selector: 'aca-ignore-utterance-modal-v1',
  templateUrl: './ignore-utterance.modal-v1.html',
  styleUrls: ['./ignore-utterance.modal-v1.scss']
})
export class IgnoreUtteranceModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'IgnoreUtteranceModalV1';
  }

  utterance: any = {

  };

  comment: string = null;

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private utteranceService: UtteranceService,
  ) {
    super();
  }

  ngOnInit() { }

  ngOnDestroy() { }

  ngAfterViewInit() { }

  show(utterance: any) {
    this.utterance = utterance;
    _debugX(IgnoreUtteranceModalV1.getClassName(), 'show', { utterance });
    this.comment = '';
    this.superShow();
  }

  ignore() {
    _debugX(IgnoreUtteranceModalV1.getClassName(), 'ignore', { this_utterance: this.utterance });
    const UTTERANCE_ID = ramda.path(['id'], this.utterance);
    const FEEDBACK_ID = ramda.path(['feedbackId'], this.utterance);
    this.utteranceService.ignoreUtterance(
      UTTERANCE_ID,
      FEEDBACK_ID,
      this.comment
    ).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleIgnoreUtteranceError(error)),
      takeUntil(this._destroyed$),
    ).subscribe(() => {
      const NOTIFICATION = {
        type: "success",
        title: "Utterance was ingored",
        target: ".notification-container",
        duration: 5000
      }
      this.notificationService.showNotification(NOTIFICATION);
      this.eventsService.filterEmit(null);
      this.eventsService.loadingEmit(false);
      this.close();
    });
  }

  handleIgnoreUtteranceError(error: any) {
    _debugX(IgnoreUtteranceModalV1.getClassName(), 'handleIgnoreUtteranceError', { error });
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: "error",
      title: "Failed to ignore utterance!",
      target: ".notification-container",
      duration: 10000
    }
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

}
