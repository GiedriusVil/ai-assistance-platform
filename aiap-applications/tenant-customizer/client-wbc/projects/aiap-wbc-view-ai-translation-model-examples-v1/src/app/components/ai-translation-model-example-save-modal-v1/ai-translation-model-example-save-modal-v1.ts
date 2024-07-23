/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, AfterViewChecked, ChangeDetectorRef, Input } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  AiTranslationModelExamplesServiceV1,
} from 'client-services';

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
  AI_TRANSLATION_MODEL_EXAMPLES_MESSAGES,
} from 'client-utils';

@Component({
  selector: 'aiap-ai-translation-model-example-save-modal-v1',
  templateUrl: './ai-translation-model-example-save-modal-v1.html',
  styleUrls: ['./ai-translation-model-example-save-modal-v1.scss']
})
export class AiTranslationModelExampleSaveModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  static getClassName() {
    return 'AiTranslationModelExampleSaveModalV1';
  }

  @Input() aiTranslationModelId;
  @Input() aiTranslationServiceId;

  _aiTranslationModelExample = {
    source: null,
    target: null,
    serviceId: null,
    modelId: null,
  };

  aiTranslationModelExamples = [];
  isAiTranslationModelExamplesEmpty = true;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private aiTranslationModelExamplesService: AiTranslationModelExamplesServiceV1,
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

  save() {
    const EXAMPLES = this.aiTranslationModelExamples;

    EXAMPLES.forEach((example) => {
      example.serviceId = this.aiTranslationServiceId;
      example.modelId = this.aiTranslationModelId;
    });

    _debugX(AiTranslationModelExampleSaveModalV1.getClassName(), 'save', { EXAMPLES });
    this.eventsService.loadingEmit(true);
    this.aiTranslationModelExamplesService.saveMany(EXAMPLES)
      .pipe(
        catchError((error) => this.handleSaveManyError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(AiTranslationModelExampleSaveModalV1.getClassName(), 'save', { response });
        this.notificationService.showNotification(AI_TRANSLATION_MODEL_EXAMPLES_MESSAGES.SUCCESS.SAVE_MANY);
        this.eventsService.filterEmit(undefined);
        this.isOpen = false;
      });
  }

  show(aiTranslationModelExample: any = null) {
    let example;
    this.aiTranslationModelExamples = [];
    if (lodash.isEmpty(aiTranslationModelExample?.id)) {
      example = lodash.cloneDeep(this._aiTranslationModelExample);
    } else {
      example = lodash.cloneDeep(aiTranslationModelExample);
    }
    this.aiTranslationModelExamples.push(example);
    this.checkIfExamplesEmpty();
    this.isOpen = true;
  }

  handleSaveManyError(error: any) {
    _errorX(AiTranslationModelExampleSaveModalV1.getClassName(), 'handleSaveManyError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AI_TRANSLATION_MODEL_EXAMPLES_MESSAGES.ERROR.SAVE_MANY);
    return of();
  }

  add() {
    const EXAMPLE = lodash.cloneDeep(this._aiTranslationModelExample);
    this.aiTranslationModelExamples.push(EXAMPLE);
    this.checkIfExamplesEmpty();
  }

  delete(index: number) {
    this.aiTranslationModelExamples = this.aiTranslationModelExamples.filter((_, i) => {
      return i !== index;
    });
    this.checkIfExamplesEmpty();
  }

  checkIfExamplesEmpty() {
    if (this.aiTranslationModelExamples.length > 0) {
      this.isAiTranslationModelExamplesEmpty = false;
    } else {
      this.isAiTranslationModelExamplesEmpty = true;
    }
  }
}
