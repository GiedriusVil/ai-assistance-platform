/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'SentenceCase',
})
export class SentenceCasePipe implements PipeTransform {
  transform(value: any): any {
    if (value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  }
}
