/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { Search } from 'carbon-components';

@Directive({
  selector: '[data-search]',
})
export class DataSearchDirective implements OnDestroy {
  search: any = null;

  constructor(el: ElementRef) {
    setTimeout(() => {
      this.search = Search.create(el.nativeElement);
    }, 0);
  }

  ngOnDestroy() {
    this.search.release();
  }
}
