/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input } from '@angular/core';


@Component({
  selector: 'aca-chat-bot-notification',
  templateUrl: './bot.notification.html',
  styleUrls: ['./bot.notification.scss']
})
export class BotNotification {

  @Input() message: any;

  constructor() { }


}
