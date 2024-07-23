/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  BaseModalV1
} from 'client-shared-views';

import {
  LAMBDA_MODULES_CONFIGURATIONS_MESSAGES
} from 'client-utils';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  LambdaModulesConfigurationsServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-lambda-modules-configurations-delete-modal-v1',
  templateUrl: './lambda-modules-configurations-delete-modal-v1.html',
  styleUrls: ['./lambda-modules-configurations-delete-modal-v1.scss']
})
export class LambdaModulesConfigurationsDeleteModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'LambdaModulesDeleteModal';
  }

  _state: any = {
    items: []
  }
  state = lodash.cloneDeep(this._state);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private lambdaModulesConfigurationsService: LambdaModulesConfigurationsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    // empty
  }

  ngAfterViewInit(): void {
    // empty
  }

  ngOnDestroy() {
    // empty
  }

  delete() {
    _debugX(LambdaModulesConfigurationsDeleteModalV1.getClassName(), 'delete', {
      this_state: this.state
    });
    const IDS = this.state.items.map((item: any) => {
      return item?.id;
    });
    const PARAMS = {
      ids: IDS,
    }
    this.lambdaModulesConfigurationsService.deleteManyByIds(PARAMS)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.hanldeDeleteOneByIdError(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugX(LambdaModulesConfigurationsDeleteModalV1.getClassName(), 'delete', { response });
        this.notificationService.showNotification(LAMBDA_MODULES_CONFIGURATIONS_MESSAGES.SUCCESS.DELETE_MANY_BY_IDS);
        this.eventsService.loadingEmit(false);
        this.close();
        this.eventsService.filterEmit(undefined);
      });
  }

  hanldeDeleteOneByIdError(error: any) {
    _debugX(LambdaModulesConfigurationsDeleteModalV1.getClassName(), 'hanldeDeleteOneByIdError', { error });
    this.eventsService.loadingEmit(false);
    let message;
    if (error instanceof HttpErrorResponse) {
      message = `[${error.status} - ${error.statusText}] ${error.message} - ${JSON.stringify(error.error)}`;
    } else {
      message = `${JSON.stringify(error)}`;
    }
    const NOTIFICATION = {
      type: 'error',
      title: 'Unable delete lambda module',
      message: message,
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  show(items: any) {
    _debugX(LambdaModulesConfigurationsDeleteModalV1.getClassName(), 'show', { items });
    if (
      !lodash.isEmpty(items) &&
      lodash.isArray(items)
    ) {
      const NEW_STATE = lodash.clone(this._state);
      NEW_STATE.items = items;
      this.state = NEW_STATE;
      this.superShow();
    } else {
      this.notificationService.showNotification(LAMBDA_MODULES_CONFIGURATIONS_MESSAGES.ERROR.DELETE_MANY_BY_IDS);
    }
  }

}
