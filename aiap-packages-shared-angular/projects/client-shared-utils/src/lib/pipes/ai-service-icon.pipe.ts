/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'AiServiceIcon',
})
export class AiServiceIconPipe implements PipeTransform {

  constructor(
    private domSanitizer: DomSanitizer
  ) { }

  transform(value: any): any {
    if (value === 'wa' || value === 'wcs' || value === 'WA') {
      return this.domSanitizer.bypassSecurityTrustHtml(
        '<img alt="' + value + '" src="/assets/conversation-service-logos/IBM_Watson_Logo_2017.png" style="height: 32px;"/>'
      );
    }

    if (value === 'lex') {
      return this.domSanitizer.bypassSecurityTrustHtml(
        '<img alt="' + value + '" src="/assets/conversation-service-logos/lex2.png" style="height: 32px;"/>'
      );
    }

    if (value === 'df') {
      return this.domSanitizer.bypassSecurityTrustHtml(
        '<img alt="' + value + '" src="/assets/conversation-service-logos/dialog-flow2.png" style="height: 32px;"/>'
      );
    }

    if (value === 'ms') {
      return this.domSanitizer.bypassSecurityTrustHtml(
        '<img alt="' + value + '" src="/assets/conversation-service-logos/qna2.png" style="height: 32px;"/>'
      );
    }
    return value;
  }
}
