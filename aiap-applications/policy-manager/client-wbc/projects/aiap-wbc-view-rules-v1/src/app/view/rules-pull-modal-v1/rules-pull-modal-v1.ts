/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';

import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

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
  BaseModal,
} from 'client-shared-views';

import {
  DEFAULT_TABLE
} from 'client-utils';

import {
  RulesServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-rules-pull-modal-v1',
  templateUrl: './rules-pull-modal-v1.html',
  styleUrls: ['./rules-pull-modal-v1.scss']
})
export class RulesPullModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'RulesPullModalV1';
  }

  state: any = {
    query: {
      type: DEFAULT_TABLE.RULES_V1.TYPE,
      sort: DEFAULT_TABLE.RULES_V1.SORT,
    }
  };

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
    private rulesService: RulesServiceV1,
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
    _debugX(RulesPullModalV1.getClassName(), 'pull', {});

    this.rulesService.pull().pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError(error => this.hanldePullError(error)),
      takeUntil(this._destroyed$)
    ).subscribe(() => {
      const NOTIFICATION = {
        type: 'success',
        title: this.translateService.instant('view_rules_v1.pull_modal.success_title'),
        message: this.translateService.instant('view_rules_v1.pull_modal.success_message'),
        target: '.notification-container',
        duration: 10000
      };
      this.notificationService.showNotification(NOTIFICATION);
      this.eventsService.loadingEmit(false);
      this.isOpen = false;
      this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
    });
  }

  hanldePullError(error: any) {
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('view_rules_v1.pull_modal.error_title'),
      message: this.translateService.instant('view_rules_v1.pull_modal.error_message'),
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of({ items: [] });
  }

  close() {
    this.isOpen = false;
  }

  show() {
    this.isOpen = true;
  }
}
