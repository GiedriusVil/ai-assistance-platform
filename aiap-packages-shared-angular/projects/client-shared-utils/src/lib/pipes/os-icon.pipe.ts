/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Pipe, PipeTransform } from '@angular/core';
import * as ramda from 'ramda';

@Pipe({
  name: 'OsIcon',
})
export class OsIconPipe implements PipeTransform {
  constructor() { }

  transform(value: any): any {
    const name = value.toLowerCase();
    if (
      ramda.includes('windows', name)
    ) {
      return 'fab fa-windows';
    } else if (
      ramda.includes('mac', name)
    ) {
      return 'fab fa-apple';
    } else if (
      ramda.includes('linux', name)
    ) {
      return 'fab fa-linux';
    } else if (
      ramda.includes('android', name)
    ) {
      return 'fab fa-android';
    } else if (
      ramda.includes('ios', name)
    ) {
      return 'fab fa-app-store-ios';
    } else {
      return 'fas fa-desktop';
    }
  }
}
