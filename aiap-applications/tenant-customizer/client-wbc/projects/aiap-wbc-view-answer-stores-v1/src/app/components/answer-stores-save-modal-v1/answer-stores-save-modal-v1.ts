/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnDestroy,
  AfterViewInit,
  AfterViewChecked,
  ChangeDetectorRef,
} from '@angular/core';

import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
  LANGUAGE_LIST,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  AnswerStoresServiceV1,
} from 'client-services';

import { BaseModalV1 } from 'client-shared-views';

import {
  ANSWER_STORES_MESSAGES,
} from '../../messages';

@Component({
  selector: 'aiap-answer-stores-save-modal-v1',
  templateUrl: './answer-stores-save-modal-v1.html',
  styleUrls: ['./answer-stores-save-modal-v1.scss'],
})
export class AnswerStoresSaveModalV1 extends BaseModalV1 implements OnDestroy, AfterViewInit, AfterViewChecked {

  static getClassName() {
    return 'AnswerStoresSaveModalV1';
  }

  isOpen = false;

  _selections: any = {
    assistants: [],
    assistant: undefined,
    pullOptions: [],
    pullOption: undefined,
    isPullOptionsSkeletonVisible: false,
    languages: [],
    language: undefined
  }

  _answerStore: any = {
    id: undefined,
    name: undefined,
    reference: undefined,
    assistantId: undefined,
    pullConfiguration: undefined,
    configurations: {
      language: undefined
    }
  };

