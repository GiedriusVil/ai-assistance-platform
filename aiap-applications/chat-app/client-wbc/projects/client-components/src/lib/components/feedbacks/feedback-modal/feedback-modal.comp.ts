/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';

import * as lodash from 'lodash';

import { _debugX } from 'client-utils';
import { ChatWidgetServiceV1, EventsServiceV1, ModalServiceV1, SessionServiceV1 } from 'client-services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'aca-wbc-feedback-modal',
  templateUrl: './feedback-modal.comp.html',
  styleUrls: ['./feedback-modal.comp.scss'],
})
export class FeedbackModal implements OnInit, OnDestroy {

  static getClassName() {
    return 'FeedbackModal';
  }

  @Input() assetsUrl;
  @Input() suffix;

  feedback: any;
  modalId: string = 'aca-wbc-multi-response-feedback-modal';

  state = {
    component: null,
    host: null,
    path: null,
    configs: {
      host: null,
      path: null
    }
  };

  params: any;

  private eventsSubscription: Subscription;

  constructor(
    private fb: UntypedFormBuilder,
    private modalService: ModalServiceV1,
    private eventsService: EventsServiceV1,
    private chatWidgetService: ChatWidgetServiceV1,
    private sessionService: SessionServiceV1,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    if (lodash.isEmpty(this.sessionService.getSession())) {
      return;
    }

    this.modalId += this.suffix || '';
    this.initSubs();

    const FEEDBACK_MODAL = this.sessionService.getSession()?.engagement?.chatApp?.feedbackModal;

    const PARAMS = FEEDBACK_MODAL.params;

    const LANG_PARAMS = FEEDBACK_MODAL[`params-${this.translateService.currentLang}`];

    lodash.merge(PARAMS, LANG_PARAMS);
    this.params = FEEDBACK_MODAL.params;

    const WBC = FEEDBACK_MODAL.wbc;
    this.state.component = WBC.component;
    this.state.configs.host = WBC.host;
    this.state.configs.path = WBC.path;
  }

  ngOnDestroy() {
    if (lodash.isEmpty(this.eventsSubscription)) {
      return;
    }
    this.eventsSubscription.unsubscribe();
  }

  onFeedbackScoreChange: (data: any) => void;

  openModal(id: string, onFeedbackScoreChange: (score: any) => void, feedback: any) {
    this.onFeedbackScoreChange = onFeedbackScoreChange;
    this.feedback = feedback;
    this.modalService.open(id);
  }

  onCloseModal(id) {
    this.modalService.close(id);
  }

  private initSubs(): void {
    this.eventsSubscription = this.eventsService.eventsEmitter.subscribe(({ onFeedbackShow, onFeedbackScoreChange, feedback }) => {
      if (onFeedbackShow) this.openModal(this.modalId, onFeedbackScoreChange, feedback);
    });
  }

  handleUserActionEvent(event) {
    _debugX(FeedbackModal.getClassName(), `handleUserActionEvent`, { event })

    const DETAIL = event?.detail;
    const DATA = DETAIL?.data;
    switch (DETAIL?.type) {
      case 'MODAL': {
        if (DATA.close) {
          this.onCloseModal(this.modalId);
        }
        break;
      };
      case 'FEEDBACK': {
        this.onFeedbackScoreChange({ feedback: { ...this.feedback, ...DATA.feedback } });
        this.onCloseModal(this.modalId)
        break;
      };
    }
  }
}
