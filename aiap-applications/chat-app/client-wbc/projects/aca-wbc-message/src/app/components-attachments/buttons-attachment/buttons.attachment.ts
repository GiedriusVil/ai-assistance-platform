/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SENDER_ACTIONS } from 'client-utils';

@Component({
  selector: 'aca-chat-buttons-attachment',
  templateUrl: './buttons.attachment.html',
  styleUrls: ['./buttons.attachment.scss']
})
export class ButtonsAttachment implements OnInit {

  @Input() message;
  @Input() isContentEnabled: boolean;

  @Output() userActionEvent = new EventEmitter<{
    type: string,
    data: {
      type: string;
      text: string;
      timestamp: number
    }
  }>();

  constructor() { }

  ngOnInit(): void { }

  onButtonClick(event: Event, message: any): void {
    event.preventDefault();
    const RET_VAL = {
      type: 'POST_MESSAGE',
      data: {
        type: 'user',
        text: message.payload ? message.payload : message.title,
        payload: message.title ? message.title : message.payload,
        timestamp: new Date().getTime(),
        sender_action: {
          type: SENDER_ACTIONS.ITEM_SELECTED,
          data: message?.metadata,
        },
      }
    };

    this.userActionEvent.emit(RET_VAL);
  }

}
