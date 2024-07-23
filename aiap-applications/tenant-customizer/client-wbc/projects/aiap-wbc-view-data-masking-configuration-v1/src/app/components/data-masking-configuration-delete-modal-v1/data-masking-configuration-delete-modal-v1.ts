/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit
} from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  DATA_MASKING_CONFIGURATIONS_MESSAGES,
} from 'client-utils';

import {
  DataMaskingConfigurationsServiceV1,
} from 'client-services';

import {
  BaseModalV1
} from 'client-shared-views';

@Component({
  selector: 'aiap-data-masking-configuration-delete-modal-v1',
  templateUrl: './data-masking-configuration-delete-modal-v1.html',
  styleUrls: ['./data-masking-configuration-delete-modal-v1.scss']
})
export class MaskingConfigurationDeleteModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'MaskingConfigurationDeleteModalV1';
  }

  _configKeys: Array<string> = [];
  configKeys: Array<string> = lodash.cloneDeep(this._configKeys);

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private dataMaskingConfigurationsService: DataMaskingConfigurationsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit() {
    //
  }

  show(configKeys: any) {
    if (
      !lodash.isEmpty(configKeys) &&
      lodash.isArray(configKeys)
    ) {
      this.configKeys = lodash.cloneDeep(configKeys);
      this.superShow();
    } else {
      this.notificationService.showNotification(DATA_MASKING_CONFIGURATIONS_MESSAGES.ERROR.SHOW_DATA_MASKING_CONFIGURATIONS_DELETE_MODAL);
    }
  }

  delete(): void {
    this.dataMaskingConfigurationsService.deleteManyByKeys(this.configKeys)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleMaskingConfigurationDeleteError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(MaskingConfigurationDeleteModalV1.getClassName(), 'handleShowMaskingConfigurationDeleteModal',
          {
            response,
          });

        this.eventsService.loadingEmit(false)
        this.notificationService.showNotification(DATA_MASKING_CONFIGURATIONS_MESSAGES.SUCCESS.DELETE_MANY_BY_IDS);
        this.close();
        this.eventsService.filterEmit(null);
      });
  }

  private handleMaskingConfigurationDeleteError(error: any): Observable<void> {
    this.eventsService.loadingEmit(false);
    _errorX(MaskingConfigurationDeleteModalV1.getClassName(), 'handleMaskingConfigurationDeleteError',
      {
        error,
      });

    this.notificationService.showNotification(DATA_MASKING_CONFIGURATIONS_MESSAGES.ERROR.DELETE_MANY_BY_IDS);
    this.isOpen = false;
    return of();
  }
}
