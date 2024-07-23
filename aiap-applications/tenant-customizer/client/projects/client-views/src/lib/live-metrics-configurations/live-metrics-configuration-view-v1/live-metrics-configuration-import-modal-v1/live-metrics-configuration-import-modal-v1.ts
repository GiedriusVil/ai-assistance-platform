/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, Input } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  _errorX,
  _debugX,
} from 'client-shared-utils';

import {
  MESSAGES_LIVE_METRICS_CONFIGURATION,
} from 'client-utils';

import {
  LiveMetricsConfigurationsService,
} from 'client-services';

import { BaseModal } from 'client-shared-views';

@Component({
  selector: 'aca-live-metrics-configuration-import-modal',
  templateUrl: './live-metrics-configuration-import-modal-v1.html',
  styleUrls: ['./live-metrics-configuration-import-modal-v1.scss'],
})
export class LiveMetricsConfigurationImportModal extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'LiveMetricsConfigurationImportModal';
  }

  @Input() files = new Set();

  uploadButtonDisabled = true;

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private liveMetricsConfigurationsService: LiveMetricsConfigurationsService,
  ) {
    super();
  }

  ngOnInit(): void {
    //
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit(): void {
    //
  }

  show(): void {
    this.clearFileContainer();
    this.uploadButtonDisabled = true;
    this.superShow();
  }

  async import() {
    const FILE = ramda.path(['file'], this.files.values().next().value);
    _debugX(LiveMetricsConfigurationImportModal.getClassName(), 'import', { FILE });
    this.liveMetricsConfigurationsService.importFromFile(FILE).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleImportManyFromFile(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(LiveMetricsConfigurationImportModal.getClassName(), 'import', { response });
      this.notificationService.showNotification(MESSAGES_LIVE_METRICS_CONFIGURATION.SUCCESS.IMPORT_MANY_FROM_FILE);
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(null);
      this.close();
    });
  }

  handleImportManyFromFile(error: any) {
    _errorX(LiveMetricsConfigurationImportModal.getClassName(), 'handleImportManyFromFile', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(MESSAGES_LIVE_METRICS_CONFIGURATION.ERROR.IMPORT_MANY_FROM_FILE);
    return of();
  }

  clearFileContainer(): void {
    this.files.clear();
  }

  onFileAdd(event: any): void {
    if (!lodash.isEmpty(event)) {
      this.uploadButtonDisabled = false;
    } else {
      this.uploadButtonDisabled = true;
    }
  }

}
