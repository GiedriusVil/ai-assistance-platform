/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'HostName'
})
export class HostNamePipe implements PipeTransform {
  transform(value: any): any {
    if (value) {
      return value.split('.')[0].trim();
    }
    return value;
  }
}
