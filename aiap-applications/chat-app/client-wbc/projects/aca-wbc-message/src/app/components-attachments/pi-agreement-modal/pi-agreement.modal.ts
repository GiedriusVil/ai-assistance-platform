/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import {
  ChatWidgetServiceV1,
  EventsServiceV1,
  ModalServiceV1,
} from 'client-services';
import { _errorX } from 'client-utils';

@Component({
  selector: 'aca-chat-pi-agreement-modal',
  templateUrl: './pi-agreement.modal.html',
  styleUrls: ['./pi-agreement.modal.scss']
})
export class PiAgreementModal implements OnInit {

  static getClassName() {
    return 'PiAgreementModal';
  }

  private eventsSubscription: Subscription;

  text: string = '';
  modalId: string = 'aca-pi-agreement-modal';

  @ViewChild('piAgreementContent') piAgreementContent: any;
  @Input() ready = false;

  modalOpened = false;
  modalRef: any;
  chatAssestsUrl: any;

  state = {
    error: '',
  }

  constructor(
    private modalService: ModalServiceV1,
    private eventsService: EventsServiceV1,
    private chatWidgetService: ChatWidgetServiceV1
  ) { }

  @Output() userActionEvent = new EventEmitter<any>();

  ngOnInit(): void {
    this.getAssetsUrl();
    this.eventsSubscription = this.eventsService.eventsEmitter.subscribe(event => {
      if (event.hasOwnProperty('onPiAgreementShow')) this.onOpenModal(this.modalId, event?.text);
    });
  }

  onOpenModal(id, text) {
    this.text = text;
    this.modalService.open(id);
  }

  onCloseModal(id) {
    this.modalService.close(id);
  }

  getAssetsUrl() {
    this.chatAssestsUrl = this.chatWidgetService.getChatAppHostUrl() + "/en-US/assets";
  }

  closeModal(submitted = false) {
    try {
      if (!submitted) {
        const TIME = new Date().getTime();
        let NEW_USER = JSON.parse(window.localStorage.getItem('user'));
        NEW_USER.piConfirmation = {
          confirmed: false,
          timestamp: TIME
        }
        window.localStorage.setItem('user', JSON.stringify(NEW_USER));
      }
      this.modalService.close(this.modalId);
    } catch (error) {
      _errorX(PiAgreementModal.getClassName(), `closeModal`, { error });
      this.state.error = 'Error occurred while closing modal';
    }
  }

  submit(event: any) {
    try {
      const TIME = new Date().getTime();
      const PI_CONFIRMATION = event.target.title == "confirmPiStorage" ? true : false;
      let NEW_USER = JSON.parse(window.localStorage.getItem('user'));

      NEW_USER.piConfirmation = {
        confirmed: PI_CONFIRMATION,
        timestamp: TIME
      }
      window.localStorage.setItem('user', JSON.stringify(NEW_USER));

      const RET_VAL = {
        type: 'POST_MESSAGE',
        data: {
          type: 'confirmation',
          confirmations: {
            piConfirmation: PI_CONFIRMATION
          },
          sender_action: {
            type: 'PI_CONFIRMATION',
            value: PI_CONFIRMATION,
          },
          timestamp: TIME
        }
      };

      this.userActionEvent.emit(RET_VAL);
      this.modalService.close(this.modalId);
    } catch (error) {
      _errorX(PiAgreementModal.getClassName(), `submit`, { error });
      this.state.error = 'Error occurred while submiting';
    }
  }
}
