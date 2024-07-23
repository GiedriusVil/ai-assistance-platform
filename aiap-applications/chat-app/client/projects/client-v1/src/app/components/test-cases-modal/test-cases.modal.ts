/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {
  EventsServiceV1,
  GAcaPropsServiceV1,
  DataServiceV1,
  SessionServiceV1,
  StorageServiceV1,
} from "client-services";

import {
  _debugX,
  _warnX,
  _errorX,
} from "client-utils";

import * as ramda from 'ramda';

@Component({
  selector: 'app-test-cases-modal',
  templateUrl: './test-cases.modal.html',
  styleUrls: ['./test-cases.modal.scss'],
})
export class TestCasesComponent implements OnInit, OnDestroy {

  static getClassName() {
    return 'TestCasesComponent';
  }

  @ViewChild('modalContent') modalContent;

  private eventsSubscription: Subscription;
  private modalOpened = false;
  modalRef: any;
  testCasesForm: UntypedFormGroup;
  error = false;
  errorText = "Error! Check console for more information!";

  constructor(
    private modal: NgbModal,
    private eventsService: EventsServiceV1,
    private sessionService: SessionServiceV1,
    private storageService: StorageServiceV1,
    private gAcaPropsService: GAcaPropsServiceV1,
    private dataService: DataServiceV1,
  ) {

  }

  ngOnInit() {
    this.initForm();
    this.eventsSubscription = this.eventsService.eventsEmitter.subscribe(event => {
      if (event.hasOwnProperty('onTranscriptTransform')) this.openModal(this.modalContent);
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  onClick() {
    const G_ACA_PROPS = this.gAcaPropsService.getGAcaProps();
    const TRANSCRIPTS = this.storageService.getTranscript();
    const SESSION = this.sessionService.getSession();
    const USER_EMAIL = ramda.pathOr('default@ibm.com', ['user', 'email'], SESSION);
    const USERNAME = USER_EMAIL.substring(0, USER_EMAIL.indexOf('@')).split('.').join(' ');
    const TEST_CASE_NAME = this.testCasesForm.value.name;
    const TEST_CASE_KEY = this.testCasesForm.value.key;
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
      (response) => {
        this.modalOpened = false;
        this.modalRef.close();
      });
  }

  private initForm(): void {
    this.testCasesForm = new UntypedFormGroup({
      key: new UntypedFormControl('', [Validators.required]),
      name: new UntypedFormControl('', [Validators.required]),
      description: new UntypedFormControl('', [Validators.required]),
    });
  }

  handleTransformError(error: any) {
    const DEFAULT_ERROR_TEXT =
      _errorX(TestCasesComponent.getClassName(), 'on_error', { error: error });
    this.error = true;
    return of();
  }

  openModal(content: any) {
    this.error = false;
    if (this.modalOpened) return;
    this.eventsService.eventEmit({ onInputFocus: false });
    this.modalRef = this.modal.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      backdropClass: 'default--backdrop',
      size: 'md',
      beforeDismiss: () => {
        this.modalOpened = false;
        return true;
      }
    });
    this.modalOpened = true;
  }
}
