/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, ViewContainerRef, TemplateRef } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  NotificationServiceV2,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  LAMBDA_MODULES_MESSAGES,
} from 'client-utils';

import {
  LambdaModulesServiceV1,
} from 'client-services';

import { BaseModalV1 } from 'client-shared-views';

import {
  LambdaModuleHelpModalV1,
} from '../lambda-module-help-modal-v1/lambda-module-help-modal-v1';

@Component({
  selector: 'aiap-lambda-module-save-modal-v1',
  templateUrl: './lambda-module-save-modal-v1.html',
  styleUrls: ['./lambda-module-save-modal-v1.scss']
})
export class LambdaModuleSaveModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'LambdaModuleSaveModalV1';
  }

  @ViewChild('lambdaModuleHelpModal') lambdaModuleHelpModal: LambdaModuleHelpModalV1;
  @ViewChild('monacoEditor', { read: TemplateRef }) monacoEditor: TemplateRef<any>;
  @ViewChild('monacoContainer', { read: ViewContainerRef }) monacoContainer: ViewContainerRef;

  isBaseUrlsPresent = false;

  _module: any = {
    id: '',
    type: undefined,
    code: this.translateService.instant('lambda_module_save_modal_v1.module_code.text')
  };

  module = lodash.cloneDeep(this._module);
  _state: any = {
    configurations: [],
    configuration: undefined,
    types: [],
    type: undefined,
    editor: {
      small: false,
    },
    errorsVisible: false,
    monacoOptions: {
      theme: 'hc-black',
      language: 'javascript',
      minimap: {
        enabled: false
      },
      automaticLayout: true,
      padding: {
        bottom: 20
      },
      scrollbar: {
        vertical: 'hidden'
      },
    }
  }
  state = lodash.cloneDeep(this._state);

  constructor(
    private sessionService: SessionServiceV1,
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private lambdaModulesService: LambdaModulesServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.superNgOnInit(this.eventsService);
    this.checkForBaseUrls();
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  private handleKeyDownEvent(event: any) {
    if (
      event?.metaKey &&
      'KeyS' === event?.code
    ) {
      _debugX(LambdaModuleSaveModalV1.getClassName(), 'handleKeyDownEvent - on - Command + s', { event });
      this.save(false);
      event.preventDefault();
    }
    if (
      event?.metaKey &&
      'KeyQ' === event?.code
    ) {
      _debugX(LambdaModuleSaveModalV1.getClassName(), 'handleKeyDownEvent - on - Command + q ', { event });
      this.close();
      event.preventDefault();
    }
  }

  handleMonacoEditorInitEvent(editor: any) {
    _debugX(LambdaModuleSaveModalV1.getClassName(), 'handleMonacoEditorInitEvent', { editor });
    editor.onKeyDown(this.handleKeyDownEvent.bind(this));
  }

  show(id: any) {
    _debugX(LambdaModuleSaveModalV1.getClassName(), 'show', { id });
    this.createMonacoEditor();
    this.loadFormData(id);
  }

  save(isFinalSave = true) {
    if (
      this.isLoading
    ) {
      return;
    }
    const MODULE = this.sanitizedModule();
    _debugX(LambdaModuleSaveModalV1.getClassName(), 'save', { MODULE });
    this.eventsService.loadingEmit(true);
    this.lambdaModulesService.saveOne(MODULE)
      .pipe(
        catchError((error) => this.handleSaveOneError(error)),
        takeUntil(this._destroyed$),
      ).subscribe(() => {
        this.notificationService.showNotification(LAMBDA_MODULES_MESSAGES.SUCCESS.SAVE_ONE);
        this.eventsService.loadingEmit(false);
        if (
          isFinalSave
        ) {
          this.eventsService.filterEmit(null);
          this.close();
        }
      });
  }

  loadFormData(id: any) {
    _debugX(LambdaModuleSaveModalV1.getClassName(), 'loadFormData', { id });
    this.state = lodash.cloneDeep(this._state);
    this.eventsService.loadingEmit(true);
    this.lambdaModulesService.retrieveModuleFormData(id)
      .pipe(
        catchError((error) => this.handleRetrieveFormDataError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(LambdaModuleSaveModalV1.getClassName(), 'loadFormData', { response });
        const MODULE = ramda.path(['module'], response);
        if (
          lodash.isEmpty(MODULE)
        ) {
          this.module = lodash.cloneDeep(this._module);
        } else {
          this.module = MODULE;
        }
        this.refreshConfigurations(response?.configurations?.keys?.items);
        this.refreshTypes();
        this.state = lodash.cloneDeep(this.state);
        this.eventsService.loadingEmit(false);
        this.superShow();
        this.notificationService.showNotification(LAMBDA_MODULES_MESSAGES.SUCCESS.FIND_ONE_BY_ID);
        _debugX(LambdaModuleSaveModalV1.getClassName(), 'loadFormData', { this_state: this.state, this_module: this.module });
      });
  }

  handleShowErrors() {
    this.state.errorsVisible = !this.state.errorsVisible;
    this.toggleCodeEditorSize();
    this.toggleEnableShowTable();
  }

  private toggleCodeEditorSize(): void {
    this.state.editor.small = !this.state.editor.small;
  }

  private toggleEnableShowTable() {
    this.state.tableShowEnabled = !this.state.tableShowEnabled;
  }

  handleThemeChange(event) {
    _debugX(LambdaModuleSaveModalV1.getClassName(), 'handleThemeChange', { event });
    this.state = lodash.cloneDeep(this.state);
  }

  private sanitizedModule() {
    const RET_VAL: any = lodash.cloneDeep(this.module);
    RET_VAL.type = this.state?.type?.value;
    RET_VAL.configurationId = this.state?.configuration?.key;

    return RET_VAL;
  }

  private handleRetrieveFormDataError(error: any) {
    _debugX(LambdaModuleSaveModalV1.getClassName(), 'handleRetrieveFormDataError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(LAMBDA_MODULES_MESSAGES.ERROR.FIND_ONE_BY_ID);
    return of();
  }

  private handleSaveOneError(error: any) {
    _debugX(LambdaModuleSaveModalV1.getClassName(), 'handleSaveOneError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(LAMBDA_MODULES_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

  private checkForBaseUrls() {
    const SESSION = this.sessionService.getSession();
    const TENANT = ramda.path(['tenant'], SESSION);
    const SOE_BASE_URL = ramda.path(['soeBaseUrl'], TENANT);
    const CHAT_APP_BASE_URL = ramda.path(['chatAppBaseUrl'], TENANT);
    const TENANT_CUSTOMIZER_BASE_URL = ramda.path(['tenantCustomizerBaseUrl'], TENANT);
    if (
      !lodash.isEmpty(SOE_BASE_URL) &&
      !lodash.isEmpty(CHAT_APP_BASE_URL) &&
      !lodash.isEmpty(TENANT_CUSTOMIZER_BASE_URL)
    ) {
      this.isBaseUrlsPresent = true;
    }
  }

  help() {
    this.lambdaModuleHelpModal.show();
  }

  compile() {
    const MODULE = this.sanitizedModule();
    _debugX(LambdaModuleSaveModalV1.getClassName(), `compile`, { MODULE });
    this.lambdaModulesService.compileOne(MODULE).pipe(
      catchError((error) => this.handleCompileError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(LambdaModuleSaveModalV1.getClassName(), `compile`, { response });
      this.notificationService.showNotification(LAMBDA_MODULES_MESSAGES.SUCCESS.COMPILE);
    });
  }

  private handleCompileError(error: any) {
    _errorX(LambdaModuleSaveModalV1.getClassName(), 'handleCompileError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(LAMBDA_MODULES_MESSAGES.ERROR.COMPILE);
    return of();
  }

  private refreshConfigurations(configurations: any) {
    _debugX(LambdaModuleSaveModalV1.getClassName(), 'refreshConfiguration', { configurations });
    if (
      !lodash.isEmpty(configurations)
    ) {
      for (const CONFIGURATION of configurations) {
        if (
          !lodash.isEmpty(CONFIGURATION?.id) &&
          !lodash.isEmpty(CONFIGURATION?.key)
        ) {
          const CONFIGURATION_ID = CONFIGURATION?.key;

          const IS_SELECTED = this.module?.configurationId === CONFIGURATION_ID;
          const DROPDOWN_ITEM = {
            content: `${CONFIGURATION.key}`,
            selected: IS_SELECTED,
            ...CONFIGURATION
          };
          this.state.configurations.push(DROPDOWN_ITEM);
          if (IS_SELECTED) {
            this.state.configuration = DROPDOWN_ITEM;
          }
        }
      }
    }
  }

  private refreshTypes() {
    const MODULE_TYPES = [
      {
        content: 'ACTION_TAG',
        value: 'ACTION_TAG',
        selected: false,
      },
      {
        content: 'AUTHORIZATION',
        value: 'AUTHORIZATION',
        selected: false,
      },
      {
        content: 'JOB_EXECUTOR',
        value: 'JOB_EXECUTOR',
        selected: false,
      },
      {
        content: 'SOE_MIDDLEWARE',
        value: 'SOE_MIDDLEWARE',
        selected: false,
      },
      {
        content: 'SLACK_COMPONENT',
        value: 'SLACK_COMPONENT',
        selected: false,
      },
      {
        content: 'CONV_QUALITY_MANAGER_SERVICE',
        value: 'CONV_QUALITY_MANAGER_SERVICE',
        selected: false,
      },
      {
        content: 'TENANT_CUSTOMIZER_SERVICE',
        value: 'TENANT_CUSTOMIZER_SERVICE',
        selected: false,
      },
      {
        content: 'CHAT_APP_SERVICE',
        value: 'CHAT_APP_SERVICE',
        selected: false,
      },
      {
        content: 'SOE_SERVICE',
        value: 'SOE_SERVICE',
        selected: false,
      },
      {
        content: 'POLICY_MANAGER_SERVICE',
        value: 'POLICY_MANAGER_SERVICE',
        selected: false,
      },
      {
        content: 'POLICY_ENGINE_SERVICE',
        value: 'POLICY_ENGINE_SERVICE',
        selected: false,
      },
      {
        content: 'POLICY_ENGINE_TRANSFORMATION',
        value: 'POLICY_ENGINE_TRANSFORMATION',
        selected: false,
      },
      {
        content: 'POLICY_GATEWAY_SERVICE',
        value: 'POLICY_GATEWAY_SERVICE',
        selected: false,
      },
      {
        content: 'POLICY_GATEWAY_TRANSFORMATION',
        value: 'POLICY_GATEWAY_TRANSFORMATION',
        selected: false,
      },
      {
        content: 'MS_TEAMS_CARD',
        value: 'MS_TEAMS_CARD',
        selected: false,
      },
      {
        content: 'ENGAGEMENT',
        value: 'ENGAGEMENT',
        selected: false,
      },
    ];

    for (const TYPE of MODULE_TYPES) {
      TYPE.selected = this.module?.type === TYPE?.value;
      this.state.types.push(TYPE);
      if (
        TYPE.selected
      ) {
        this.state.type = TYPE;
      }
    }
  }

  close() {
    this.clearMonacoContainer();
    super.close();
  }

  clearMonacoContainer() {
    this.monacoContainer.clear();
  }

  createMonacoEditor() {
    this.monacoContainer.createEmbeddedView(this.monacoEditor);
  }
}
