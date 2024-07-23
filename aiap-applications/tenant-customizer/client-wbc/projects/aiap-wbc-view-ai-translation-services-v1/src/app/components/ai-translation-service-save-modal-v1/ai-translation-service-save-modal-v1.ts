/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, AfterViewChecked, ChangeDetectorRef, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  AiTranslationServicesServiceV1
} from 'client-services';

import {
  NgForm,
} from '@angular/forms';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  BaseModalV1,
} from 'client-shared-views';

import {
  AI_TRANSLATION_SERVICES_MESSAGES,
} from 'client-utils';

@Component({
  selector: 'aiap-ai-translation-service-save-modal-v1',
  templateUrl: './ai-translation-service-save-modal-v1.html',
  styleUrls: ['./ai-translation-service-save-modal-v1.scss']
})
export class AiTranslationServiceSaveModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  static getClassName() {
    return 'AiTranslationServiceSaveModalV1';
  }

  _state: any = {
    isLoading: false,
    isApiKeyVisible: false,
    notification: {
      missingAiTranslationServiceType: {
        type: 'warning',
        title: 'Warning',
        message: 'Please select AI Translation Service type!',
        showClose: false,
        lowContrast: false
      }
    },
    selections: {
      types: [],
      type: undefined,
      authTypes: [],
      authType: undefined,
      isPasswordShown: false,
    },
  }

  _aiTranslationService: any = {
    id: undefined,
    type: undefined,
    name: undefined,
    external: {
      version: undefined,
      url: undefined,
      endpoint: undefined,
      authType: undefined,
      username: undefined,
      password: undefined,
    },
  };

  state = lodash.cloneDeep(this._state);
  aiTranslationService: any = lodash.cloneDeep(this._aiTranslationService);

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private aiTranslationServicesService: AiTranslationServicesServiceV1,
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

  handleLoadFormDataError(error: any) {
    _errorX(AiTranslationServiceSaveModalV1.getClassName(), 'refreshFormData', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AI_TRANSLATION_SERVICES_MESSAGES.ERROR.FIND_ONE_BY_ID);
    return of();
  }

  _sanitizedAiTranslationService() {
    const RET_VAL = lodash.cloneDeep(this.aiTranslationService);
    return RET_VAL;
  }

  save() {
    const AI_TRANSLATION_SERVICE = this._sanitizedAiTranslationService();
    _debugX(AiTranslationServiceSaveModalV1.getClassName(), 'save', { AI_TRANSLATION_SERVICE });
    this.eventsService.loadingEmit(true);
    this.aiTranslationServicesService.saveOne(AI_TRANSLATION_SERVICE)
      .pipe(
        catchError((error) => this.handleSaveOneError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(AiTranslationServiceSaveModalV1.getClassName(), 'save', { response });
        this.notificationService.showNotification(AI_TRANSLATION_SERVICES_MESSAGES.SUCCESS.SAVE_ONE);
        this.eventsService.filterEmit(undefined)
        this.isOpen = false;
      });
  }

  show(aiTranslationService: any = null) {
    this.state = lodash.cloneDeep(this._state);
    let newAiTranslationService: any;
    if (
      lodash.isEmpty(aiTranslationService?.id)
    ) {
      newAiTranslationService = lodash.cloneDeep(this._aiTranslationService);
    } else {
      newAiTranslationService = lodash.cloneDeep(aiTranslationService);
    }
    if (
      lodash.isEmpty(newAiTranslationService?.external)
    ) {
      newAiTranslationService.external = lodash.cloneDeep(this._aiTranslationService?.external);
    }
    this.aiTranslationService = newAiTranslationService;

    this.loadFormData();
  }

  loadFormData() {
    this.eventsService.loadingEmit(true);
    this.aiTranslationServicesService.loadAiTranslationServiceFormData()
      .pipe(
        tap(),
        catchError((error) => this.handleLoadFormDataError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(AiTranslationServiceSaveModalV1.getClassName(), 'loadFormData', { response });

        const NEW_STATE = lodash.cloneDeep(this._state);

        this.setSelectionsTypes(NEW_STATE, response?.types);
        this.setSelectionsAuthTypes(NEW_STATE, response?.authTypes);

        _debugX(AiTranslationServiceSaveModalV1.getClassName(), 'loadFormData', { NEW_STATE });
        this.state = NEW_STATE;

        this.notificationService.showNotification(AI_TRANSLATION_SERVICES_MESSAGES.SUCCESS.FIND_ONE_BY_ID);
        this.eventsService.loadingEmit(false);
        super.superShow();
      });
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
      _errorX(AiTranslationServiceSaveModalV1.getClassName(), 'setSelectionsTypes', {
        error: error,
        state: state,
        types: types,
        this_state: this.state,
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
      _errorX(AiTranslationServiceSaveModalV1.getClassName(), 'setSelectionsAuthTypes', {
        error: error,
        state: state,
        authTypes: authTypes,
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
        const isSelected = this.aiTranslationService?.type === type.value;
        retVal = {
          content: `${TYPE_NAME}`,
          selected: isSelected,
          value: type.value,
        }
      }
      return retVal;
    } catch (error: any) {
      _errorX(AiTranslationServiceSaveModalV1.getClassName(), '_transformTypeIntoDropDownItem', {
        error: error,
        this_state: this.state,
        type: type,
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
        const isSelected = this.aiTranslationService?.external?.authType === authType.type;
        retVal = {
          content: `${AUTH_TYPE_NAME}`,
          selected: isSelected,
          type: authType.type,
        }
      }
      return retVal;
    } catch (error: any) {
      _errorX(AiTranslationServiceSaveModalV1.getClassName(), '_transformAuthTypeIntoDropDownItem', {
        error: error,
        this_state: this.state,
        authType: authType,
      });
      throw error;
    }
  }

  handleSaveOneError(error: any) {
    _errorX(AiTranslationServiceSaveModalV1.getClassName(), 'handleSaveOneError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AI_TRANSLATION_SERVICES_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

}
