/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import { of } from 'rxjs';

import * as lodash from 'lodash';

import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';

import {
  BaseModalV1
} from 'client-shared-views';

import {
  AI_TRANSLATION_MODELS_MESSAGES,
} from 'client-utils';

import {
  _debugX,
} from 'client-shared-utils';

import {
  AiTranslationModelsServiceV1,
} from 'client-services';

import { NotificationServiceV2 } from 'client-shared-services';

@Component({
  selector: 'aiap-translation-model-test-modal-v1',
  templateUrl: './ai-translation-model-test-modal-v1.html',
  styleUrls: ['./ai-translation-model-test-modal-v1.scss']
})
export class AiTranslationModelTestModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiTranslationModelTestModalV1';
  }

  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;
  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  _state = {
    testing: false,
    phrase: '',
    response: undefined
  }

  serviceId: string;
  modelId: string;

  state: any = lodash.cloneDeep(this._state);

  constructor(
    private notificationService: NotificationServiceV2,
    private aiTranslationModelsService: AiTranslationModelsServiceV1
  ) {
    super();
  }

  ngOnInit() {
    this.jsonEditorOptions.name = 'Response';
    this.jsonEditorOptions.statusBar = true;
    this.jsonEditorOptions.expandAll = true;
    this.jsonEditorOptions.modes = ['view'];
    this.jsonEditorOptions.mode = 'view';
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  test() {
    const TEST_PHRASE = this.state?.phrase;
    _debugX(AiTranslationModelTestModalV1.getClassName(), 'test', { modelId: this.modelId, TEST_PHRASE });
    this.aiTranslationModelsService.testOneByServiceModelId(this.serviceId, this.modelId, TEST_PHRASE)
      .pipe(
        tap(() => {
          this.state.testing = true;
        }),
        catchError(error => this.handleTestOneError(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugX(AiTranslationModelTestModalV1.getClassName(), 'test', { response });
        const STATE_NEW = lodash.cloneDeep(this.state);
        STATE_NEW.response = response;
        this.state = STATE_NEW;
        this.notificationService.showNotification(AI_TRANSLATION_MODELS_MESSAGES.SUCCESS.TEST_ONE_BY_SERVICE_MODEL_ID);
        this.state.testing = false;
      });
  }


  handleTestOneError(error: any) {
    _debugX(AiTranslationModelTestModalV1.getClassName(), 'handleTestOneError', { error });
    this.state.testing = false;
    this.notificationService.showNotification(AI_TRANSLATION_MODELS_MESSAGES.ERROR.TEST_ONE_BY_SERVICE_MODEL_ID);
    return of();
  }


  handleKeyCtrlDownEvent(event) {
    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();
      _debugX(AiTranslationModelTestModalV1.getClassName(), 'handleKeyCtrlDownEvent', { this_state: this.state });
      this.test();
    }
  }

  show(serviceId: string, modelId: string) {
    _debugX(AiTranslationModelTestModalV1.getClassName(), 'show', { serviceId, modelId });
    if (
      !lodash.isEmpty(serviceId) && !lodash.isEmpty(modelId)
    ) {
      this.state = lodash.cloneDeep(this._state);
      this.serviceId = serviceId;
      this.modelId = modelId;
      this.superShow();
    } else {
      this.notificationService.showNotification(AI_TRANSLATION_MODELS_MESSAGES.ERROR.SHOW_TEST_MODAL);
    }
  }
}
