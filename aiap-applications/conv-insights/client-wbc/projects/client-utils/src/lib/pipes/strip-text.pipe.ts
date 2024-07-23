/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'StripText',
})
export class StripTextPipe implements PipeTransform {
  transform(value: any): any {
    const maxLength = 30;
    let result = value;
    if (result && result.length > maxLength) {
      result = `${result.slice(0, maxLength)}...`;
    }
    return result;
  }
}
