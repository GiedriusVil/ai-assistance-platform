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
  TimezoneServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  AuditService,
} from 'client-services';

@Component({
  selector: 'aca-utterance-audit-modal-v1',
  templateUrl: './utterance-audit.modal-v1.html',
  styleUrls: ['./utterance-audit.modal-v1.scss']
})
export class UtteranceAuditModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  data: Array<any> = [];
  utterance: any = {

  };

  constructor(
    private eventsService: EventsServiceV1,
    private auditService: AuditService,
    private notificationService: NotificationServiceV2,
    protected timezoneService: TimezoneServiceV1,
  ) {
    super();
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  ngAfterViewInit() {

  }

  handleRetrieveAuditLogError(error: any) {
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: "error",
      title: "Unable to load audit log!",
      target: ".notification-container",
      message: `${error}`,
      duration: 10000
    }
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  show(utterance: any) {
    console.log('[ACA] UtteranceAuditModal', utterance);
    this.utterance = utterance;
    const EXTERNAL_ID = ramda.path(['id'], utterance);

    this.auditService.getAuditLogsByExternalId(
      EXTERNAL_ID
    ).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleRetrieveAuditLogError(error)),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      console.log('[ACA] UtteranceAuditModal | response:', response);
      this.data = ramda.pathOr([], ['items'], response);
      this.superShow();
      this.eventsService.loadingEmit(false);
    });
  }

}
