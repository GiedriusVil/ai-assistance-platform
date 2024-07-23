/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  BaseModal
} from 'client-shared-views';

import {
  TEST_EXECUTION_MESSAGES,
} from 'client-utils';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  TestExecutionsService,
} from 'client-services';

@Component({
  selector: 'aiap-test-execution-delete-modal-v1',
  templateUrl: './test-execution-delete-modal-v1.html',
  styleUrls: ['./test-execution-delete-modal-v1.scss']
})
export class TestExecutionDeleteModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'TestExecutionDeleteModalV1';
  }

  _ids: any = [];
  ids: any = lodash.cloneDeep(this._ids);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private testExecutionsService: TestExecutionsService,
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
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  delete() {
    _debugX(TestExecutionDeleteModalV1.getClassName(), 'delete',
      {
        this_ids: this.ids,
      });

    this.testExecutionsService.deleteManyByIds(this.ids)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleDeleteManyByIdsErrors(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugX(TestExecutionDeleteModalV1.getClassName(), 'delete',
          {
            response,
          });

        this.notificationService.showNotification(TEST_EXECUTION_MESSAGES.SUCCESS.DELETE_MANY_BY_IDS);
        this.eventsService.loadingEmit(false);
        this.close();
        this.eventsService.filterEmit(undefined);
      });
  }

  private handleDeleteManyByIdsErrors(error: any) {
    _debugX(TestExecutionDeleteModalV1.getClassName(), 'handleDeleteManyByIdsErrors',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(TEST_EXECUTION_MESSAGES.ERROR.DELETE_MANY_BY_IDS);
    return of();
  }

  show(ids: any) {
    if (
      !lodash.isEmpty(ids)
    ) {
      this.ids = lodash.cloneDeep(ids);
      this.superShow();
    } else {
      this.notificationService.showNotification(TEST_EXECUTION_MESSAGES.ERROR.MISSING_IDS_SELECTION);
    }
  }

}
