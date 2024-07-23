/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { HeaderNav } from 'carbon-components';

@Directive({
  selector: '[data-header-nav]',
})
export class DataHeaderNavDirective implements OnDestroy {
  headerNav: any = null;

  constructor(el: ElementRef) {
    setTimeout(() => {
      this.headerNav = HeaderNav.create(el.nativeElement);
    }, 0);
  }

  ngOnDestroy() {
    this.headerNav.release();
  }
}
