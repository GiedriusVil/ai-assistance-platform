/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  JsonEditorOptions,
  JsonEditorComponent
} from 'ang-jsoneditor';

import {
  BaseModal
} from 'client-shared-views';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  MESSAGES_LIVE_METRICS_CONFIGURATION,
  CONSTANTS_DEFAULT_LIVE_METRICS_CONFIGURATION,
} from 'client-utils';

import {
  LiveMetricsConfigurationsService,
} from 'client-services';

@Component({
  selector: 'aca-live-metrics-configuration-save-modal',
  templateUrl: './live-metrics-configuration-save-modal-v1.html',
  styleUrls: ['./live-metrics-configuration-save-modal-v1.scss'],
})
export class LiveMetricsConfigurationSaveModal extends BaseModal implements OnInit, OnDestroy {

  static getClassName() {
    return 'LiveMetricsConfigurationSaveModal';
  }

  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;

  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  _value: any = {
    id: undefined,
    name: undefined,
    configuration: undefined,
  }
  value = lodash.cloneDeep(this._value);

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private liveMetricsConfigurationService: LiveMetricsConfigurationsService,
  ) {
    super();
  }

  ngOnInit() {
    this.superNgOnInit(this.eventsService);
    this.jsonEditorOptions.name = 'Configuration';
    this.jsonEditorOptions.statusBar = true;
    this.jsonEditorOptions.modes = ['tree', 'code'];
    this.jsonEditorOptions.mode = 'code';
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  collectLiveMetricsConfigData() {
    return this.jsonEditor.get();
  }

  refresh(): void {
    this.eventsService.filterEmit(undefined);
  }

  show(id: any) {
    _debugX(LiveMetricsConfigurationSaveModal.getClassName(), 'show',
      {
        id,
      });

    this.loadViewData(id);
  }

  save() {
    const VALUE = this._sanitizedValue();
    _debugX(LiveMetricsConfigurationSaveModal.getClassName(), 'save',
      {
        VALUE,
      });

    this.liveMetricsConfigurationService.saveOne(VALUE)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleSaveOneError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response) => {
        _debugX(LiveMetricsConfigurationSaveModal.getClassName(), 'save',
          {
            response,
          });

        this.notificationService.showNotification(MESSAGES_LIVE_METRICS_CONFIGURATION.SUCCESS.SAVE_ONE);
        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(null);
        this.close();
      });
  }

  private _sanitizedValue() {
    const RET_VAL = lodash.cloneDeep(this.value);
    RET_VAL.configuration = this.jsonEditor.get();
    return RET_VAL;
  }

  private loadViewData(id: any) {
    this.liveMetricsConfigurationService.findOneById(id)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleFindeOneByIdError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(LiveMetricsConfigurationSaveModal.getClassName(), 'loadViewData',
          {
            response,
          });

        let newValue;
        if (
          !lodash.isEmpty(response)
        ) {
          newValue = lodash.cloneDeep(response);
        } else {
          newValue = lodash.cloneDeep(CONSTANTS_DEFAULT_LIVE_METRICS_CONFIGURATION);
        }
        this.value = newValue;
        this.eventsService.loadingEmit(false);
        this.superShow();
      });
  }

  private handleSaveOneError(error: any) {
    _errorX(LiveMetricsConfigurationSaveModal.getClassName(), 'handleSaveOneError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(MESSAGES_LIVE_METRICS_CONFIGURATION.ERROR.SAVE_ONE);
    return of();
  }

  private handleFindeOneByIdError(error: any) {
    _errorX(LiveMetricsConfigurationSaveModal.getClassName(), 'handleFindeOneByIdError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(MESSAGES_LIVE_METRICS_CONFIGURATION.ERROR.FIND_ONE_BY_ID);
    return of();
  }

}
