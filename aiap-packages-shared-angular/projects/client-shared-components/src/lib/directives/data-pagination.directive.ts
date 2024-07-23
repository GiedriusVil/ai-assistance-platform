/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { Pagination } from 'carbon-components';

@Directive({
  selector: '[data-pagination]',
})
export class DataPaginationDirective implements OnDestroy {
  search: any = null;

  constructor(el: ElementRef) {
    setTimeout(() => {
      this.search = Pagination.create(el.nativeElement);
    }, 0);
  }

  ngOnDestroy() {
    this.search.release();
  }
}
