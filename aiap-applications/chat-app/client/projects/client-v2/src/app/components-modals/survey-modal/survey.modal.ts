/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import {
  ModalService,
} from '../../services';

import {
  ChatWidgetServiceV1,
  EventsServiceV1,
  GAcaPropsServiceV1,
  BotSocketIoServiceV2,
  DataServiceV2,
  StorageServiceV2,
} from "client-services";

import { _debugX, clearInput } from "client-utils";

@Component({
  selector: 'aca-chat-survey-modal',
  templateUrl: './survey.modal.html',
  styleUrls: ['./survey.modal.scss'],
})
export class SurveyModal implements OnInit, OnDestroy {

  static getClassName() {
    return 'SurveyModal';
  }

  constructor(
    private eventsService: EventsServiceV1,
    private dataService: DataServiceV2,
    private storageService: StorageServiceV2,
    private botSocketIoService: BotSocketIoServiceV2,
    private translateService: TranslateService,
    private gAcaPropsService: GAcaPropsServiceV1,
    private modalService: ModalService,
    private chatWidgetService: ChatWidgetServiceV1
  ) { }

  private eventsSubscription: Subscription;
  surveyForm: UntypedFormGroup;

  modalId: string = 'aca-survey-modal';
  chatAssestsUrl: string;

  survey = {
    values: [
      {
        title: 'survey.modal-satisfaction-value-very-dissatisfied',
        value: -2,
      },
      {
        title: 'survey.modal-satisfaction-value-dissatisfied',
        value: -1,
      },
      {
        title: 'survey.modal-satisfaction-value-neutral',
        value: 0,
      },
      {
        title: 'survey.modal-satisfaction-value-satisfied',
        value: 1,
      },
      {
        title: 'survey.modal-satisfaction-value-very-satisfied',
        value: 2
      }
    ],
    satisfactionScore: null,
    comment: ''
  };

  ngOnInit() {
    this.getAssetsUrl();
    this.initForm();
    this.initSubs();
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  submitSurvey(form: UntypedFormGroup) {
    const G_ACA_PROPS: any = this.gAcaPropsService.getGAcaProps();
    const TOKEN = this.botSocketIoService.conversationToken;
    const SURVEY = {
      conversationToken: this.conversationToken,
      score: form.value.score,
      comment: form.value.comment.trim(),
      assistantId: G_ACA_PROPS.assistantId,
      tenant: G_ACA_PROPS.tenant
    };
    const REQUEST = {
      token: TOKEN,
      gAcaProps: G_ACA_PROPS,
      survey: SURVEY
    };
    _debugX(SurveyModal.getClassName(), 'submitSurvey', { form, REQUEST });
    this.dataService.postSurvey(REQUEST).subscribe(
      () => {
        this.storageService.submitSurvey();
        this.eventsService.eventEmit({ onSurveyShow: false });
      },
      err => console.error(err)
    );
  }

  openModal(id: string) {
    this.initForm();
    this.modalService.open(id);
  }

  onCloseModal(id: string) {
    this.modalService.close(id);
  }

  submit() {
    if (this.surveyForm.valid) {
      this.submitSurvey(this.surveyForm);
      const TEXT = this.translateService.instant('survey.modal-satisfaction-notification');
      this.eventsService.messageEmit({
        type: 'notification',
        text: TEXT,
        timestamp: new Date().getTime()
      });

      this.onCloseModal(this.modalId);
    }
  }

  onInput(): void {
    clearInput(this.surveyForm.get('comment'));
  }

  private initForm(): void {
    this.surveyForm = new UntypedFormGroup({
      score: new UntypedFormControl('', [Validators.required]),
      comment: new UntypedFormControl('')
    });
  }

  private initSubs(): void {
    this.eventsSubscription = this.eventsService.eventsEmitter.subscribe(({ onSurveyShow }) => {
      if (onSurveyShow) this.openModal(this.modalId);
    });
  }

  getAssetsUrl() {
    this.chatAssestsUrl = this.chatWidgetService.getChatAppHostUrl() + "/en-US/assets";
  }

  private get conversationToken() {
    return this.botSocketIoService.conversationToken;
  }
}
