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
  _errorX,
} from 'client-shared-utils';

import {
  AiTranslationModelsServiceV1,
} from 'client-services';

import { NotificationServiceV2 } from 'client-shared-services';

@Component({
  selector: 'aiap-translation-service-identify-language-modal-v1',
  templateUrl: './ai-translation-service-identify-language-modal-v1.html',
  styleUrls: ['./ai-translation-service-identify-language-modal-v1.scss']
})
export class AiTranslationServiceIdentifyLanguageModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiTranslationServiceIdentifyLanguageModalV1';
  }

  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;
  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  _state = {
    testing: false,
    phrase: '',
    response: undefined
  }

  serviceId: string;

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
    _debugX(AiTranslationServiceIdentifyLanguageModalV1.getClassName(), 'identifyLanguage', { serviceId: this.serviceId, TEST_PHRASE });
    this.aiTranslationModelsService.idenfityLanguageById(this.serviceId, TEST_PHRASE)
      .pipe(
        tap(() => {
          this.state.testing = true;
        }),
        catchError(error => this.handleTestOneError(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugX(AiTranslationServiceIdentifyLanguageModalV1.getClassName(), 'identifyLanguage', { response });
        const STATE_NEW = lodash.cloneDeep(this.state);
        STATE_NEW.response = response;
        this.state = STATE_NEW;
        this.notificationService.showNotification(AI_TRANSLATION_MODELS_MESSAGES.SUCCESS.IDENTIFY_LANGUAGE_BY_SERVICE_MODEL_ID);
        this.state.testing = false;
      });
  }


  handleTestOneError(error: any) {
    _debugX(AiTranslationServiceIdentifyLanguageModalV1.getClassName(), 'handleTestOneError', { error });
    this.state.testing = false;
    this.notificationService.showNotification(AI_TRANSLATION_MODELS_MESSAGES.ERROR.IDENTIFY_LANGUAGE_BY_SERVICE_MODEL_ID);
    return of();
  }


  handleKeyCtrlDownEvent(event) {
    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();
      _debugX(AiTranslationServiceIdentifyLanguageModalV1.getClassName(), 'handleKeyCtrlDownEvent', { this_state: this.state });
      this.test();
    }
  }

  show(serviceId: string) {
    _debugX(AiTranslationServiceIdentifyLanguageModalV1.getClassName(), 'show', { serviceId });
    if (
      !lodash.isEmpty(serviceId)
    ) {
      this.state = lodash.cloneDeep(this._state);
      this.serviceId = serviceId;
      this.superShow();
    } else {
      this.notificationService.showNotification(AI_TRANSLATION_MODELS_MESSAGES.ERROR.SHOW_IDENTIFY_LANGUAGE_MODAL);
    }
  }
}
