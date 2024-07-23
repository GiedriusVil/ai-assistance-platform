/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  BaseModal,
} from 'client-shared-views';

import {
  CHARTS_CONFIGURATION_MESSAGES
} from 'client-utils';

import { DEFAULT_CONFIGURATION } from './chart-save-modal-v1.utils';

import { ChartsConfigurationsService } from 'client-services';

@Component({
  selector: 'aiap-chart-save-modal-v1',
  templateUrl: './chart-save-modal-v1.html',
  styleUrls: ['./chart-save-modal-v1.scss']
})
export class ChartSaveModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'ChartSaveModalV1';
  }
  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;
  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  configuration: any = {};

  _chart: any = {
    id: '',
    ref: undefined,
    type: undefined,
    name: undefined,
    value: undefined

  }
  chart: any = lodash.cloneDeep(this._chart);

  constructor(
    private chartsConfigurationsService: ChartsConfigurationsService,
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.jsonEditorOptions.name = 'Configuration';
    this.jsonEditorOptions.statusBar = true;
    this.jsonEditorOptions.mode = 'code';
    this.jsonEditorOptions.modes = ['code'];
  }

  ngAfterViewInit(): void { }

  ngOnDestroy() { }

  save() {
    _debugX(ChartSaveModalV1.getClassName(), 'save', {
      this_segment: this.configuration,
      jsonEditorValue: this.jsonEditor.get()
    });
    const CHART = this.sanitizeChart();
    this.chartsConfigurationsService.saveOne(CHART)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleSaveLambdaConfigurationError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(ChartSaveModalV1.getClassName(), 'save', { response });
        this.notificationService.showNotification(CHARTS_CONFIGURATION_MESSAGES.SUCCESS.SAVE_ONE);
        this.eventsService.filterEmit(undefined)
        this.close();
      });
  }

  sanitizeChart() {
    const RET_VAL: any = lodash.cloneDeep(this.chart);
    RET_VAL.value = this.jsonEditor.get();
    return RET_VAL;
  }

  handleSaveLambdaConfigurationError(error: any) {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(CHARTS_CONFIGURATION_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

  loadFormData(id: any) {
    this.eventsService.loadingEmit(true);
    this.chartsConfigurationsService.retrieveChartFormData(id)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleSaveLambdaConfigurationError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(ChartSaveModalV1.getClassName(), 'loadViewData', { response });
        const CHART = response?.chart;
        if (
          lodash.isEmpty(CHART)
        ) {
          this.chart = lodash.cloneDeep(this._chart);
          this.chart.value = DEFAULT_CONFIGURATION.chart;
        } else {
          this.chart = CHART
        }
        this.superShow();
        this.eventsService.loadingEmit(false);
      });
  }

  show(chartId: string) {
    _debugX(ChartSaveModalV1.getClassName(), 'show', { chartId });
    this.loadFormData(chartId);
  }

}
