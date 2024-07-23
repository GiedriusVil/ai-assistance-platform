/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
  EventsServiceV1,
} from "client-services";

//THIS COMPONENT CURRENTLY NOT USED ANYWHERE!
@Component({
  selector: 'aca-chat-prechat',
  templateUrl: './prechat.html',
  styleUrls: ['./prechat.scss']
})
export class PreChatComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modalContent') modalContent;

  private eventsSubscription: Subscription;
  preChatForm: UntypedFormGroup;

  constructor(
    private modal: NgbModal,
    private eventsService: EventsServiceV1,
  ) {

  }

  ngAfterViewInit() {
    //
  }

  ngOnInit() {
    this.eventsSubscription = this.eventsService.eventsEmitter.subscribe(event => {
      if (event.hasOwnProperty('onPreChatShow')) this.openModal(this.modalContent);
    });

    this.preChatForm = new UntypedFormGroup({
      name: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [Validators.required, Validators.email])
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  handleProfile(form: UntypedFormGroup) {
    setTimeout(() => {
      this.eventsService.eventEmit({ onClientConnect: true });
    }, 0);
  }

  openModal(content: any) {
    this.eventsService.eventEmit({ onInputFocus: false });
    this.modal.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      keyboard: false,
      backdropClass: 'custom--backdrop',
      size: 'lg',
      beforeDismiss: () => {
        if (this.preChatForm.valid) {
          setTimeout(() => {
            this.handleProfile(this.preChatForm);
          }, 0);
          return true;
        } else {
          return false;
        }
      }
    });
  }
}
