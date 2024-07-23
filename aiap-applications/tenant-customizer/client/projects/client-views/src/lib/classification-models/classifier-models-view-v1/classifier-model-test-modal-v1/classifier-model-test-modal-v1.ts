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
  BaseModal
} from 'client-shared-views';

import {
  CLASSIFIER_MESSAGES,
} from 'client-utils';

import {
  _debugX,
} from 'client-shared-utils';

import {
  ClassifierServiceV1,
} from 'client-services';

import { NotificationServiceV2 } from 'client-shared-services';

@Component({
  selector: 'aca-classifier-model-test-modal',
  templateUrl: './classifier-model-test-modal-v1.html',
  styleUrls: ['./classifier-model-test-modal-v1.scss']
})
export class ClassifierModelTestModal extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'ClassifierModelTestModal';
  }

  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;
  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  _state = {
    testing: false,
    phrase: '',
    response: undefined
  }
  _model: any = {
    id: undefined,
    name: undefined,
    serviceUrl: undefined,
    trainerUrl: undefined,
  }

  state: any = lodash.cloneDeep(this._state);
  model: any = lodash.cloneDeep(this._model);

  constructor(
    private notificationService: NotificationServiceV2,
    private classifierService: ClassifierServiceV1,
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
    const MODEL_ID = this.model?.id;
    const TEST_PHRASE = this.state?.phrase;
    _debugX(ClassifierModelTestModal.getClassName(), 'train',
      {
        MODEL_ID,
        TEST_PHRASE,
      });

    this.classifierService.testOneById(MODEL_ID, TEST_PHRASE)
      .pipe(
        tap(() => {
          this.state.testing = true;
        }),
        catchError(error => this.handleTestOneError(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugX(ClassifierModelTestModal.getClassName(), 'train',
          {
            response,
          });

        const STATE_NEW = lodash.cloneDeep(this.state);
        STATE_NEW.response = response;
        this.state = STATE_NEW;
        this.notificationService.showNotification(CLASSIFIER_MESSAGES.SUCCESS.TEST_ONE_BY_ID);
        this.state.testing = false;
      });
  }


  handleTestOneError(error: any) {
    _debugX(ClassifierModelTestModal.getClassName(), 'handleTestOneError',
      {
        error,
      });

    this.state.testing = false;
    this.notificationService.showNotification(CLASSIFIER_MESSAGES.ERROR.TEST_ONE_BY_ID);
    return of();
  }


  handleKeyCtrlDownEvent(event) {
    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();
      _debugX(ClassifierModelTestModal.getClassName(), 'handleKeyCtrlDownEvent', { this_state: this.state });
      this.test();
    }
  }

  show(model: any) {
    _debugX(ClassifierModelTestModal.getClassName(), 'show', { model });
    if (
      !lodash.isEmpty(model)
    ) {
      this.model = lodash.cloneDeep(model);
      this.state = lodash.cloneDeep(this._state);
      this.superShow();
    } else {
      this.notificationService.showNotification(CLASSIFIER_MESSAGES.ERROR.SHOW_CLASSIFIER_MODEL_TEST_MODAL);
    }
  }
}
