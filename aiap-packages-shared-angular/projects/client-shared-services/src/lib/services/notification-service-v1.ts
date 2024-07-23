/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  BehaviorSubject,
  Observable,
  Subject,
} from 'rxjs';

import {
  INotification
} from 'client-shared-utils';

/** 
 * @deprecated Use the new {@link NotificationServiceV2} base class instead.
*/
export class NotificationServiceV1 {

  private _autoClose$: Subject<void> = new Subject();
  private _notificationStatus$: BehaviorSubject<INotification> = new BehaviorSubject({ show: false });

  constructor() {
    //
  }

  getAutoCloseStatus(): Observable<void> {
    return this._autoClose$.asObservable();
  }

  triggerAutoClose() {
    this._autoClose$.next();
  }

  showNotification(notificationOptions?: INotification) {
    const visibleNotification = notificationOptions ? { ...notificationOptions, show: true } : { show: true };
    this._notificationStatus$.next(visibleNotification);
  }

  hideNotification(notificationOptions?: INotification) {
    const hideNotification = notificationOptions ? { ...notificationOptions, show: false } : { show: false };
    this._notificationStatus$.next(hideNotification);
  }

  getNotificationStatus(): Observable<INotification> {
    return this._notificationStatus$.asObservable();
  }
}
