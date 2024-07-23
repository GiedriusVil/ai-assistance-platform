/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input } from '@angular/core';

@Component({
  selector: 'aca-chat-video-attachment',
  templateUrl: './video.attachment.html',
  styleUrls: ['./video.attachment.scss']
})
export class VideoAttachment {

  @Input() message: any;

  constructor() { }

}
