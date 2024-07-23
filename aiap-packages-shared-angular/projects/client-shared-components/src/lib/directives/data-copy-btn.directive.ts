/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { CopyButton } from 'carbon-components';

@Directive({
  selector: '[data-copy-btn]',
})
export class DataCopyBtnDirective implements OnDestroy {
  copyButton: any = null;

  constructor(el: ElementRef) {
    setTimeout(() => {
      this.copyButton = CopyButton.create(el.nativeElement);
    }, 0);
  }

  ngOnDestroy() {
    this.copyButton.release();
  }
}
