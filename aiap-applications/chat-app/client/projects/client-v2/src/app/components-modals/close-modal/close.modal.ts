/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import {
  ModalService,
} from '../../services';

import {
  ChatWidgetServiceV1,
  EventsServiceV1,
  ClientServiceV2,
  StorageServiceV2,
} from "client-services";

@Component({
  selector: 'aca-chat-close-modal',
  templateUrl: './close.modal.html',
  styleUrls: ['./close.modal.scss'],
})
export class CloseModal implements OnInit, OnDestroy {

  static getClassName() {
    return 'CloseModal';
  }

  private eventsSubscription: Subscription;
  open = true;
  chatAssestsUrl: any;
  modalId: string = 'aca-close-modal';

  constructor(
    private eventsService: EventsServiceV1,
    private clientService: ClientServiceV2,
    private storageService: StorageServiceV2,
    private modalService: ModalService,
    private chatWidgetService: ChatWidgetServiceV1,
    private changeDetectorRef: ChangeDetectorRef,
  ) {

  }

  ngOnInit() {
    this.getAssetsUrl();
    this.eventsSubscription = this.eventsService.eventsEmitter.subscribe(event => {
      if (event.hasOwnProperty('onWidgetClose')) this.onOpenModal(this.modalId);
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  getAssetsUrl() {
    this.chatAssestsUrl = this.chatWidgetService.getChatAppHostUrl() + "/en-US/assets";
  }

  onCloseChat(event: Event) {
    event.preventDefault();
    this.clientService.disconnectFromWidget();
  }

  onRestartChat(event: Event) {
    event.preventDefault();
    this.clientService.disconnectFromWidget();
    this.onCloseModal(this.modalId);
    this.chatWidgetService.broadcast(ChatWidgetServiceV1.EVENT.CHAT_WINDOW_CLOSE, true);
    this.chatWidgetService.broadcast(ChatWidgetServiceV1.EVENT.CHAT_WINDOW_OPEN, true);
  }

  onOpenModal(id) {
    this.modalService.open(id);
  }

  onCloseModal(id) {
    this.modalService.close(id);
  }

}
