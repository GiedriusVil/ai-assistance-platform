/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { Loading } from 'carbon-components';

import { EventsServiceV1 } from 'client-shared-services';

@Directive({
  selector: '[data-loading]',
})
export class DataLoadingDirective implements OnDestroy {
  loading: any = null;

  constructor(
    el: ElementRef,
    private eventsService: EventsServiceV1,
  ) {
    this.loading = Loading.create(el.nativeElement, { active: false });

    this.eventsService.loadingEmitter.subscribe((value) => {
      this.loading.set(value);
    });
  }

  ngOnDestroy() {
    this.eventsService.loadingEmitter.unsubscribe();
    this.loading.release();
  }
}
