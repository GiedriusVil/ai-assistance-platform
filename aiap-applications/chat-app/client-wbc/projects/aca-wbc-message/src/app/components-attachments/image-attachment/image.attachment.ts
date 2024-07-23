/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnInit } from '@angular/core';
import * as ramda from 'ramda';

@Component({
  selector: 'aca-chat-image-attachment',
  templateUrl: './image.attachment.html',
  styleUrls: ['./image.attachment.scss']
})
export class ImageAttachment implements OnInit {

  @Input() message: any;

  alternateText = '';
  constructor() { }

  ngOnInit() {
    this.alternateTextForImage(this.message);
  }

  imageSource(message) {
    const SOURCE = ramda.path(['attachment', 'attachments', 0, 'url'], message);
    return SOURCE;
  }

  alternateTextForImage(message) {
    const ALT = ramda.path(['attachment', 'attachments', 0, 'message'], message);
    this.alternateText = ALT;
  }
}
