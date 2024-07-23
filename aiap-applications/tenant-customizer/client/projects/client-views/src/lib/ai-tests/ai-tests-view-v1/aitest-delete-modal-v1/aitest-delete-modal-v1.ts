/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import * as ramda from 'ramda';

import {
  _errorX
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  BaseModal
} from 'client-shared-views';

import {
  AiTestsService,
} from 'client-services';

@Component({
  selector: 'aca-aitest-delete-modal',
  templateUrl: './aitest-delete-modal-v1.html',
  styleUrls: ['./aitest-delete-modal-v1.scss'],
})
export class AiTestDeleteModal extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  test: any = {
    skillId: null,
  };

  comment: any;

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private aiTestsService: AiTestsService,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngAfterViewInit() {
    //
  }

  ngOnDestroy() {
    //
  }

  showAsModal(test: any) {
    const SKILL_ID = test?.skillId;
    const ID = test?.id;
    const TEST = {
      skillId: SKILL_ID,
      id: ID
    };
    this.test = TEST;
    super.superShow();
  }

  delete(): void {
    this.eventsService.loadingEmit(true);
    this.aiTestsService.deleteOne(this.test.id)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleAiSkillDeleteError(error)),
        takeUntil(this._destroyed$),
      ).subscribe(() => {
        this.close();
      });
  }

  close() {
    super.close();
    this.eventsService.filterEmit(null);
  }

  handleAiSkillDeleteError(error: any): Observable<void> {
    this.eventsService.loadingEmit(false);
    const ERROR_NOTIFICATION = {
      type: 'error',
      title: 'AI Test error',
      message: `Unable to delete AI Test`,
      target: '.notification-container',
      duration: 4000
    };
    _errorX(AiTestDeleteModal.getClassName(), `handleAiTestDeleteError`,
      {
        error,
      });

    this.notificationService.showNotification(ERROR_NOTIFICATION);
    return of();
  }
}
