/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, AfterViewChecked, ChangeDetectorRef, Input } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  AiTranslationModelsServiceV1,
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
  AI_TRANSLATION_MODELS_MESSAGES,
} from 'client-utils';

@Component({
  selector: 'aiap-ai-translation-model-save-modal-v1',
  templateUrl: './ai-translation-model-save-modal-v1.html',
  styleUrls: ['./ai-translation-model-save-modal-v1.scss']
})
export class AiTranslationModelSaveModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  static getClassName() {
    return 'AiTranslationModelSaveModalV1';
  }

  @Input() aiTranslationService: any;

  _selections: any = {
    types: [],
    type: null,
    sources: [],
    targets: []
  };

  _aiTranslationModel: any = {
    id: null,
    name: null,
    type: null,
    source: null,
    target: null,
    status: 'DRAFT',
    serviceId: null,
    external: {}
  };

  selections: any = lodash.cloneDeep(this._selections);
  aiTranslationModel: any = lodash.cloneDeep(this._aiTranslationModel);
  initialAiTranslationModel: any = lodash.cloneDeep(this._aiTranslationModel);

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private aiTranslationModelsService: AiTranslationModelsServiceV1,
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

  _sanitizedAiTranslationModel() {
    const RET_VAL = lodash.cloneDeep(this.aiTranslationModel);
    return RET_VAL;
  }

  // TODO: this method should be aware in context of which service is being called because of available languages selection
  refreshFormData() {
    _debugX(AiTranslationModelSaveModalV1.getClassName(), 'refreshFormData');
    this.eventsService.loadingEmit(true);
    this.aiTranslationModelsService.loadAiTranslationModelFormData()
      .pipe(
        tap(),
        catchError((error) => this.handleLoadFormDataError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(AiTranslationModelSaveModalV1.getClassName(), 'refreshFormData', { response });

        const NEW_SELECTIONS = lodash.cloneDeep(this._selections);

        this.setSelectionsSources(NEW_SELECTIONS, response?.supportedLanguages);
        this.setSelectionsTargets(NEW_SELECTIONS, response?.supportedLanguages);
        this.setSelectionsTypes(NEW_SELECTIONS, response?.modelTypes?.[this.aiTranslationService?.type]);

        _debugX(AiTranslationModelSaveModalV1.getClassName(), 'refreshFormData', { NEW_SELECTIONS });
        this.selections = NEW_SELECTIONS;
        this.notificationService.showNotification(AI_TRANSLATION_MODELS_MESSAGES.SUCCESS.FIND_ONE_BY_ID);
        this.eventsService.loadingEmit(false);
        this.isOpen = true;
      });
  }

  handleLoadFormDataError(error: any) {
    _errorX(AiTranslationModelSaveModalV1.getClassName(), 'refreshFormData', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AI_TRANSLATION_MODELS_MESSAGES.ERROR.FIND_ONE_BY_ID);
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
      const isSelected = this.aiTranslationModel?.source === source.code;
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
      const isSelected = this.aiTranslationModel?.target === target.code;
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
      const isSelected = this.aiTranslationModel?.type === type.value;
      retVal = {
        content: `${TYPE_NAME}`,
        selected: isSelected,
        value: type.value,
      }
    }
    return retVal;
  }

  save() {
    const AI_TRANSLATION_MODEL = this._sanitizedAiTranslationModel();
    if (AI_TRANSLATION_MODEL.source === AI_TRANSLATION_MODEL.target) {
      this.notificationService.showNotification(AI_TRANSLATION_MODELS_MESSAGES.ERROR.SAME_LANGUAGES);
      return;
    }
    AI_TRANSLATION_MODEL.serviceId = this.aiTranslationService?.id;
    _debugX(AiTranslationModelSaveModalV1.getClassName(), 'save', { AI_TRANSLATION_MODEL });
    this.eventsService.loadingEmit(true);
    this.aiTranslationModelsService.saveOne(AI_TRANSLATION_MODEL)
      .pipe(
        catchError((error) => this.handleSaveOneError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(AiTranslationModelSaveModalV1.getClassName(), 'save', { response });
        this.notificationService.showNotification(AI_TRANSLATION_MODELS_MESSAGES.SUCCESS.SAVE_ONE);
        this.eventsService.filterEmit(false)
        this.isOpen = false;
      });
  }

  show(aiTranslationModel: any = null, aiTranslationService: any = null) {
    this.aiTranslationService = aiTranslationService;
    this.selections = lodash.cloneDeep(this._selections);
    let newAiTranslationModel;
    if (
      lodash.isEmpty(aiTranslationModel?.id)
    ) {
      newAiTranslationModel = lodash.cloneDeep(this._aiTranslationModel);
    } else {
      newAiTranslationModel = lodash.cloneDeep(aiTranslationModel);
    }
    if (
      lodash.isEmpty(newAiTranslationModel?.external)
    ) {
      newAiTranslationModel.external = lodash.cloneDeep(this._aiTranslationModel?.external);
    }
    
    this.aiTranslationModel = newAiTranslationModel;
    this.initialAiTranslationModel = lodash.cloneDeep(newAiTranslationModel);
    this.isOpen = true;
    this.refreshFormData();
  }

  handleSaveOneError(error: any) {
    _errorX(AiTranslationModelSaveModalV1.getClassName(), 'handleSaveOneError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AI_TRANSLATION_MODELS_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

  onTypeSelected() {
    this.aiTranslationModel.type = this.selections.type.value;
    _debugX(AiTranslationModelSaveModalV1.getClassName(), 'onTypeSelected', {
      this_aiTranslationModel: this.aiTranslationModel,
      this_selections: this.selections,
    });
  }

  onSourceLanguageSelected(event: any) {
    const LANGUAGE = event?.item;
    this.aiTranslationModel.source = LANGUAGE?.code;
    _debugX(AiTranslationModelSaveModalV1.getClassName(), 'onSourceLanguageSelected', {
      LANGUAGE: LANGUAGE,
      this_aiTranslationModel: this.aiTranslationModel,
      this_selections: this.selections,
    });
  }

  onTargetLanguageSelected(event: any) {
    const LANGUAGE = event?.item;
    this.aiTranslationModel.target = LANGUAGE?.code;
    _debugX(AiTranslationModelSaveModalV1.getClassName(), 'onTargetLanguageSelected', {
      LANGUAGE: LANGUAGE,
      this_aiTranslationModel: this.aiTranslationModel,
      this_selections: this.selections,
    });
  }

  isSaveDisabled() {
    let retVal = true;
     if (
       !lodash.isEmpty(this.aiTranslationModel.name) &&
       !lodash.isEmpty(this.aiTranslationModel.type) &&
       !lodash.isEmpty(this.aiTranslationModel.source) &&
       !lodash.isEmpty(this.aiTranslationModel.target)
     ) {
       if (
         this.initialAiTranslationModel?.name !== this.aiTranslationModel.name ||
         this.initialAiTranslationModel?.type !== this.aiTranslationModel.type ||
         this.initialAiTranslationModel?.source !== this.aiTranslationModel.source ||
         this.initialAiTranslationModel?.target !== this.aiTranslationModel.target 
       ) {
         retVal =  false;
       }
     }
     return retVal;
   }

}
