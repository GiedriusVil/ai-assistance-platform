/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';

import {
  BaseModal,
} from 'client-shared-views';

import {
  _debugX,
} from 'client-shared-utils';

@Component({
  selector: 'aca-utterance-feedback-modal-v1',
  templateUrl: './utterance-feedback.modal-v1.html',
  styleUrls: ['./utterance-feedback.modal-v1.scss']
})
export class UtteranceFeedbackModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  feedback = {
    comment: '',
    reason: ''
  };

  constructor() {
    super();
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  ngAfterViewInit() {

  }

  show(utterance: any) {
    this.feedback.comment = utterance.comment;
    this.feedback.reason = utterance.reason;
    _debugX(UtteranceFeedbackModalV1.getClassName(), '[ACA] UtteranceFeedbackModal | show | utterance:', { utterance });
    this.superShow();
  }

  submit() {

  }

}
