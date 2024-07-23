/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  BaseModal
} from 'client-shared-views';

import { DEFAULT_DASHBOARD } from './dashboard-save-modal-v1.utils';

import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';

import {
  DASHBOARDS_CONFIGURATION_MESSAGES
} from 'client-utils';

import {
  _debugX,
  _error,
  _debug
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  DashboardElementsTab,
} from './dashboard-elements-tab/dashboard-elements-tab';;
import { DashboardConfigurationsTab } from './dashboard-configurations-tab/dashboard-configurations-tab';

import { DashboardsConfigurationsService } from 'client-services';


@Component({
  selector: 'aiap-dashboard-save-modal-v1',
  templateUrl: './dashboard-save-modal-v1.html',
  styleUrls: ['./dashboard-save-modal-v1.scss']
})
export class DashboardSaveModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'DashboardSaveModalV1';
  }
  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;
  @ViewChild("elementsTab", { static: true }) elementsTab: DashboardElementsTab;
  @ViewChild("configurationsTab", { static: true }) configurationsTab: DashboardConfigurationsTab;

  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  configuration: any = {};

  _dashboard: any = {
    id: '',
    ref: undefined,
    name: undefined,
    elements: DEFAULT_DASHBOARD?.elements,
    configurations: DEFAULT_DASHBOARD?.configurations

  }
  dashboard: any = lodash.cloneDeep(this._dashboard);

  constructor(
    private dashboardsConfigurationsService: DashboardsConfigurationsService,
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
    const SANITIZED_DASHBOARD = this._sanitizedDashboard();
    _debugX(DashboardSaveModalV1.getClassName(), 'save', {
      this_segment: this.configuration,
      SANITIZED_DASHBOARD: SANITIZED_DASHBOARD
    });
    this.dashboardsConfigurationsService.saveOne(SANITIZED_DASHBOARD)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleSaveLambdaConfigurationError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(DashboardSaveModalV1.getClassName(), 'save', { response });
        this.notificationService.showNotification(DASHBOARDS_CONFIGURATION_MESSAGES.SUCCESS.SAVE_ONE);
        this.eventsService.filterEmit(undefined)
        this.close();
      });
  }

  _sanitizedDashboard() {
    let dashboard = lodash.cloneDeep(this.dashboard);

    const VALUE_ELEMENTS_TAB = this.elementsTab.getValue();
    const VALUE_CONFIGURATIONS_TAB = this.configurationsTab.getValue();

    _debugX(DashboardSaveModalV1.getClassName(), '_sanitizedDashboard', {
      dashboard,
      VALUE_ELEMENTS_TAB,
      VALUE_CONFIGURATIONS_TAB
    });

    dashboard.elements = VALUE_ELEMENTS_TAB;
    dashboard.configurations = VALUE_CONFIGURATIONS_TAB;

    return dashboard;
  }

  handleSaveLambdaConfigurationError(error: any) {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(DASHBOARDS_CONFIGURATION_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

  loadFormData(id: any) {
    this.dashboardsConfigurationsService.findOneById(id)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleSaveLambdaConfigurationError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(DashboardSaveModalV1.getClassName(), 'loadViewData', { response });
        this.dashboard = response;
        this.eventsService.loadingEmit(false);
        this.notificationService.showNotification(DASHBOARDS_CONFIGURATION_MESSAGES.SUCCESS.FIND_ONE_BY_ID);
        this.superShow();

      });
  }

  isInvalid() {
    let retVal =

      !this.dashboard?.name ||
      !this.dashboard?.ref ||
      !this.elementsTab.isValid() ||
      !this.configurationsTab.isValid()

    return retVal;
  }

  show(dashboardId: string) {
    _debugX(DashboardSaveModalV1.getClassName(), 'show', { dashboardId });
    if (
      lodash.isString(dashboardId) &&
      !lodash.isEmpty(dashboardId)
    ) {
      this.loadFormData(dashboardId);
    } else {
      this.dashboard = lodash.cloneDeep(this._dashboard);
      this.superShow();
    }
  }

}
