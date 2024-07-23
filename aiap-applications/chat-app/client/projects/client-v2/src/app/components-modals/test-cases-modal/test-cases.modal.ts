/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as ramda from 'ramda';

import {
  ModalService,
} from '../../services';

import {
  ChatWidgetServiceV1,
  EventsServiceV1,
  GAcaPropsServiceV1,
  DataServiceV2,
  SessionServiceV2,
  StorageServiceV2,
} from "client-services";

import {
  _debugX,
  _warnX,
  _errorX,
} from "client-utils";

@Component({
  selector: 'app-test-cases-modal',
  templateUrl: './test-cases.modal.html',
  styleUrls: ['./test-cases.modal.scss'],
})
export class TestCasesModal implements OnInit, OnDestroy {

  static getClassName() {
    return 'TestCasesModal';
  }

  private eventsSubscription: Subscription;
  testCasesForm: UntypedFormGroup;

  modalId: string = 'aca-test-cases-modal';
  chatAssetsUrl: string;

  error = false;
  errorText = "Error! Check console for more information!"

  constructor(
    private eventsService: EventsServiceV1,
    private sessionService: SessionServiceV2,
    private storageService: StorageServiceV2,
    private gAcaPropsService: GAcaPropsServiceV1,
    private dataService: DataServiceV2,
    private modalService: ModalService,
    private chatWidgetService: ChatWidgetServiceV1
  ) { }

  ngOnInit() {
    this.getAssetsUrl();
    this.initForm();
    this.initSubs();
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  onSave() {
    const G_ACA_PROPS = this.gAcaPropsService.getGAcaProps();
    const TRANSCRIPTS = this.storageService.getTranscript();
    const SESSION = this.sessionService.getSession();
    const USER_EMAIL = ramda.pathOr('default@ibm.com', ['user', 'email'], SESSION);
    const USERNAME = USER_EMAIL.substring(0, USER_EMAIL.indexOf('@')).split('.').join(' ');
    const TEST_CASE_KEY = this.testCasesForm.value.key;
    const TEST_CASE_NAME = this.testCasesForm.value.name;
    const TEST_CASE_DESCRIPTION = this.testCasesForm.value.description;
    const PARAMS = {
      transcripts: TRANSCRIPTS,
      gAcaProps: G_ACA_PROPS,
      username: USERNAME,
      testCase: {
        key: TEST_CASE_KEY,
        name: TEST_CASE_NAME,
        description: TEST_CASE_DESCRIPTION
      }
    };
    this.dataService.transformTranscript(PARAMS).pipe(
      catchError(error => this.handleTransformError(error)),
    ).subscribe(
      () => {
        this.eventsService.eventEmit({ onTestCasesShow: false });
        this.onCloseModal(this.modalId);
      });
  }

  handleTransformError(error: any) {
    _errorX(TestCasesModal.getClassName(), 'on_error', { error: error });
    this.error = true;
    return of();
  }

  openModal(id: string) {
    this.initForm();
    this.modalService.open(id);
  }

  onCloseModal(id: string) {
    this.modalService.close(id);
  }

  private initForm(): void {
    this.testCasesForm = new UntypedFormGroup({
      key: new UntypedFormControl('', [Validators.required]),
      name: new UntypedFormControl('', [Validators.required]),
      description: new UntypedFormControl('', [Validators.required]),
    });
  }

  private initSubs(): void {
    this.eventsSubscription = this.eventsService.eventsEmitter.subscribe(({ onTestCasesShow }) => {
      if (onTestCasesShow) this.openModal(this.modalId);
    });
  }

  getAssetsUrl() {
    this.chatAssetsUrl = this.chatWidgetService.getChatAppHostUrl() + "/en-US/assets";
  }
}