  selections: any = lodash.cloneDeep(this._selections);
  answerStore: any = lodash.cloneDeep(this._answerStore);

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private answerStoresService: AnswerStoresServiceV1,
  ) {
    super();
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  onAssistantSelected() {
    _debugX(AnswerStoresSaveModalV1.getClassName(), 'onAssistantSelected', { ASSISTANT: this.selections?.assistant });

    this.answerStore.assistantId = this.selections?.assistant?.id;
    _debugX(AnswerStoresSaveModalV1.getClassName(), 'onAssistantSelected', { this_answerStore: this.answerStore });

    this.refreshFormData();
  }

  onLanguageSelected(event) {
    const LANGUAGE = event?.item?.language;
    _debugX(AnswerStoresSaveModalV1.getClassName(), 'onLanguageSelected', { LANGUAGE: LANGUAGE });
    if (lodash.isEmpty(this.answerStore.configurations)) {
      this.answerStore.configurations = {};
    }
    this.answerStore.configurations.language = LANGUAGE;
    this.refreshFormData();
  }

  onPullOptionSelected(event) {
    const PULL_OPTION = event?.item;
    _debugX(AnswerStoresSaveModalV1.getClassName(), 'onPullOptionSelected', { PULL_OPTION: PULL_OPTION });
    this.selections.pullOption = PULL_OPTION;
  }

  refreshFormData() {
    this.selections.isPullOptionsSkeletonVisible = true;
    const ASSISTANT = this.selections?.assistant;
    _debugX(AnswerStoresSaveModalV1.getClassName(), 'refreshFormData', { ASSISTANT: ASSISTANT });
    this.answerStoresService.retrieveSaveAnswerStoreFormData(ASSISTANT)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleRetrieveDatasourcesError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((data: any) => {
        _debugX(AnswerStoresSaveModalV1.getClassName(), 'refreshFormData', { data: data });
        this.selections.pullOptions = this._transformPullOptionsIntoDropDownItems(data?.pullOptions);
        this.selections.assistants = this._transformAssistantsIntoDropDownItems(data?.assistants);
        this.selections.languages = this._transformLanguagesIntoDropDownItems(LANGUAGE_LIST);
        _debugX(AnswerStoresSaveModalV1.getClassName(), 'refreshFormData selections', { this_selections: this.selections });
        this.eventsService.loadingEmit(false);
        this.superShow();
        this.selections.isPullOptionsSkeletonVisible = false;
      });
  }

  refreshAnswerStoreData(id) {
    this.answerStoresService.findOneLiteById(id)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleRetrieveDatasourcesError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((data: any) => {
        _debugX(AnswerStoresSaveModalV1.getClassName(), 'refreshAnswerStoreData', { data });
        this.answerStore = data;
      });
  }

  isSaveDisabled() {
    if (
      !lodash.isEmpty(this.answerStore?.name) &&
      !lodash.isEmpty(this.answerStore?.configurations?.language) &&
      !lodash.isEmpty(this.answerStore?.assistantId)) {
      return false;
    }
    return true;
  }

  isPullOptionsDisabled() {
    let retVal = true;
    if (
      this.selections &&
      this.selections.pullOptions &&
      this.selections.pullOptions.length > 0
    ) {
      retVal = false;
    }
    return retVal;
  }

  _transformPullOptionIntoDropDownItem(option) {
    let retVal;
    if (
      option?.tenant?.id &&
      option?.tenant?.environment?.id &&
      option?.assistant?.id &&
      option?.answerStore?.id &&
      this.answerStore?.id !== option?.answerStore?.id
    ) {
      const TENANT_ENVIRONMENT_ID = option.tenant.environment.id;
      const TENANT_NAME = option.tenant.name;

      const ASSISTANT_ID = option.assistant.id;

      const ANSWER_STORE_NAME = option.answerStore.name;
      retVal = {
        content: `[${TENANT_ENVIRONMENT_ID}] ${TENANT_NAME} / ${ASSISTANT_ID} / ${ANSWER_STORE_NAME}`,
        selected: false,
        tenantId: option.tenant.id,
        assistantId: option.assistant.id,
        answerStoreId: option.answerStore.id
      }
      if (
        this.selections?.pullOption?.tenantId === retVal.tenantId &&
        this.selections?.pullOption?.assistantId === retVal.assistantId &&
        this.selections?.pullOption?.answerStoreId === retVal.answerStoreId
      ) {
        retVal.selected = true;
      }
    }
    return retVal;
  }

  _transformPullOptionsIntoDropDownItems(options) {
    const RET_VAL = [];
    if (
      options &&
      options.length > 0
    ) {
      for (const OPTION of options) {
        const TMP_OPTION = this._transformPullOptionIntoDropDownItem(OPTION);
        if (
          TMP_OPTION
        ) {
          RET_VAL.push(TMP_OPTION);
        }
        if (
          TMP_OPTION?.selected
        ) {
          this.selections.pullOption = TMP_OPTION;
        }
      }
    }
    return RET_VAL;
  }

  _transformAssistantsIntoDropDownItem(assistant) {
    let retVal;
    if (
      assistant &&
      assistant.name &&
      assistant.id
    ) {
      const ASSISTANT_NAME = assistant.name;
      const isSelected = this.answerStore?.assistantId === assistant.id;
      retVal = {
        content: `${ASSISTANT_NAME}`,
        selected: isSelected,
        id: assistant.id,
        name: assistant.name,
      }
    }
    return retVal;
  }

  _transformAssistantsIntoDropDownItems(assistants) {
    const RET_VAL = [];
    if (
      assistants &&
      assistants.length > 0
    ) {
      for (const ASSISTANT of assistants) {
        const TMP_ASSISTANT = this._transformAssistantsIntoDropDownItem(ASSISTANT);
        if (
          TMP_ASSISTANT
        ) {
          RET_VAL.push(TMP_ASSISTANT);
        }
      }
    }
    return RET_VAL;
  }

  _transformLanguagesIntoDropDownItems(languageList) {
    const RET_VAL = [];
    if (
      !lodash.isEmpty(languageList) &&
      lodash.isArray(languageList)
    ) {
      for (const LANGUAGE of languageList) {
        const TMP_LANGUAGE = this._transformLanguagesIntoDropDownItem(LANGUAGE);
        if (
          TMP_LANGUAGE
        ) {
          RET_VAL.push(TMP_LANGUAGE);
        }
      }
    }
    return RET_VAL;
  }

  _transformLanguagesIntoDropDownItem(language) {
    let retVal;
    if (
      !lodash.isEmpty(language?.name) &&
      !lodash.isEmpty(language?.code)
    ) {
      const ITEM_LANGUAGE = language?.code;
      const ITEM_LANGUAGE_NAME = language?.name;
      let isSelected = false;
      if (
        this.answerStore?.configurations?.language
      ) {
        const STORE_LANGUAGE = LANGUAGE_LIST.find(languageItem => languageItem.code === this.answerStore?.configurations?.language);
        isSelected = ITEM_LANGUAGE_NAME === STORE_LANGUAGE.name;
      }
      retVal = {
        content: ITEM_LANGUAGE_NAME,
        selected: isSelected,
        language: ITEM_LANGUAGE,
        languageName: ITEM_LANGUAGE_NAME
      };
    }
    return retVal;
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit() {
    //
  }

  handleRetrieveDatasourcesError(error: any) {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(ANSWER_STORES_MESSAGES.ERROR.LOAD_DATASOURCES);
    _errorX(AnswerStoresSaveModalV1.getClassName(), 'handleRetrieveDatasourcesError', { error });
    return of();
  }

  close() {
    super.close();
  }

  _sanitizeAnswerStore() {
    const RET_VAL = lodash.cloneDeep(this._answerStore);
    if (
      this.answerStore?.id
    ) {
      RET_VAL.id = this.answerStore.id;
    }
    RET_VAL.name = this.answerStore?.name;
    RET_VAL.reference = this.answerStore?.reference;
    RET_VAL.assistantId = this.selections?.assistant?.id;
    RET_VAL.pullConfiguration = {
      tenantId: this.selections?.pullOption?.tenantId,
      assistantId: this.selections?.pullOption?.assistantId,
      answerStoreId: this.selections?.pullOption?.answerStoreId
    };
    RET_VAL.configurations = {
      language: this.answerStore?.configurations?.language
    };
    return RET_VAL;
  }

  save() {
    const ANSWER_STORE = this._sanitizeAnswerStore();
    _debugX(AnswerStoresSaveModalV1.getClassName(), 'answer-store-save-modal | save', { ANSWER_STORE });
    this.answerStoresService.saveOne(ANSWER_STORE)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleSaveError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response) => {
        _debugX(AnswerStoresSaveModalV1.getClassName(), 'answer-store-save-modal | save | response', { response });
        this.notificationService.showNotification(ANSWER_STORES_MESSAGES.SUCCESS.SAVE_ONE);
        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(null);
        this.close();
      });
  }

  handleSaveError(error: any) {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(ANSWER_STORES_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

  show(store: any) {
    _debugX(AnswerStoresSaveModalV1.getClassName(), 'answer-store-save-modal | show', { store });
    this.selections = lodash.cloneDeep(this._selections);
    this.answerStore = lodash.cloneDeep(this._answerStore);
    const ANSWER_STORE = store;
    if (
      ANSWER_STORE &&
      ANSWER_STORE.id
    ) {
      this.refreshAnswerStoreData(ANSWER_STORE.id);
    }
    this.selections.pullOption = ANSWER_STORE?.pullConfiguration;
    this.selections.assistant = {
      id: ANSWER_STORE?.assistantId
    }
    this.refreshFormData();
  }

}
