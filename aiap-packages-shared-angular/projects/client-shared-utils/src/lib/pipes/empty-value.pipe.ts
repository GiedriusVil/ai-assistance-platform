/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'EmptyValue',
})
export class EmptyValuePipe implements PipeTransform {
  transform(value: any): any {
    if (value === '0' || value === 0) {
      return 'Not provided';
    }
    return value;
  }
}
