/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import * as ramda from 'ramda';
import { ChatWidgetServiceV1, EventsServiceV1, SessionServiceV2 } from 'client-services';
import { ModalService } from '../../services';

@Component({
  selector: 'aiap-content-modal',
  templateUrl: './content.modal.html',
  styleUrls: ['./content.modal.scss'],
})
export class ContentModal implements OnInit, OnDestroy {

  static getClassName() {
    return 'ContentModal';
  }

  chatAssetsUrl: string;
  modalId = 'aiap-content-modal';

  content: any;
  closeIcon: any;

  private eventsSubscription: Subscription;

  constructor(
    private eventsService: EventsServiceV1,
    private chatWidgetService: ChatWidgetServiceV1,
    private modalService: ModalService,
    private sessionService: SessionServiceV2,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.eventsSubscription = this.eventsService.eventsEmitter.subscribe(event => {
      if (event.hasOwnProperty('onContentShow')) {
        this.getCloseIcon();
        this.content = event.onContentShow;
        this.onOpenModal(this.modalId);
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  getCloseIcon() {
    const CHAT_ASSETS_URL = this.chatWidgetService.getChatAppHostUrl() + '/en-US/assets';
    const FILE_NAME = ramda.pathOr('close.svg',
      ['engagement', 'chatApp', 'assets', 'icons', 'chatWindow', 'contentModal', 'close', 'fileName'],
      this.sessionService.getSession());
    this.closeIcon = `${CHAT_ASSETS_URL}/${FILE_NAME}`;
  }

  onOpenModal(id) {
    this.modalService.open(id);
  }

  onCloseModal(id) {
    this.modalService.close(id);
  }
}
