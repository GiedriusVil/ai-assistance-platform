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
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  TEST_CASE_MESSAGES,
} from 'client-utils';

import {
  TestCasesService
} from 'client-services';

@Component({
  selector: 'aiap-test-case-delete-modal-v1',
  templateUrl: './test-case-delete-modal-v1.html',
  styleUrls: ['./test-case-delete-modal-v1.scss']
})
export class TestCaseDeleteModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'TestCaseDeleteModalV1';
  }

  _identifiers: any = [];
  indentifiers: any = lodash.cloneDeep(this._identifiers);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private instanceService: TestCasesService,
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
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  delete() {
    this.instanceService.deleteManyByIds(this.indentifiers)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleDeleteManyByIdsErrors(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugX(TestCaseDeleteModalV1.getClassName(), 'delete',
          {
            response,
          });

        this.notificationService.showNotification(TEST_CASE_MESSAGES.SUCCESS.DELETE_MANY_BY_IDS);
        this.eventsService.loadingEmit(false);
        this.close();
        this.eventsService.filterEmit(undefined);
      });
  }

  handleDeleteManyByIdsErrors(error: any) {
    this.eventsService.loadingEmit(false);
    _debugX(TestCaseDeleteModalV1.getClassName(), 'handleDeleteManyByIdsErrors',
      {
        error,
      });

    this.notificationService.showNotification(TEST_CASE_MESSAGES.ERROR.DELETE_MANY_BY_IDS);
    return of();
  }

  show(indentifiers: any) {
    if (
      !lodash.isEmpty(indentifiers)
    ) {
      this.indentifiers = lodash.cloneDeep(indentifiers);
      this.superShow();
    } else {
      this.notificationService.showNotification(TEST_CASE_MESSAGES.ERROR.MISSING_IDS_SELECTION);
    }
  }

}
