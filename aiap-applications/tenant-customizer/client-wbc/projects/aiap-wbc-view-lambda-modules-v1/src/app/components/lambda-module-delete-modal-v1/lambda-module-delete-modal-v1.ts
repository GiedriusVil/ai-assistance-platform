/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  BaseModalV1
} from 'client-shared-views';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  LambdaModulesServiceV1,
} from 'client-services';

import {
  LAMBDA_MODULES_MESSAGES,
} from 'client-utils';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-lambda-module-delete-modal-v1',
  templateUrl: './lambda-module-delete-modal-v1.html',
  styleUrls: ['./lambda-module-delete-modal-v1.scss']
})
export class LambdaModuleDeleteModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'LambdaModuleDeleteModalV1';
  }

  _ids: Array<any> = [];
  ids: any = lodash.cloneDeep(this._ids);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private lambdaModulesService: LambdaModulesServiceV1,
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

  delete() {
    _debugX(LambdaModuleDeleteModalV1.getClassName(), 'delete', { this_ids: this.ids });
    this.lambdaModulesService.deleteManyByIds(this.ids)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleDeleteManyByIdsErrors(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugX(LambdaModuleDeleteModalV1.getClassName(), 'delete', { response });
        this.notificationService.showNotification(LAMBDA_MODULES_MESSAGES.SUCCESS.DELETE_MANY_BY_IDS);
        this.eventsService.loadingEmit(false);
        this.close();
        this.eventsService.filterEmit(undefined);
      });
  }

  handleDeleteManyByIdsErrors(error: any) {
    _debugX(LambdaModuleDeleteModalV1.getClassName(), 'handleDeleteManyByIdsErrors', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(LAMBDA_MODULES_MESSAGES.ERROR.DELETE_MANY_BY_IDS);
    return of();
  }

  show(ids: any) {
    _debugX(LambdaModuleDeleteModalV1.getClassName(), 'show', { ids });
    if (
      !lodash.isEmpty(ids)
    ) {
      this.ids = lodash.cloneDeep(ids);
      this.superShow();
    } else {
      this.notificationService.showNotification(LAMBDA_MODULES_MESSAGES.ERROR.MISSING_MANY);
    }
  }

}
