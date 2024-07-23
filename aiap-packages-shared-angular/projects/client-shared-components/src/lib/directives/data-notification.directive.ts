/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { Notification } from 'carbon-components';

@Directive({
  selector: '[data-notification]',
})
export class DataNotificationDirective implements OnDestroy {
  notification: any = null;

  constructor(el: ElementRef) {
    setTimeout(() => {
      this.notification = Notification.create(el.nativeElement);
    }, 0);
  }

  ngOnDestroy() {
    this.notification.release();
  }
}
