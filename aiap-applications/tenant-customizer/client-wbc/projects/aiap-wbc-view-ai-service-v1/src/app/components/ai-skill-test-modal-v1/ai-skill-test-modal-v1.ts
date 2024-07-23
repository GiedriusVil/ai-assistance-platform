/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { of } from 'rxjs';

import * as ramda from 'ramda';

import {
  BaseModalV1
} from 'client-shared-views';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  AiTestsServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-ai-skill-test-modal-v1',
  templateUrl: './ai-skill-test-modal-v1.html',
  styleUrls: ['./ai-skill-test-modal-v1.scss']
})
export class AiSkillTestModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiSkillTestModalV1';
  }

  testModal: FormGroup;

  skills: Array<any> = [];
  testTypes = [
    {
      content: 'K-Fold'
    }
  ];
  ERROR_MESSAGES = {
    NAME: 'Test name field can not be empty',
    KFOLD_NUMBER: 'Kfold number must be in range 2 to 10',
    THRESHOLD: 'Threshold must be greater or equal to 0.4 and less than 1'
  }
  test: any = {
    name: null,
    id: null,
    kfoldNumber: null,
    threshold: null,
    testType: null,
    aiSkillId: null,
    assistant: null
  };
  foldsNumberDescription = 'The choice of k is usually 5 or 10, but there is no formal rule. As k gets larger, the difference in size between the training set and the resampling subsets gets smaller.';

  constructor(
    private eventsService: EventsServiceV1,
    private aiTestsService: AiTestsServiceV1,
    private notificationService: NotificationServiceV2,
  ) {
    super();
  }

  ngOnInit() {
    this.testModal = new FormGroup({
      'testName': new FormControl(null, Validators.required),
      'kfoldNumber': new FormControl(null, [Validators.required, Validators.min(2), Validators.max(10)]),
      'testType': new FormControl(null, Validators.required),
      'threshold': new FormControl(null, [Validators.required, Validators.min(0.4), Validators.max(0.9)]),
    });
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit() {
    //
  }

  show(aiSkill, aiService) {
    this.resetModal();
    this.test.id = ramda.path(['id'], aiService);
    this.test.assistant = ramda.path(['assistantId'], aiService);
    this.test.aiSkillId = ramda.path(['id'], aiSkill);
    super.superShow();
  }

  save() {
    this.test.name = ramda.path(['value'], this.testName);
    this.test.kfoldNumber = ramda.path(['value'], this.kfoldNumber);
    this.test.threshold = ramda.path(['value'], this.threshold);
    _debugX(AiSkillTestModalV1.getClassName(), 'save', { this_test: this.test });
    this.aiTestsService.saveOne(this.test)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handeTestError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response) => {
        this.eventsService.loadingEmit(false);
      });
    const NOTIFICATION = {
      type: 'success',
      title: 'Ai Test is running!',
      target: '.notification-container',
      duration: 5000
    };
    this.notificationService.showNotification(NOTIFICATION);
    this.close();
  }

  handeTestError(error: any) {
    const NOTIFICATION = {
      type: 'error',
      title: 'Unable to run test!',
      target: '.notification-container',
      duration: 10000
    };
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  close() {
    super.close();
    this.eventsService.filterEmit(null);
  }

  resetModal() {
    this.testModal.reset();
  }

  get testName() {
    return this.testModal.get('testName');
  }

  get kfoldNumber() {
    return this.testModal.get('kfoldNumber');
  }

  get threshold() {
    return this.testModal.get('threshold');
  }

  get testType() {
    return this.testModal.get('testType');
  }

}
