/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { catchError, of, takeUntil } from 'rxjs';

import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import { JsonEditorOptions } from 'ang-jsoneditor';

import {
  BaseModal
} from 'client-shared-views';

import {
  AiServicesChangeRequestServiceV1,
  EventsServiceV1,
  NotificationServiceV2,
  SessionServiceV1
} from 'client-shared-services';

import {
  CHANGE_REQUEST_MESSAGES
} from 'client-utils';

@Component({
  selector: 'ai-services-change-request-modal-v1',
  templateUrl: './ai-services-change-request-modal-v1.html',
  styleUrls: ['./ai-services-change-request-modal-v1.scss']
})
export class AiServiceChangeRequestModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiServiceChangeRequestModalV1';
  }

  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();
  intentName: string;
  utteranceId: string;
  response: any;
  _state: any = {
    intents: [],
    intentSelected: {}
  }; 
  _aiService = {
    id: undefined,
    name: undefined,
    aiSkill: {
      id: undefined,
      name: undefined
    },
  };
  aiService = lodash.cloneDeep(this._aiService);
  state = lodash.cloneDeep(this._state);

  constructor(
    private aiServicesChangeRequestServiceV1: AiServicesChangeRequestServiceV1,
    private eventsServiceV1: EventsServiceV1,
    private notificationsServiceV2: NotificationServiceV2,
    private sessionServiceV1: SessionServiceV1
  ) {
    super();
  }

  ngOnInit() { }

  ngAfterViewInit(): void { }

  ngOnDestroy() { }

  trackBy(index, item) {
    return item.intentName;
  }

  deletExistingExample(value, intentIndex) {
    const TEMP = lodash.cloneDeep(this.state.intents?.[intentIndex]);
    const ARRAY_WITH_REMOVED_VALUE = TEMP?.existingExamples?.filter(existinExample => existinExample.text !== value.text);
    TEMP.existingExamples = ARRAY_WITH_REMOVED_VALUE;
    TEMP.deletedExamples.push(value);
    this.state.intents[intentIndex] = lodash.cloneDeep(TEMP);
  }

  deleteNewExample(value, intentIndex) {
    const TEMP = lodash.cloneDeep(this.state.intents?.[intentIndex]);
    const ARRAY_WITH_REMOVED_VALUE = TEMP?.newExamples?.filter(existinExample => existinExample.text !== value.text);
    TEMP.newExamples = ARRAY_WITH_REMOVED_VALUE;
    this.state.intents[intentIndex] = lodash.cloneDeep(TEMP);
  }

  cancelDeletedExample(value, intentIndex) {
    const TEMP = lodash.cloneDeep(this.state.intents?.[intentIndex]);
    const ARRAY_WITH_REMOVED_VALUE = TEMP?.deletedExamples?.filter(existinExample => existinExample.text !== value.text);
    TEMP.deletedExamples = ARRAY_WITH_REMOVED_VALUE;
    delete value.newText;
    TEMP.existingExamples.push(value);
    this.state.intents[intentIndex] = lodash.cloneDeep(TEMP);
  }

  changeExample(exampleIndex, intentIndex) {
    const TEMP = lodash.cloneDeep(this.state.intents?.[intentIndex]);
    TEMP.existingExamples[exampleIndex].newText = '';
    this.state.intents[intentIndex] = lodash.cloneDeep(TEMP);
  }

  cancelChangeExample(changeExampleIndex, intentIndex) {
    const TEMP = lodash.cloneDeep(this.state.intents?.[intentIndex]);
    delete TEMP.existingExamples[changeExampleIndex].newText;
    this.state.intents[intentIndex] = lodash.cloneDeep(TEMP);
  }


  isChangeExampleExists(existingExampleindex, intentIndex) {
    let retVal = false;
    const CHANGE_EXAMPLE_TEXT = this.state.intents?.[intentIndex]?.existingExamples?.[existingExampleindex]?.newText;
    if (
      lodash.isString(CHANGE_EXAMPLE_TEXT)
    ) {
      retVal = true;
    }
    return retVal;
  }

  addNewExample(intentIndex) {
    const TEMP = lodash.cloneDeep(this.state.intents?.[intentIndex]);
    const EXAMPLE = {
      text: ''
    };
    TEMP.newExamples.push(EXAMPLE);
    this.state.intents[intentIndex] = lodash.cloneDeep(TEMP);
  }

  isExpanded(intent) {
    let retVal = false;
    if (intent?.intentName === this.intentName) {
      retVal = true;
    }
    return retVal;
  }

  save() {
    const SAVE_PARAMS = {
      id: this.response?.id,
      utteranceId: this.utteranceId,
      aiService: this.aiService,
      intents: this.state?.intents
    }
    _debugX(AiServiceChangeRequestModalV1.getClassName(), 'save', { SAVE_PARAMS });
    this.eventsServiceV1.loadingEmit(true);
    this.aiServicesChangeRequestServiceV1.saveOne(SAVE_PARAMS)
      .pipe(
        catchError((error) => this.handleSaveOneError(error)),
        takeUntil(this._destroyed$),
      ).subscribe(() => {
        this.notificationsServiceV2.showNotification(CHANGE_REQUEST_MESSAGES.SUCCESS.SAVE_ONE);
        this.eventsServiceV1.loadingEmit(false);
        this.close();
      });
  }

  private handleSaveOneError(error: any) {
    _debugX(AiServiceChangeRequestModalV1.getClassName(), 'handleSaveOneError', { error });
    this.notificationsServiceV2.showNotification(CHANGE_REQUEST_MESSAGES.ERROR.SAVE_ONE);
    this.eventsServiceV1.loadingEmit(false);
    return of();
  }

  async loadFormData(params) {
    const LOAD_FORM_DATA_PARAMS = {
      aiService: params?.aiService,
      intentName: params?.intentName
    }
    _debugX(AiServiceChangeRequestModalV1.getClassName(), 'retrieveExamples', { LOAD_FORM_DATA_PARAMS });
    this.eventsServiceV1.loadingEmit(true);
    this.aiServicesChangeRequestServiceV1.loadFormData(LOAD_FORM_DATA_PARAMS)
      .pipe(
        catchError((error) => this.handleRetrieveExamplesError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        this.response = response;
        this.aiService = response?.aiService;
        this.state.intents = response?.intents;
        this.eventsServiceV1.loadingEmit(false);
        this.superShow();
      });
  }

  arrayHasElements(array) {
    let retVal = false;
    if (
      lodash.isArray(array) &&
      !lodash.isEmpty(array)
    ) {
      retVal = true;
    }
    return retVal;
  }

  private handleRetrieveExamplesError(error: any) {
    _debugX(AiServiceChangeRequestModalV1.getClassName(), 'handleRetrieveExamplesError', { error });
    this.eventsServiceV1.loadingEmit(false);
    return of();
  }

  show(aiServiceChangeRequest: any) {
    this.intentName = aiServiceChangeRequest?.intentName;
    this.utteranceId = aiServiceChangeRequest?.utteranceId;
    this.loadFormData(aiServiceChangeRequest);
  }
}
