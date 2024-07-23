/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as lodash from 'lodash';

import {
  BaseModal
} from 'client-shared-views';

import {
  MESSAGES_LIVE_METRICS_CONFIGURATION,
} from 'client-utils';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  LiveMetricsConfigurationsService,
} from 'client-services';

@Component({
  selector: 'aca-live-metrics-configuration-delete-modal',
  templateUrl: './live-metrics-configuration-delete-modal-v1.html',
  styleUrls: ['./live-metrics-configuration-delete-modal-v1.scss'],
})
export class LiveMetricsConfigurationDeleteModal extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'LiveMetricsConfigurationDeleteModal';
  }

  comment = undefined;

  _liveMetricsConfigurationsIds = [];
  liveMetricsConfigurationsIds = lodash.cloneDeep(this._liveMetricsConfigurationsIds);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private liveMetricsConfigurationService: LiveMetricsConfigurationsService,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    //
  }

  ngAfterViewInit() {
    //
  }

  delete() {
    this.liveMetricsConfigurationService.deleteManyByIds(this.liveMetricsConfigurationsIds, this.comment)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleDeleteError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response) => {
        _debugX(LiveMetricsConfigurationDeleteModal.getClassName(), 'delete', { response });
        this.notificationService.showNotification(MESSAGES_LIVE_METRICS_CONFIGURATION.SUCCESS.DELETE_MANY_BY_IDS);
        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(null);
        this.close();
      });
  }

  handleDeleteError(error: any) {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(MESSAGES_LIVE_METRICS_CONFIGURATION.ERROR.DELETE_MANY_BY_IDS);
    return of();
  }

  show(configurationIds: any) {
    _debugX(LiveMetricsConfigurationDeleteModal.getClassName(), 'live-metrics-configuration-delete-modal | show | configurationIds', { configurationIds });
    if (
      lodash.isArray(configurationIds) &&
      !lodash.isEmpty(configurationIds)
    ) {
      this.liveMetricsConfigurationsIds = configurationIds;
    } else {
      this.liveMetricsConfigurationsIds = lodash.cloneDeep(this._liveMetricsConfigurationsIds);
    }
    this.comment = undefined;
    this.superShow();
  }

}
