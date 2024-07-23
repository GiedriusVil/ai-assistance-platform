/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { OverflowMenu } from 'carbon-components';

@Directive({
  selector: '[data-overflow-menu]',
})
export class DataOverflowMenuDirective implements OnDestroy {
  overflowMenu: any = null;

  constructor(el: ElementRef) {
    setTimeout(() => {
      this.overflowMenu = OverflowMenu.create(el.nativeElement);
    }, 0);
  }

  ngOnDestroy() {
    this.overflowMenu.release();
  }
}
