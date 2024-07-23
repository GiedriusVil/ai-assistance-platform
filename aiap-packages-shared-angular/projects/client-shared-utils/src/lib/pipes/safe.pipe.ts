/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as ramda from 'ramda';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  transform(message) {
    let result = message.text;
    if (message.type === 'bot' && message.feedback) {
      result = ramda.concat(result, this.getFeedbackIcon(message.feedback));
    }
    return this.sanitizer['bypassSecurityTrustHtml'](result);
  }

  getFeedbackIcon(feedback: number) {
    if (feedback === 1) {
      return '<span class="feedback green"><i class="fas fa-thumbs-up "></i></span>';
    } else if (feedback === -1) {
      return '<span class="feedback red"><i class="fas fa-thumbs-down"></i></span>';
    }
  }
}
