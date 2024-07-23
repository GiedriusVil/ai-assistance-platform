/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input } from '@angular/core';

import { _debugX } from 'client-utils';

@Component({
  selector: 'aca-chat-error-notification',
  templateUrl: './error.notification.html',
  styleUrls: ['./error.notification.scss']
})
export class ErrorNotification {

  static getClassName() {
    return 'ErrorNotification';
  }

  @Input() message: any;

  isVisible: boolean = false;

  constructor() { }

  handleClickEvent(event) {
    _debugX(ErrorNotification.getClassName(), 'handleClickEvent', { event });
    this.isVisible = !this.isVisible;
  }

}
