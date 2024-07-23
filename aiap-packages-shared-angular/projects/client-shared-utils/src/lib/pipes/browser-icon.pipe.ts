/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Pipe, PipeTransform } from '@angular/core';

import * as ramda from 'ramda';

@Pipe({
  name: 'BrowserIcon',
})
export class BrowserIconPipe implements PipeTransform {

  constructor() { }

  transform(value: any): any {
    const name = value.toLowerCase();
    if (
      ramda.includes('chrome', name)
    ) {
      return 'fab fa-chrome';
    } else if (
      ramda.includes('firefox', name)
    ) {
      return 'fab fa-firefox';
    } else if (
      ramda.includes('safari', name)
    ) {
      return 'fab fa-safari';
    } else if (
      ramda.includes('opera', name)
    ) {
      return 'fab fa-opera';
    } else if (
      ramda.includes('ios', name)
    ) {
      return 'fab fa-safari';
    } else if (
      ramda.includes('edge', name)
    ) {
      return 'fab fa-edge';
    } else if (
      ramda.includes('ie', name)
    ) {
      return 'fab fa-internet-explorer';
    } else {
      return 'far fa-window-restore';
    }
  }
}
