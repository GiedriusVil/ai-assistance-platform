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
  FiltersConfigurationsService
} from 'client-services';

import {
  FILTERS_CONFIGURATION_MESSAGES,
} from 'client-utils';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-filter-delete-modal-v1',
  templateUrl: './filter-delete-modal-v1.html',
  styleUrls: ['./filter-delete-modal-v1.scss']
})
export class FilterDeleteModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'FilterDeleteModalV1';
  }

  _filtersIds: any = [];
  filtersIds: any = lodash.cloneDeep(this._filtersIds);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private filtersConfigurationsService: FiltersConfigurationsService,
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
    this.filtersConfigurationsService.deleteManyByIds(this.filtersIds)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleDeleteManyByIdsErrors(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugX(`[${FilterDeleteModalV1.getClassName()}] delete`, response);

        this.notificationService.showNotification(FILTERS_CONFIGURATION_MESSAGES.SUCCESS.DELETE_MANY_BY_QUERY);
        this.eventsService.loadingEmit(false);
        this.close();
        this.eventsService.filterEmit(undefined);
      });
  }

  handleDeleteManyByIdsErrors(error: any) {
    _debugX(FilterDeleteModalV1.getClassName(), 'handleDeleteManyByIdsErrors', { error });

    this.notificationService.showNotification(FILTERS_CONFIGURATION_MESSAGES.ERROR.DELETE_MANY_BY_QUERY);
    this.eventsService.loadingEmit(false);
    return of();
  }

  handleEventDelete(event: any) {
    _debugX(FilterDeleteModalV1.getClassName(), 'handleEventDelete',
      {
        event
      });
    this.delete();
  }

  handleEventClose(event: any) {
    _debugX(FilterDeleteModalV1.getClassName(), 'handleEventClose',
      {
        event
      });
    this.close();
  }

  show(filtersIds: any) {
    if (
      !lodash.isEmpty(filtersIds)
    ) {
      this.filtersIds = lodash.cloneDeep(filtersIds);
      this.superShow();
    } else {
      this.notificationService.showNotification(FILTERS_CONFIGURATION_MESSAGES.ERROR.DELETE_MANY_BY_QUERY);
    }
  }
}
