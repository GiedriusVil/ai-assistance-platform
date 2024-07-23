/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { Loading } from 'carbon-components';
import { Subscription } from 'rxjs';

import { EventsServiceV1 } from 'client-shared-services';

@Directive({
  selector: '[data-loading-small]'
})
export class DataLoadingSmallDirective implements OnDestroy {

  loadingSmall: any = null;
  sub: Subscription;

  constructor(
    el: ElementRef,
    private eventsService: EventsServiceV1,
  ) {
    this.loadingSmall = Loading.create(el.nativeElement, { active: true });

    this.sub = this.eventsService.smallLoadingEmitter.subscribe(value => {
      this.loadingSmall.set({ active: value });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.loadingSmall.release();
  }
}
