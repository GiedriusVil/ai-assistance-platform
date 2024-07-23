/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
  EventsServiceV1,
  ClientServiceV1,
  StorageServiceV1,
} from "client-services";

@Component({
  selector: 'app-close-modal',
  templateUrl: './close.modal.html',
  styleUrls: ['./close.modal.scss'],
})
export class CloseComponent implements OnInit, OnDestroy {

  @ViewChild('modalContent') modalContent;

  private eventsSubscription: Subscription;
  private modalOpened = false;

  constructor(
    private modal: NgbModal,
    private eventsService: EventsServiceV1,
    private clientService: ClientServiceV1,
    private storageService: StorageServiceV1
  ) {

  }

  ngOnInit() {
    this.eventsSubscription = this.eventsService.eventsEmitter.subscribe(event => {
      if (event.hasOwnProperty('onWidgetClose')) this.openModal(this.modalContent);
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  onClick(event: Event) {
    event.preventDefault();
    this.clientService.disconnectFromWidget();
  }

  restart() {
    this.storageService.clearAll();
  }

  openModal(content: any) {
    if (this.modalOpened) return;
    this.eventsService.eventEmit({ onInputFocus: false });
    this.modal.open(content, {
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
