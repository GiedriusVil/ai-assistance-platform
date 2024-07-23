/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { HeaderSubmenu } from 'carbon-components';

@Directive({
  selector: '[data-header-submenu]',
})
export class DataHeaderSubmenuDirective implements OnDestroy {
  headerSubmenu: any = null;

  constructor(el: ElementRef) {
    setTimeout(() => {
      this.headerSubmenu = HeaderSubmenu.create(el.nativeElement);
    }, 0);
  }

  ngOnDestroy() {
    this.headerSubmenu.release();
  }
}
