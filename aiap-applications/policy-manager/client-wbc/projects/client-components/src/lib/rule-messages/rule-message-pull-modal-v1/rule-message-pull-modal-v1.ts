/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseModalV1,
} from 'client-shared-views'

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  RuleMessagesServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-rule-message-pull-modal-v1',
  templateUrl: './rule-message-pull-modal-v1.html',
  styleUrls: ['./rule-message-pull-modal-v1.scss']
})
export class RuleMessagePullModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'RuleMessagePullModalV1';
  }

  _state: any = {
    query: {
      type: DEFAULT_TABLE.RULE_MESSAGES_V1.TYPE,
      sort: DEFAULT_TABLE.RULE_MESSAGES_V1.SORT,
    }
  }
  state = lodash.cloneDeep(this._state);

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
    private ruleMessagesService: RuleMessagesServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.superNgOnInit(this.eventsService);
  }

  ngAfterViewInit(): void { }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  pull() {
    _debugX(RuleMessagePullModalV1.getClassName(), 'pull',
      {}
    );

    this.ruleMessagesService.pull().pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError(error => this.hanldePullError(error)),
      takeUntil(this._destroyed$)
    ).subscribe(() => {
      const NOTIFICATION = {
        type: 'success',
        title: this.translateService.instant('rule_messages.pul_modal.notification.success.title'),
        message: this.translateService.instant('rule_messages.pul_modal.notification.success.message'),
        target: '.notification-container',
        duration: 10000
      };
      this.notificationService.showNotification(NOTIFICATION);
      this.eventsService.loadingEmit(false);
      this.isOpen = false;
      this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
    });
  }

  hanldePullError(error: any) {
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('rule_messages.pul_modal.notification.success.title'),
      message: this.translateService.instant('rule_messages.pul_modal.notification.error.message'),
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of({ items: [] });
  }

  show() {
    this.isOpen = true;
  }
}
