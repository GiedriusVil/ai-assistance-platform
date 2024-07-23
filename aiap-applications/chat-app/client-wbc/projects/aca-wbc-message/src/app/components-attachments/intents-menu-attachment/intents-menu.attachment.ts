/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, EventEmitter, Input, Output } from '@angular/core';

import * as lodash from 'lodash';

@Component({
  selector: 'aca-chat-intents-menu-attachment',
  templateUrl: './intents-menu.attachment.html',
  styleUrls: ['./intents-menu.attachment.scss']
})
export class IntentsMenuAttachment {

  static getClassName() {
    return 'IntentsMenuAttachment';
  }

  @Input() message;
  @Input() isContentEnabled: boolean;

  @Output() userActionEvent = new EventEmitter<any>();

  activeTab = { title: null, name: null };
  tabs = [
    { title: 'Top Searches', name: 'topIntentsMessages' },
    { title: 'Last Searches', name: 'lastIntentsMessages' }
  ];

  constructor() { }

  onButtonClick(message: string): void {
    const EVENT = {
      type: 'POST_MESSAGE',
      data: {
        type: 'user',
        text: message,
        timestamp: new Date().getTime()
      }
    };
    this.userActionEvent.emit(EVENT);
  }

  isTabActive(tab: object): boolean {
    return lodash.isEqual(this.activeTab, tab);
  }

  getTabClass(tab: object): string {
    const RET_VAL = this.isTabActive(tab) ? 'intents-tabs-active w-50' : 'intents-tabs w-50';
    return RET_VAL;
  }

  onTabClick(event: any): void {
    const BUTTON_TITLE = event.target.title;
    const BUTTON_NAME = event.target.name;
    if (this.activeTab.title === BUTTON_TITLE) {
      this.activeTab.title = null;
      this.activeTab.name = null;
    } else {
      this.activeTab.title = BUTTON_TITLE;
      this.activeTab.name = BUTTON_NAME;
    }
    const EVENT = {
      type: 'INSTANT_SCROLL_TO_BOTTOM',
      data: {}
    }
    this.userActionEvent.emit(EVENT);
  }
}
