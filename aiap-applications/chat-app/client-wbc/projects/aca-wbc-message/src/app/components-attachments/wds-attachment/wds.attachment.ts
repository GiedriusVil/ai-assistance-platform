/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnInit } from '@angular/core';

import {
  ChatWidgetServiceV1,
  ModalServiceV1,
} from 'client-services';

@Component({
  selector: 'aca-chat-wds-attachment',
  templateUrl: './wds.attachment.html',
  styleUrls: ['./wds.attachment.scss']
})
export class WdsAttachment implements OnInit {

  modalId: string = 'aca-wds-content-modal';

  constructor(
    private chatWidgetService: ChatWidgetServiceV1,
    private modalService: ModalServiceV1,
  ) { }

  @Input() message: any;
  @Input() wbcAssetsUrl: string;

  wdsDoc: any = null;

  ngOnInit(): void { }

  openWdsModal(doc: any) {
    this.wdsDoc = doc;

    this.modalService.open(this.modalId);
  }

  closeWdsModal() {
    this.modalService.close(this.modalId);
  }
}
