/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfigsServiceV1 } from 'client-services';
import { SENDER_ACTIONS } from 'client-utils';

@Component({
  selector: 'aca-chat-dropdown-attachment',
  templateUrl: './dropdown.attachment.html',
  styleUrls: ['./dropdown.attachment.scss']
})
export class DropdownAttachment implements OnInit {

  @Input() message;
  @Input() isContentEnabled: boolean;
  @Input() isLastMessage: boolean;

  @Output() userActionEvent = new EventEmitter<any>();

  @ViewChild('dropdownMenu') dropdownMenu;
  @ViewChild('dropdown') dropdown;

  isTranscript = false;

  constructor(
    private configsService: ConfigsServiceV1
  ) { }

  ngOnInit(): void {
    this.isTranscript = this.configsService.isTranscript();
  }

  onButtonClick(message: any): void {
    this.onMenuClose();

    const EVENT = {
      type: 'POST_MESSAGE',
      data: {
        type: 'user',
        text: message?.payload.toString(),
        payload: message?.payload.toString() ? message?.payload.toString() : message?.title.toString(),
        timestamp: new Date().getTime(),
        sender_action: {
          type: SENDER_ACTIONS.ITEM_SELECTED,
          data: message?.metadata,
        },
      }
    };

    this.userActionEvent.emit(EVENT);
  }

  onMenuOpen() {
    const DROPDOWN_MENU_HEIGHT = this.dropdownMenu.nativeElement.offsetHeight;
    this.dropdown._elementRef.nativeElement.style.marginBottom = DROPDOWN_MENU_HEIGHT + 'px';
  }

  onMenuClose() {
    this.dropdown._elementRef.nativeElement.style.marginBottom = 'auto';
  }

  onOpenChange(opened: boolean) {
    setTimeout(() => {
      if (opened) {
        this.onMenuOpen();
      } else {
        this.onMenuClose();
      }

      if (this.isLastMessage) {
        const EVENT = {
          type: 'SCROLL_TO_BOTTOM',
          data: {},
        };
        this.userActionEvent.emit(EVENT);
      }
    }, 0);
  }
}
