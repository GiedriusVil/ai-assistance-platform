/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input } from '@angular/core';


@Component({
  selector: 'aca-chat-default-notification',
  templateUrl: './default.notification.html',
  styleUrls: ['./default.notification.scss']
})
export class DefaultNotification {

  @Input() message: any;

  constructor() { }


}
