/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import {
  BaseModalV1 
} from 'client-shared-views';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  NotificationServiceV2,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  AiTestsServiceV1 ,
} from 'client-services';

@Component({
  selector: 'aiap-ai-skill-release-test-modal-v1',
  templateUrl: './ai-skill-release-test-modal-v1.html',
  styleUrls: ['./ai-skill-release-test-modal-v1.scss']
})
export class AiSkillReleaseTestModalV1  extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiSkillReleaseTestModalV1 ';
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
    external: {
      workspace_id: null
    },
    assistant: null
  };
  foldsNumberDescription = 'The choice of k is usually 5 or 10, but there is no formal rule. As k gets larger, the difference in size between the training set and the resampling subsets gets smaller.';

  constructor(
    private eventsService: EventsServiceV1,
    private aiTestsService: AiTestsServiceV1 ,
    private notificationService: NotificationServiceV2,
    private translateHelperService: TranslateHelperServiceV1,
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
    this.translateErrorMessagesAndFoldsNumberDescription();
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit() {
    //
  }

  show(aiSkill) {
    this.resetModal();
    this.translateErrorMessagesAndFoldsNumberDescription();
    this.test.id = aiSkill?.aiServiceId;
    this.test.assistant = aiSkill?.assistantId;
    this.test.aiSkillId = aiSkill?.id;
    this.test.external.workspace_id = aiSkill?.external?.workspace_id;
    super.superShow();
  }

  save() {
    this.test.name = this.testName?.value;
    this.test.kfoldNumber = this.kfoldNumber?.value;
    this.test.threshold = this.threshold?.value;
    this.test.testType = this.testType?.value?.content;
    _debugX(AiSkillReleaseTestModalV1 .getClassName(), 'save', { this_test: this.test });
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
      title: this.translateHelperService.instant('ai_service_v1.release_test_modal_v1.notification_success.title'),
      target: '.notification-container',
      duration: 5000
    };
    this.notificationService.showNotification(NOTIFICATION);
    this.close();
  }

  handeTestError(error: any) {
    const NOTIFICATION = {
      type: 'error',
      title: this.translateHelperService.instant('ai_service_v1.release_test_modal_v1.notification_error.title'),
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

  translateErrorMessagesAndFoldsNumberDescription() {
    this.ERROR_MESSAGES.NAME = this.translateHelperService.instant('ai_service_v1.release_test_modal_v1.error_messages.name');
    this.ERROR_MESSAGES.KFOLD_NUMBER = this.translateHelperService.instant('ai_service_v1.release_test_modal_v1.error_messages.kfold_number');
    this.ERROR_MESSAGES.THRESHOLD = this.translateHelperService.instant('ai_service_v1.release_test_modal_v1.error_messages.threshold');
    this.foldsNumberDescription = this.translateHelperService.instant('ai_service_v1.release_test_modal_v1.foldsNumberDescription');
  }
}
