/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { clearInput } from "client-utils";

import { TranslateService } from '@ngx-translate/core';

import {
  EventsServiceV1,
  GAcaPropsServiceV1,
  BotSocketIoServiceV1,
  DataServiceV1,
  StorageServiceV1,
} from "client-services";

@Component({
  selector: 'app-survey-modal',
  templateUrl: './survey.modal.html',
  styleUrls: ['./survey.modal.scss']
})
export class SurveyComponent implements OnInit, OnDestroy {
  constructor(
    private modal: NgbModal,
    private eventsService: EventsServiceV1,
    private dataService: DataServiceV1,
    private storageService: StorageServiceV1,
    private botSocketIoService: BotSocketIoServiceV1,
    private translateService: TranslateService,
    private gAcaPropsService: GAcaPropsServiceV1
  ) { }

  @ViewChild('surveyContent') surveyContent: any;

  private eventsSubscription: Subscription;
  surveyForm: UntypedFormGroup;
  modalOpened = false;
  modalRef: any;

  survey = {
    values: [
      {
        title: 'survey.modal-satisfaction-value-very-satisfied',
        value: 2,
      },
      {
        title: 'survey.modal-satisfaction-value-satisfied',
        value: 1,
      },
      {
        title: 'survey.modal-satisfaction-value-neutral',
        value: 0,
      },
      {
        title: 'survey.modal-satisfaction-value-dissatisfied',
        value: -1,
      },
      {
        title: 'survey.modal-satisfaction-value-very-dissatisfied',
        value: -2,
      }
    ],
    satisfactionScore: null,
    comment: ''
  };

  ngOnInit() {
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
    this.dataService.postSurvey(REQUEST).subscribe(
      () => {
        this.storageService.submitSurvey();
        this.eventsService.eventEmit({ onSurveyShow: false });
      },
      err => console.error(err)
    );
  }

  openModal(content: any) {
    if (this.modalOpened) return;
    this.eventsService.eventEmit({ onInputFocus: false });
    this.modalRef = this.modal.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      backdropClass: 'default--backdrop',
      size: 'md',
      keyboard: true
    });
    this.modalOpened = true;
  }

  closeModal() {
    this.modalOpened = false;
    this.modalRef.close();
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

      this.closeModal();
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
      if (onSurveyShow) this.openModal(this.surveyContent);
    });
  }

  private get conversationToken() {
    return this.botSocketIoService.conversationToken;
  }
}
