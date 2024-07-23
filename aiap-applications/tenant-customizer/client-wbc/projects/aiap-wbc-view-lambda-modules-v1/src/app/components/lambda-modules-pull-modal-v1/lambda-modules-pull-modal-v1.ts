/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import {
  BaseModalV1
} from 'client-shared-views';

import {
  DEFAULT_TABLE
} from 'client-utils';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
  NotificationServiceV2,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  LambdaModulesServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-lambda-modules-pull-modal-v1',
  templateUrl: './lambda-modules-pull-modal-v1.html',
  styleUrls: ['./lambda-modules-pull-modal-v1.scss']
})
export class LambdaModulesPullModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'LambdaModulesPullModalV1';
  }
  state: any = {
    queryType: DEFAULT_TABLE.LAMBDA.TYPE,
  }

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
    private lambdaModulesService: LambdaModulesServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    //
  }

  pull() {
    _debugX(LambdaModulesPullModalV1.getClassName(), 'pull', {});
    this.lambdaModulesService.pull().pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError(error => this.handlePullError(error)),
      takeUntil(this._destroyed$)
    ).subscribe(() => {
      const NOTIFICATION = {
        type: 'success',
        title: this.translateService.instant('lambda_modules_pull_modal_v1.success_notification.title'),
        message: this.translateService.instant('lambda_modules_pull_modal_v1.success_notification.message'),
        target: '.notification-container',
        duration: 10000
      };
      this.notificationService.showNotification(NOTIFICATION);
      this.eventsService.loadingEmit(false);
      this.close();
      this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
    });
  }

  handlePullError(error: any) {
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('lambda_modules_pull_modal_v1.error_notification.title'),
      message: this.translateService.instant('lambda_modules_pull_modal_v1.error_notification.message'),
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of({ items: [] });
  }

  show() {
    this.superShow();
  }
}
