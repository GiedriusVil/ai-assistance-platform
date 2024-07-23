/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
} from '@angular/core';

import { catchError, takeUntil, tap } from 'rxjs/operators';

import { of } from 'rxjs';

import {
  BaseModalV1
} from 'client-shared-views';

import {
  AI_TRANSLATION_MODEL_EXAMPLES_MESSAGES,
} from 'client-utils';

import {
  _debugX,
} from 'client-shared-utils';

import {
  AiTranslationModelsServiceV1,
} from 'client-services';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

@Component({
  selector: 'aiap-translation-model-train-modal-v1',
  templateUrl: './ai-translation-model-train-modal-v1.html',
  styleUrls: ['./ai-translation-model-train-modal-v1.scss']
})
export class AiTranslationModelTrainModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiTranslationModelTrainModalV1';
  }

  aiTranslationServiceId: string;
  aiTranslationModelId: string;

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private aiTranslationModelsService: AiTranslationModelsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  train() {
    _debugX(AiTranslationModelTrainModalV1.getClassName(), 'train', {
      aiTranslationServiceId: this.aiTranslationServiceId,
      aiTranslationModelId: this.aiTranslationModelId,
    });
    this.aiTranslationModelsService.trainOneById(this.aiTranslationServiceId, this.aiTranslationModelId)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleTrainOneByIdError(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugX(AiTranslationModelTrainModalV1.getClassName(), 'train', { response });
        this.notificationService.showNotification(AI_TRANSLATION_MODEL_EXAMPLES_MESSAGES.INFO.TRAIN_ONE_BY_ID);
        this.eventsService.filterEmit(undefined);
        this.close();
      });
  }


  handleTrainOneByIdError(error: any) {
    _debugX(AiTranslationModelTrainModalV1.getClassName(), 'handleTrainOneByIdError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AI_TRANSLATION_MODEL_EXAMPLES_MESSAGES.ERROR.TRAIN_ONE_BY_ID);
    return of();
  }

  show(aiTranslationServiceId: string, aiTranslationModelId: string) {
    _debugX(AiTranslationModelTrainModalV1.getClassName(), 'show', { aiTranslationServiceId, aiTranslationModelId });
    this.aiTranslationServiceId = aiTranslationServiceId;
    this.aiTranslationModelId = aiTranslationModelId;

    this.isOpen = true;
  }
}
