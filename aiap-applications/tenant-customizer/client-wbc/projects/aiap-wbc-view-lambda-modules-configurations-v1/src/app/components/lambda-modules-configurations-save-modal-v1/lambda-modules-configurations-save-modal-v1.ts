/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  BaseModalV1
} from 'client-shared-views';

import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';

import {
  LAMBDA_MODULES_CONFIGURATIONS_MESSAGES
} from 'client-utils';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  LambdaModulesConfigurationsServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-lambda-modules-configurations-save-modal-v1',
  templateUrl: './lambda-modules-configurations-save-modal-v1.html',
  styleUrls: ['./lambda-modules-configurations-save-modal-v1.scss']
})
export class LambdaModulesConfigurationsSaveModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'LambdaModulesConfigurationsSaveModalV1';
  }

  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;
  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  configuration: any = {};

  _lambdaModuleConfig: any = {
    key: undefined,
    value: undefined

  }
  lambdaModuleConfig: any = lodash.cloneDeep(this._lambdaModuleConfig);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private lambdaModulesConfigurationsService: LambdaModulesConfigurationsServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.jsonEditorOptions.name = this.translateService.instant('lambda_modules_configurations_save_modal_v1.json_editor.configuration');
    this.jsonEditorOptions.statusBar = true;
    this.jsonEditorOptions.modes = ['code', 'text', 'tree', 'view'];
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    //
  }

  save() {
    _debugX(LambdaModulesConfigurationsSaveModalV1.getClassName(), 'save', {
      this_segment: this.configuration,
      jsonEditorValue: this.jsonEditor.get()
    });
    this.lambdaModuleConfig.value = this.jsonEditor.get();
    this.lambdaModulesConfigurationsService.saveOne(this.lambdaModuleConfig)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleSaveLambdaConfigurationError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(LambdaModulesConfigurationsSaveModalV1.getClassName(), 'save', { response });
        this.notificationService.showNotification(LAMBDA_MODULES_CONFIGURATIONS_MESSAGES.SUCCESS.SAVE_ONE);
        this.eventsService.filterEmit(undefined)
        this.close();
      });
  }

  handleSaveLambdaConfigurationError(error: any) {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(LAMBDA_MODULES_CONFIGURATIONS_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

  loadViewData(id: any) {
    this.lambdaModulesConfigurationsService.retrieveModuleConfigFormData(id)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleSaveLambdaConfigurationError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(LambdaModulesConfigurationsSaveModalV1.getClassName(), 'loadViewData', { response });
        this.lambdaModuleConfig = response?.config;
        this.eventsService.loadingEmit(false);
      });
  }

  show(configId: any) {
    if (configId) {
      this.loadViewData(configId);
    } else {
      this.lambdaModuleConfig = lodash.cloneDeep(this._lambdaModuleConfig);
    }
    this.superShow();
  }

}
