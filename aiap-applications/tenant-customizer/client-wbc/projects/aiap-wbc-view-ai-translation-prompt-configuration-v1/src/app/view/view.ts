/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs';

import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';

import * as lodash from 'lodash';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  ActivatedRouteServiceV1,
  NotificationServiceV2,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import { BaseViewV1 } from 'client-shared-views';

import {
  AiTranslationPromptTestModalV1,
} from '../components';

import {
  AiTranslationPromptsServiceV1,
} from 'client-services';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  AI_TRANSLATION_PROMPT_CONFIGURATION_MESSAGES,
  OUTLETS,
  DEFAULT_TABLE,
} from 'client-utils';

const PROMPT_TYPES = {
  DEPLOYMENT: 'deployment',
  PROJECT: 'project',
};

@Component({
  selector: 'aiap-ai-translation-prompt-configuration-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class AiTranslationPromptConfigurationViewV1 extends BaseViewV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiTranslationPromptConfigurationViewV1';
  }

  @ViewChild('aiTranslationPromptTestModal') aiTranslationPromptTestModal: AiTranslationPromptTestModalV1;
  @ViewChild(JsonEditorComponent, { static: true }) jsonEditor: JsonEditorComponent;
  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  _value = {
    promptId: undefined,
    serviceId: undefined,
    name: undefined,
    type: undefined,
    sourceLanguage: undefined,
    targetLanguage: undefined,
    external: undefined,
  }
  value = lodash.cloneDeep(this._value);

  state = {
    isLoading: false,
    promptExternal: undefined,
    notification: {
      promptTypeDeployment: {
        type: 'info',
        title: this.translateService.instant('ai_translation_prompt_configuration_v1.type_deployment_notification.title'),
        message: this.translateService.instant('ai_translation_prompt_configuration_v1.type_deployment_notification.message'),
        showClose: false,
        lowContrast: true
      }
    },
  }

  outlet = OUTLETS.tenantCustomizer;

  constructor(
    private ActivatedRouteServiceV1: ActivatedRouteServiceV1,
    private notificationService: NotificationServiceV2,
    private aiTranslationPromptsService: AiTranslationPromptsServiceV1,
    private eventsService: EventsServiceV1,
    private translateService: TranslateHelperServiceV1,
    private queryService: QueryServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.eventsService.loadingEmit(true);
    this.setJsonEditorOptions();
    this.subscribeToQueryParams();
    this.addFilterEventEventHandler();
    this.eventsService.filterEmit({});
  }

  setJsonEditorOptions() {
    this.jsonEditorOptions.name = 'Configuration';
    this.jsonEditorOptions.statusBar = true;
    this.jsonEditorOptions.modes = ['code'];
    this.jsonEditorOptions.mode = 'code';
  }

  subscribeToQueryParams() {
    this.ActivatedRouteServiceV1.queryParams()
      .subscribe((params: any) => {
        _debugX(AiTranslationPromptConfigurationViewV1.getClassName(), 'subscribeToQueryParams', { params: params });
        this.value.promptId = params.aiTranslationPromptId;
        this.value.serviceId = params.aiTranslationServiceId;
      });
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleTestPrompt() {
    _debugX(AiTranslationPromptConfigurationViewV1.getClassName(), `handleTestPrompt`);
    this.aiTranslationPromptTestModal.show(this.value.serviceId, this.value.promptId);
  }

  addFilterEventEventHandler() {
    this.state.isLoading = true;
    this.eventsService.filterEmitter.pipe(
      switchMap((_) => {
        return this.aiTranslationPromptsService.findOneById(this.value.promptId)
          .pipe(catchError(error => this.handleFindOneByQueryError(error)))
      }),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(AiTranslationPromptConfigurationViewV1.getClassName(), `addFilterEventEventHandler`, { response });
      this.value.sourceLanguage = response?.source;
      this.value.targetLanguage = response?.target;
      this.value.name = response?.name;
      this.value.type = response?.type;
      this.value.external = response?.external;
      this.state.promptExternal = lodash.cloneDeep(this.value.external);
      this.state.isLoading = false;
      this.eventsService.loadingEmit(false);
    })
  }

  handleFindOneByQueryError(error: any) {
    _errorX(AiTranslationPromptConfigurationViewV1.getClassName(), `handleFindOneByQueryError`, { error });
    this.notificationService.showNotification(AI_TRANSLATION_PROMPT_CONFIGURATION_MESSAGES.ERROR.FIND_ONE_BY_QUERY);
    return of();
  }

  handleSearchChangeEvent(event: any) {
    _debugX(AiTranslationPromptConfigurationViewV1.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(DEFAULT_TABLE.AI_TRANSLATION_PROMPT_CONFIGURATION_V1.TYPE, QueryServiceV1.FILTER_KEY.SEARCH, event);

    const QUERY = this.queryService.query(DEFAULT_TABLE.AI_TRANSLATION_PROMPT_CONFIGURATION_V1.TYPE);

    _debugX(AiTranslationPromptConfigurationViewV1.getClassName(), `handleSearchChangeEvent`, { QUERY });
    this.eventsService.filterEmit(QUERY);
  }

  handleSearchClearEvent(event: any) {
    _debugX(AiTranslationPromptConfigurationViewV1.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.setFilterItem(DEFAULT_TABLE.AI_TRANSLATION_PROMPT_CONFIGURATION_V1.TYPE, QueryServiceV1.FILTER_KEY.SEARCH, event);

    const QUERY = this.queryService.query(DEFAULT_TABLE.AI_TRANSLATION_PROMPT_CONFIGURATION_V1.TYPE);

    _debugX(AiTranslationPromptConfigurationViewV1.getClassName(), `handleSearchClearEvent`, { QUERY });
    this.eventsService.filterEmit(QUERY);
  }

  save() {
    const AI_TRANSLATION_MODEL = {
      id: this.value.promptId,
      external: this.jsonEditor.get(),
    };
    _debugX(AiTranslationPromptConfigurationViewV1.getClassName(), 'save', { AI_TRANSLATION_MODEL });
    this.eventsService.loadingEmit(true);
    this.aiTranslationPromptsService.saveOne(AI_TRANSLATION_MODEL)
      .pipe(
        catchError((error) => this.handleSaveOneError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(AiTranslationPromptConfigurationViewV1.getClassName(), 'save', { response });
        this.notificationService.showNotification(AI_TRANSLATION_PROMPT_CONFIGURATION_MESSAGES.SUCCESS.SAVE_ONE);
        this.eventsService.loadingEmit(false)
        this.eventsService.filterEmit({});
      });
  }

  private handleSaveOneError(error: any) {
    _errorX(AiTranslationPromptConfigurationViewV1.getClassName(), 'handleSaveOneError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AI_TRANSLATION_PROMPT_CONFIGURATION_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

  isSaveButtonDisabled(): boolean {
    let retVal = true;
    if (this.jsonEditor) {
      const INITIAL_VAL = lodash.cloneDeep(this.value.external);
      const UPDATED_VAL = lodash.cloneDeep(this.jsonEditor.get());
      retVal = lodash.isEqual(INITIAL_VAL, UPDATED_VAL);
    }
    return retVal;
  }

  isPromptTypeDeployment(): boolean {
    const RET_VAL = this.value.type === PROMPT_TYPES.DEPLOYMENT;
    return RET_VAL;
  }

}
