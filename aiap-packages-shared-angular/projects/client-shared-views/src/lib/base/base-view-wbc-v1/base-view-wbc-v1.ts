/*
  © Copyright IBM Corporation 2022. All Rights Reserved 

  SPDX-License-Identifier: EPL-2.0
*/
import { Subject } from "rxjs/internal/Subject";

import * as lodash from 'lodash';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugW,
} from 'client-shared-utils';

export abstract class BaseViewWbcV1 {

  static getClassName() {
    return 'BaseViewWbcV1';
  }

  public _destroyed$: Subject<void> = new Subject();

  constructor(
    protected notificationService: NotificationService,
  ) { }

  public superNgOnDestroy() {
    // [LEGO] 2023-03-06 Quick Hack for removing messages on wbc view change. 
    const NOTIFICATIONS_CONTAINER = document.querySelector('.notification-container');
    _debugW(BaseViewWbcV1.getClassName(), 'superNgOnDestroy', { NOTIFICATIONS_CONTAINER });

    NOTIFICATIONS_CONTAINER.innerHTML = '';

    this._destroyed$.next();
    this._destroyed$.complete();
  }

}
