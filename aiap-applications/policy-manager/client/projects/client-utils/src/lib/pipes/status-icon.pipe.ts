/*
   IBM Services Artificial Intelligence Development Toolkit ISAIDT
   Licensed Materials - Property of IBM
   6949-70S
   © Copyright IBM Corp. 2019 All Rights Reserved
   US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import * as lodash from 'lodash';

import { _debugX } from 'client-shared-utils';

@Pipe({
  name: 'StatusIcon',
})
export class StatusIconPipe implements PipeTransform {

  static getClassName() {
    return 'StatusIconPipe';
  }

  constructor(
    private domSanitizer: DomSanitizer
  ) { }

  transform(value: any): any {
    _debugX(StatusIconPipe.getClassName(), 'transform', { value });
    const MESSAGE_EXISTS = value?.status?.selectedMessageExists;
    const BUYER_EXISTS = value?.status?.selectedBuyerExists;
    const BUYER_ID = value?.buyer?.id;
    const IS_RULE_ENABLED = value?.status?.enabled;

    if (!MESSAGE_EXISTS || !BUYER_EXISTS || lodash.isNil(BUYER_ID)) {
      return this.domSanitizer.bypassSecurityTrustHtml('<i class="fas fa-exclamation-circle" style="color: red"></i>');
    }
    else if (!IS_RULE_ENABLED) {
      return this.domSanitizer.bypassSecurityTrustHtml('<i class="fas fa-pause-circle"></i>');
    }
    else if (MESSAGE_EXISTS) {
      return this.domSanitizer.bypassSecurityTrustHtml('<i class="fas fa-check-circle" style="color: green"></i>');
    }
  }
}
