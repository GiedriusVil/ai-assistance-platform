/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input } from '@angular/core';

import { _debugX } from 'client-utils';

@Component({
  selector: 'aca-chat-debug-notification',
  templateUrl: './debug.notification.html',
  styleUrls: ['./debug.notification.scss']
})
export class DebugNotification {

  static getClassName() {
    return 'DebugNotification';
  }

  @Input() message: any;

  isVisible: boolean = false;

  constructor() { }

  handleClickEvent(event) {
    _debugX(DebugNotification.getClassName(), 'handleClickEvent', { event });
    this.isVisible = !this.isVisible;
  }

}
