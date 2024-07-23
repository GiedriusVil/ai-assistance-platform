/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  BaseModal
} from 'client-shared-views';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  QueriesConfigurationsService
} from 'client-services';

import {
  QUERIES_CONFIGURATION_MESSAGES,
} from 'client-utils';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-query-delete-modal-v1',
  templateUrl: './query-delete-modal-v1.html',
  styleUrls: ['./query-delete-modal-v1.scss']
})
export class QueryDeleteModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'QueryDeleteModalV1';
  }

  _queriesIds: any = [];
  queriesIds: any = lodash.cloneDeep(this._queriesIds);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private queriesConfigurationsService: QueriesConfigurationsService,
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
    this.queriesConfigurationsService.deleteManyByIds(this.queriesIds)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleDeleteManyByIdsErrors(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugX(`[${QueryDeleteModalV1.getClassName()}] delete`, response);

        this.notificationService.showNotification(QUERIES_CONFIGURATION_MESSAGES.SUCCESS.DELETE_MANY_BY_QUERY);
        this.eventsService.loadingEmit(false);
        this.close();
        this.eventsService.filterEmit(undefined);
      });
  }

  handleEventDelete(event: any) {
    _debugX(QueryDeleteModalV1.getClassName(), 'handleEventDelete',
      {
        event,
      });
    this.delete();
  }

  handleDeleteManyByIdsErrors(error: any) {
    _debugX(QueryDeleteModalV1.getClassName(), 'handleDeleteManyByIdsErrors', { error });

    this.notificationService.showNotification(QUERIES_CONFIGURATION_MESSAGES.ERROR.DELETE_MANY_BY_QUERY);
    this.eventsService.loadingEmit(false);
    return of();
  }

  show(queriesIds: any) {
    if (
      !lodash.isEmpty(queriesIds)
    ) {
      this.queriesIds = lodash.cloneDeep(queriesIds);
      this.superShow();
    } else {
      this.notificationService.showNotification(QUERIES_CONFIGURATION_MESSAGES.ERROR.DELETE_MANY_BY_QUERY);
    }
  }


}
