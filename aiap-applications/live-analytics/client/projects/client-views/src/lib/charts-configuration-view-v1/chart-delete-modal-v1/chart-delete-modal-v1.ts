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
  ChartsConfigurationsService
} from 'client-services';

import {
  CHARTS_CONFIGURATION_MESSAGES,
} from 'client-utils';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-chart-delete-modal-v1',
  templateUrl: './chart-delete-modal-v1.html',
  styleUrls: ['./chart-delete-modal-v1.scss']
})
export class ChartDeleteModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'DashboardDeleteModalV1';
  }

  _queriesIds: any = [];
  queriesIds: any = lodash.cloneDeep(this._queriesIds);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private chartsConfigurationsService: ChartsConfigurationsService,
  ) {
    super();
  }

  ngOnInit() { }

  ngAfterViewInit(): void { }

  ngOnDestroy() { }

  delete() {
    this.chartsConfigurationsService.deleteManyByIds(this.queriesIds)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleDeleteManyByIdsErrors(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugX(`[${ChartDeleteModalV1.getClassName()}] delete`, response);

        this.notificationService.showNotification(CHARTS_CONFIGURATION_MESSAGES.SUCCESS.DELETE_MANY_BY_QUERY);
        this.eventsService.loadingEmit(false);
        this.close();
        this.eventsService.filterEmit(undefined);
      });
  }

  handleDeleteManyByIdsErrors(error: any) {
    _debugX(ChartDeleteModalV1.getClassName(), 'handleDeleteManyByIdsErrors', { error });

    this.notificationService.showNotification(CHARTS_CONFIGURATION_MESSAGES.ERROR.DELETE_MANY_BY_QUERY);
    this.eventsService.loadingEmit(false);
    return of();
  }

  show(chartsIds: any) {
    if (
      !lodash.isEmpty(chartsIds)
    ) {
      this.queriesIds = lodash.cloneDeep(chartsIds);
      this.superShow();
    } else {
      this.notificationService.showNotification(CHARTS_CONFIGURATION_MESSAGES.ERROR.DELETE_MANY_BY_QUERY);
    }
  }
}
