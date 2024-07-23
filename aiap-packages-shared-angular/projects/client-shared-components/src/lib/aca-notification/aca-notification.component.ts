/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { delay, catchError, takeUntil } from 'rxjs/operators';
import { NotificationServiceV1 } from 'client-shared-services';

import {
  NOTIFICATION_STATUS,
} from 'client-shared-utils';

@Component({
  selector: 'aca-notification',
  templateUrl: './aca-notification.component.html',
  styleUrls: ['./aca-notification.component.scss']
})
export class AcaNotificationComponent implements OnInit {

  title: string;
  subtitle: string;
  caption: string;
  show = false;
  autoClose = true;
  status: NOTIFICATION_STATUS = NOTIFICATION_STATUS.INFO;
  notificationClass = NOTIFICATION_STATUS;

  private _destroyed$: Subject<void> = new Subject();

  constructor(private notificationService: NotificationServiceV1, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this._autoClose();
    this.notificationService
      .getNotificationStatus()
      .pipe(
        catchError(er => {
          throw er;
        }),
        takeUntil(this._destroyed$),
      )
      .subscribe(options => {
        this.show = options.show;
        this.title = options.title;
        this.subtitle = options.subtitle;
        this.status = options.status || this.status;
        this.autoClose = options.autoClose;
        this.cd.markForCheck();
        if (this.autoClose && this.show) {
          this.notificationService.triggerAutoClose();
        }
      });
  }

  ngOnDestroy() {
    this.notificationService.hideNotification();
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  private _autoClose() {
    this.notificationService
      .getAutoCloseStatus()
      .pipe(
        delay(5000),
        catchError(er => {
          throw er;
        }),
        takeUntil(this._destroyed$),
      )
      .subscribe(() => {
        this.notificationService.hideNotification();
        this.cd.markForCheck();
      });
  }

  close() {
    this.notificationService.hideNotification();
  }

}
