/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  ChangeDetectorRef,
} from '@angular/core';

import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  AI_SERVICES_MESSAGES,
} from 'client-utils';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  BaseModal,
} from 'client-shared-views';

import {
  AiServicesServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-ai-service-save-modal-v1',
  templateUrl: './ai-service-save-modal-v1.html',
  styleUrls: ['./ai-service-save-modal-v1.scss']
})
export class AiServiceSaveModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  static getClassName() {
    return 'AiServiceSaveModalV1';
  }

  _state: any = {
    synchroniseAiSkills: false,
    isLoading: false,
    isPullOptionsSkeletonVisible: false,
    isApiKeyVisible: false,
    notification: {
      missingAiServiceType: {
        type: 'warning',
        title: 'Warning',
        message: 'Please select AI Service type!',
        showClose: false,
        lowContrast: false
      }
    },
    selections: {
      assistants: [],
      assistant: undefined,
      types: [],
      type: undefined,
      authTypes: [],
      authType: undefined,
      pullOptions: [],
      pullOption: undefined,
      isPasswordShown: false,
    },
  }

  _aiService: any = {
    id: undefined,
    type: undefined,
    name: undefined,
    assistantId: undefined,
    external: {
      id: undefined,
      version: undefined,
      url: undefined,
      authType: undefined,
      username: undefined,
      password: undefined,
      completion: {
        model: 'text-davinci-003',
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }
    },
    pullConfiguration: undefined
  };

  aiService = lodash.cloneDeep(this._aiService);
  state = lodash.cloneDeep(this._state);

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private aiServicesService: AiServicesServiceV1,
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
  ) {
    super();
  }

  ngOnInit() {
    this.superNgOnInit(this.eventsService);
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit() {
    //
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  loadFormData() {
    this.state.isPullOptionsSkeletonVisible = true;
    const ASSISTANT = { id: this.aiService?.assistantId };
    _debugX(AiServiceSaveModalV1.getClassName(), 'loadFormData', { ASSISTANT });
    this.eventsService.loadingEmit(true);
    this.aiServicesService.loadAiServiceFormData(ASSISTANT)
      .pipe(
        tap(),
        catchError((error) => this.handleLoadFormDataError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(AiServiceSaveModalV1.getClassName(), 'loadFormData', { response });

        const NEW_STATE = lodash.cloneDeep(this._state);

        this.setSelectionsAssistants(NEW_STATE, response?.assistants);
        this.setSelectionsPullOptions(NEW_STATE, response?.pullOptions);
        this.setSelectionsTypes(NEW_STATE, response?.types);
        this.setSelectionsAuthTypes(NEW_STATE, response?.authTypes);

        _debugX(AiServiceSaveModalV1.getClassName(), 'loadFormData', { NEW_STATE });
        this.state = NEW_STATE;

        this.notificationService.showNotification(AI_SERVICES_MESSAGES.SUCCESS.FIND_ONE_BY_ID);
        this.eventsService.loadingEmit(false);
        super.superShow();
      });
  }

  handleLoadFormDataError(error: any) {
    _errorX(AiServiceSaveModalV1.getClassName(), 'handleLoadFormDataError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AI_SERVICES_MESSAGES.ERROR.FIND_ONE_BY_ID);
    return of();
  }

  setSelectionsTypes(state: any, types: Array<any>) {
    try {
      if (
        lodash.isEmpty(state)
      ) {
        return;
      }
      if (
        lodash.isEmpty(state?.selections)
      ) {
        state.selections = {};
      }
      const TYPES: Array<any> = [];
      if (
        types?.length > 0
      ) {
        for (const TYPE of types) {
          const TMP_TYPE = this._transformTypeIntoDropDownItem(TYPE);
          if (
            TMP_TYPE
          ) {
            TYPES.push(TMP_TYPE);
          }
          if (
            TMP_TYPE?.selected
          ) {
            state.selections.type = TMP_TYPE;
          }
        }
      }
      state.selections.types = TYPES;
    } catch (error: any) {
      _errorX(AiServiceSaveModalV1.getClassName(), 'setSelectionsTypes', {
        error: error,
        state: state,
        types: types,
        this_state: this.state,
      });
      throw error;
    }
  }

  _transformTypeIntoDropDownItem(type: any) {
    try {
      let retVal: any;
      if (
        type?.value &&
        type?.name
      ) {
        const TYPE_NAME = type.name;
        const isSelected = this.aiService?.type === type.value;
        retVal = {
          content: `${TYPE_NAME}`,
          selected: isSelected,
          value: type.value,
        }
      }
      return retVal;
    } catch (error: any) {
      _errorX(AiServiceSaveModalV1.getClassName(), '_transformTypeIntoDropDownItem', {
        error: error,
        this_state: this.state,
        type: type,
      });
      throw error;
    }
  }

  setSelectionsAssistants(state: any, assistants: Array<any>) {
    try {
      if (
        lodash.isEmpty(state)
      ) {
        return;
      }
      if (
        lodash.isEmpty(state?.selections)
      ) {
        state.selections = {};
      }
      const ASSISTANTS: Array<any> = [];
      if (
        assistants?.length > 0
      ) {
        for (const ASSISTANT of assistants) {
          const TMP_ASSISTANT = this._transformAssistantsIntoDropDownItem(ASSISTANT);
          if (
            TMP_ASSISTANT
          ) {
            ASSISTANTS.push(TMP_ASSISTANT);
          }
          if (
            TMP_ASSISTANT?.selected
          ) {
            state.selections.assistant = TMP_ASSISTANT;
          }
        }
      }
      state.selections.assistants = ASSISTANTS;
    } catch (error) {
      _errorX(AiServiceSaveModalV1.getClassName(), 'setSelectionsAssistants', {
        error: error,
        state: state,
        assistants: assistants,
        this_state: this.state,
      });
      throw error;
    }
  }

  _transformAssistantsIntoDropDownItem(assistant: any) {
    let retVal: any;
    try {
      if (
        assistant?.name &&
        assistant?.id
      ) {
        const ASSISTANT_NAME = assistant.name;
        const IS_SELECTED = this.aiService?.assistantId === assistant.id;
        retVal = {
          content: `${ASSISTANT_NAME}`,
          selected: IS_SELECTED,
          value: {
            id: assistant.id,
            name: assistant.name,
          }
        }
      }
      return retVal;
    } catch (error: any) {
      _errorX(AiServiceSaveModalV1.getClassName(), '_transformAssistantsIntoDropDownItem', {
        error: error,
        this_state: this.state,
        assistant: assistant,
      });
      throw error;
    }
  }

  setSelectionsAuthTypes(state: any, authTypes: Array<any>) {
    try {
      if (
        lodash.isEmpty(state)
      ) {
        return;
      }
      if (
        lodash.isEmpty(state?.selections)
      ) {
        state.selections = {};
      }
      const AUTH_TYPES = [];
      if (
        authTypes?.length > 0
      ) {
        for (const AUTH_TYPE of authTypes) {
          const TMP_AUTH_TYPE = this._transformAuthTypeIntoDropDownItem(AUTH_TYPE);
          if (
            TMP_AUTH_TYPE
          ) {
            AUTH_TYPES.push(TMP_AUTH_TYPE);
          }
          if (
            TMP_AUTH_TYPE?.selected
          ) {
            state.selections.authType = TMP_AUTH_TYPE;
          }
        }
      }
      state.selections.authTypes = AUTH_TYPES;
    } catch (error) {
      _errorX(AiServiceSaveModalV1.getClassName(), 'setSelectionsAuthTypes', {
        error: error,
        state: state,
        authTypes: authTypes,
        this_state: this.state,
      });
      throw error;
    }
  }

  _transformAuthTypeIntoDropDownItem(authType: any) {
    try {
      let retVal;
      if (
        authType?.type &&
        authType?.name
      ) {
        const AUTH_TYPE_NAME = authType.name;
        const isSelected = this.aiService?.external?.authType === authType.type;
        retVal = {
          content: `${AUTH_TYPE_NAME}`,
          selected: isSelected,
          type: authType.type,
        }
      }
      return retVal;
    } catch (error: any) {
      _errorX(AiServiceSaveModalV1.getClassName(), '_transformAuthTypeIntoDropDownItem', {
        error: error,
        this_state: this.state,
        authType: authType,
      });
      throw error;
    }
  }

  setSelectionsPullOptions(state: any, pullOptions: Array<any>) {
    try {
      if (
        lodash.isEmpty(state)
      ) {
        return;
      }
      if (
        lodash.isEmpty(state?.selections)
      ) {
        state.selections = {};
      }
      const PULL_OPTIONS: Array<any> = [];

      if (
        pullOptions?.length > 0
      ) {
        for (const PULL_OPTION of pullOptions) {
          const TMP_PULL_OPTION = this._transformPullOptionIntoDropDownItem(PULL_OPTION);
          if (
            TMP_PULL_OPTION
          ) {
            PULL_OPTIONS.push(TMP_PULL_OPTION);
          }
          if (
            TMP_PULL_OPTION?.selected
          ) {
            state.selections.pullOption = TMP_PULL_OPTION;
          }
        }
      }
      if (
        state.selections
      ) {
        state.selections.pullOptions = PULL_OPTIONS;
      }
    } catch (error: any) {
      _errorX(AiServiceSaveModalV1.getClassName(), 'setSelectionsPullOptions', {
        error: error,
        state: state,
        pullOptions: pullOptions,
        this_state: this.state,
      });
      throw error;
    }
  }

  _transformPullOptionIntoDropDownItem(option: any) {
    try {
      let retVal: any;
      if (
        option?.tenant?.id &&
        option?.tenant?.environment?.id &&
        option?.assistant?.id &&
        option?.aiService?.id &&
        this.aiService?.id !== option?.aiService?.id
      ) {
        const TENANT_ENVIRONMENT_ID = option.tenant.environment.id;
        const TENANT_NAME = option.tenant.name;
        const ASSISTANT_ID = option.assistant.id;
        const AI_SERVICE_NAME = option.aiService.name;
        retVal = {
          content: `[${TENANT_ENVIRONMENT_ID}] ${TENANT_NAME} / ${ASSISTANT_ID} / ${AI_SERVICE_NAME}`,
          selected: false,
          tenantId: option.tenant.id,
          assistantId: option.assistant.id,
          aiServiceId: option.aiService.id
        }
        if (
          this.aiService?.pullConfiguration?.tenantId === retVal.tenantId &&
          this.aiService?.pullConfiguration?.assistantId === retVal.assistantId &&
          this.aiService?.pullConfiguration?.aiServiceId === retVal.aiServiceId
        ) {
          retVal.selected = true;
        }
      }
      return retVal;
    } catch (error: any) {
      _errorX(AiServiceSaveModalV1.getClassName(), '_transformPullOptionIntoDropDownItem', {
        error: error,
        this_state: this.state,
        option: option,
      });
      throw error;
    }
  }

  _sanitizedAiService() {
    const RET_VAL = lodash.cloneDeep(this.aiService);
    return RET_VAL;
  }

  save() {
    const AI_SERVICE = this._sanitizedAiService();
    const OPTIONS = {
      synchroniseAiSkills: this.state?.synchroniseAiSkills
    };
    _debugX(AiServiceSaveModalV1.getClassName(), 'save', { AI_SERVICE, OPTIONS });
    this.eventsService.loadingEmit(true);
    this.aiServicesService.saveOne(AI_SERVICE, OPTIONS)
      .pipe(
        catchError((error) => this.handleSaveOneError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(AiServiceSaveModalV1.getClassName(), 'save', { response });
        this.notificationService.showNotification(AI_SERVICES_MESSAGES.SUCCESS.SAVE_ONE);
        this.eventsService.filterEmit(undefined)
        super.close();
      });
  }

  show(aiService: any = null) {
    this.state.synchroniseAiSkills = false;
    this.state = lodash.cloneDeep(this._state);
    let newAiService: any;
    if (
      lodash.isEmpty(aiService?.id)
    ) {
      this.state.synchroniseAiSkills = true;
      newAiService = lodash.cloneDeep(this._aiService);
    } else {
      newAiService = lodash.cloneDeep(aiService);
    }
    if (
      lodash.isEmpty(newAiService?.external)
    ) {
      newAiService.external = lodash.cloneDeep(this._aiService?.external);
    }
    if (
      newAiService?.type === 'CHAT_GPT_V3' &&
      lodash.isEmpty(newAiService?.external?.completion)
    ) {
      newAiService.external.completion = lodash.cloneDeep(this._aiService.external.completion);
    }
    this.aiService = newAiService;
    this.loadFormData();
  }

  handleSaveOneError(error: any) {
    _errorX(AiServiceSaveModalV1.getClassName(), 'handleSaveOneError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AI_SERVICES_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

}
