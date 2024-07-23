/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'AiServiceName',
})
export class AiServiceNamePipe implements PipeTransform {

  constructor() { }

  transform(value: any): any {
    if (value === 'wa' || value === 'wcs' || value === 'WA') {
      return 'Watson Assistant';
    }

    if (value === 'lex') {
      return 'Amazon lex';
    }

    if (value === 'df') {
      return 'Dialogflow';
    }

    if (value === 'ms') {
      return 'Microsoft LUIS and QnA';
    }
    return value;
  }
}
