/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, AfterViewChecked, ChangeDetectorRef, Input } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  AiTranslationPromptsServiceV1,
} from 'client-services';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  BaseModalV1,
} from 'client-shared-views';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  AI_TRANSLATION_PROMPTS_MESSAGES,
} from 'client-utils';

@Component({
  selector: 'aiap-ai-translation-prompt-save-modal-v1',
  templateUrl: './ai-translation-prompt-save-modal-v1.html',
  styleUrls: ['./ai-translation-prompt-save-modal-v1.scss']
})
export class AiTranslationPromptSaveModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  static getClassName() {
    return 'AiTranslationPromptSaveModalV1';
  }

  @Input() aiTranslationService: any;

  _selections: any = {
    sources: [],
    source: null,
    targets: [],
    target: null,
    types: [],
    type: null,
  };

  _aiTranslationPrompt: any = {
    id: null,
    name: null,
    type: null,
    source: null,
    target: null,
    serviceId: null,
    deploymentName: null,
    projectId: null,
    external: {}
  };

  selections: any = lodash.cloneDeep(this._selections);
  aiTranslationPrompt: any = lodash.cloneDeep(this._aiTranslationPrompt);
  initialAiTranslationPrompt: any = lodash.cloneDeep(this._aiTranslationPrompt);

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private aiTranslationPromptsService: AiTranslationPromptsServiceV1,
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

  _sanitizedAiTranslationPrompt() {
    const RET_VAL = lodash.cloneDeep(this.aiTranslationPrompt);
    return RET_VAL;
  }

  refreshFormData() {
    _debugX(AiTranslationPromptSaveModalV1.getClassName(), 'refreshFormData');
    this.eventsService.loadingEmit(true);
    this.aiTranslationPromptsService.loadAiTranslationPromptFormData()
      .pipe(
        tap(),
        catchError((error) => this.handleLoadFormDataError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(AiTranslationPromptSaveModalV1.getClassName(), 'refreshFormData', { response });

        const NEW_SELECTIONS = lodash.cloneDeep(this._selections);

        this.setSelectionsSources(NEW_SELECTIONS, response?.supportedLanguages);
        this.setSelectionsTargets(NEW_SELECTIONS, response?.supportedLanguages);
        this.setSelectionsTypes(NEW_SELECTIONS, response?.promptTypes?.[this.aiTranslationService?.type]);

        _debugX(AiTranslationPromptSaveModalV1.getClassName(), 'refreshFormData', { NEW_SELECTIONS });
        this.selections = NEW_SELECTIONS;
        this.notificationService.showNotification(AI_TRANSLATION_PROMPTS_MESSAGES.SUCCESS.FIND_ONE_BY_ID);
        this.eventsService.loadingEmit(false);
        this.isOpen = true;
      });
  }

  handleLoadFormDataError(error: any) {
    _errorX(AiTranslationPromptSaveModalV1.getClassName(), 'refreshFormData', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AI_TRANSLATION_PROMPTS_MESSAGES.ERROR.FIND_ONE_BY_ID);
    return of();
  }

  setSelectionsSources(selections, sources: any[]) {
    const SOURCES = [];

    if (!lodash.isEmpty(sources)) {
      sources.forEach((source: any) => {
        const TMP_SOURCE = this._transformSourceIntoDropDownItem(source);
        if (
          TMP_SOURCE
        ) {
          SOURCES.push(TMP_SOURCE);

          if (
            TMP_SOURCE.selected
          ) {
            selections.source = TMP_SOURCE;
          }
        }
      });
    }

    selections.sources = SOURCES;
  }

  _transformSourceIntoDropDownItem(source) {
    let retVal;
    if (
      source &&
      source.name &&
      source.code
    ) {
      const SOURCE_LANG_NAME = source.name;
      const isSelected = this.aiTranslationPrompt?.source === source.code;
      retVal = {
        content: `${SOURCE_LANG_NAME}`,
        selected: isSelected,
        code: source.code,
      }
    }
    return retVal;
  }

  setSelectionsTargets(selections, targets: any[]) {
    const TARGETS = [];

    if (!lodash.isEmpty(targets)) {
      targets.forEach((target: any) => {
        const TMP_TARGET = this._transformTargetIntoDropDownItem(target);
        if (
          TMP_TARGET
        ) {
          TARGETS.push(TMP_TARGET);

          if (
            TMP_TARGET.selected
          ) {
            selections.target = TMP_TARGET;
          }
        }
      });
    }

    selections.targets = TARGETS;
  }

  _transformTargetIntoDropDownItem(target) {
    let retVal;
    if (
      target &&
      target.name &&
      target.code
    ) {
      const TARGET_LANG_NAME = target.name;
      const isSelected = this.aiTranslationPrompt?.target === target.code;
      retVal = {
        content: `${TARGET_LANG_NAME}`,
        selected: isSelected,
        code: target.code,
      }
    }
    return retVal;
  }

  setSelectionsTypes(selections, types: any[]) {
    const TYPES = [];

    if (!lodash.isEmpty(types)) {
      types.forEach((type: any) => {
        const TMP_TYPE = this._transformTypeIntoDropDownItem(type);
        if (
          TMP_TYPE
        ) {
          TYPES.push(TMP_TYPE);

          if (
            TMP_TYPE.selected
          ) {
            selections.type = TMP_TYPE;
          }
        }
      });
    }

    selections.types = TYPES;
  }

  _transformTypeIntoDropDownItem(type) {
    let retVal;
    if (
      type &&
      type.content &&
      type.value
    ) {
      const TYPE_NAME = type.content;
      const isSelected = this.aiTranslationPrompt?.type === type.value;
      retVal = {
        content: `${TYPE_NAME}`,
        selected: isSelected,
        value: type.value,
      }
    }
    return retVal;
  }

  save() {
    const AI_TRANSLATION_PROMPT = this._sanitizedAiTranslationPrompt();
    if (AI_TRANSLATION_PROMPT.source === AI_TRANSLATION_PROMPT.target) {
      this.notificationService.showNotification(AI_TRANSLATION_PROMPTS_MESSAGES.ERROR.SAME_LANGUAGES);
      return;
    }
    AI_TRANSLATION_PROMPT.serviceId = this.aiTranslationService?.id;
    _debugX(AiTranslationPromptSaveModalV1.getClassName(), 'save', { AI_TRANSLATION_PROMPT });
    this.eventsService.loadingEmit(true);
    this.aiTranslationPromptsService.saveOne(AI_TRANSLATION_PROMPT)
      .pipe(
        catchError((error) => this.handleSaveOneError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(AiTranslationPromptSaveModalV1.getClassName(), 'save', { response });
        this.notificationService.showNotification(AI_TRANSLATION_PROMPTS_MESSAGES.SUCCESS.SAVE_ONE);
        this.eventsService.filterEmit(false)
        this.isOpen = false;
      });
  }

  show(aiTranslationPrompt: any = null, aiTranslationService: any = null) {
    this.aiTranslationService = aiTranslationService;
    this.selections = lodash.cloneDeep(this._selections);
    let newAiTranslationPrompt;
    if (
      lodash.isEmpty(aiTranslationPrompt?.id)
    ) {
      newAiTranslationPrompt = lodash.cloneDeep(this._aiTranslationPrompt);
    } else {
      newAiTranslationPrompt = lodash.cloneDeep(aiTranslationPrompt);
    }
    if (
      lodash.isEmpty(newAiTranslationPrompt?.external)
    ) {
      newAiTranslationPrompt.external = lodash.cloneDeep(this._aiTranslationPrompt?.external);
    }

    this.aiTranslationPrompt = newAiTranslationPrompt;
    this.initialAiTranslationPrompt = lodash.cloneDeep(newAiTranslationPrompt);
    this.isOpen = true;
    this.refreshFormData();
  }

  handleSaveOneError(error: any) {
    _errorX(AiTranslationPromptSaveModalV1.getClassName(), 'handleSaveOneError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AI_TRANSLATION_PROMPTS_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

  isSelectedType(type: string) {
    const RET_VAL = this.selections.type?.value === type;
    return RET_VAL;
  }

  onTypeSelected() {
    this.aiTranslationPrompt.type = this.selections.type.value;
    this.aiTranslationPrompt.deploymentName = null;
    this.aiTranslationPrompt.projectId = null;
    _debugX(AiTranslationPromptSaveModalV1.getClassName(), 'onTypeSelected', {
      this_aiTranslationPrompt: this.aiTranslationPrompt,
      this_selections: this.selections,
    });
  }

  onSourceLanguageSelected(event: any) {
    const LANGUAGE = event?.item;
    this.aiTranslationPrompt.source = LANGUAGE?.code;
    _debugX(AiTranslationPromptSaveModalV1.getClassName(), 'onSourceLanguageSelected', {
      LANGUAGE: LANGUAGE,
      this_aiTranslationPrompt: this.aiTranslationPrompt,
      this_selections: this.selections,
    });
  }

  onTargetLanguageSelected(event: any) {
    const LANGUAGE = event?.item;
    this.aiTranslationPrompt.target = LANGUAGE?.code;
    _debugX(AiTranslationPromptSaveModalV1.getClassName(), 'onTargetLanguageSelected', {
      LANGUAGE: LANGUAGE,
      this_aiTranslationPrompt: this.aiTranslationPrompt,
      this_selections: this.selections,
    });
  }
}
