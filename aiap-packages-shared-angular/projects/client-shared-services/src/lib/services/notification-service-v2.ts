/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { NotificationService, NotificationContent } from 'client-shared-carbon';

import * as lodash from 'lodash';

import {
  _errorX,
} from 'client-shared-utils';

import { SessionServiceV1 } from './session-service-v1';

@Injectable()
export class NotificationServiceV2 {

  static getClassName() {
    return 'NotificationServiceV2';
  }

  constructor(
    private notificationService: NotificationService,
    private sessionService: SessionServiceV1,
  ) { }

  showNotification(notification: NotificationContent) {
    try {
      const IS_NOTIFICATION_ENABLED = this.isNotificationEnabled(notification);
      if (IS_NOTIFICATION_ENABLED) {
        this.notificationService.showNotification(notification);
      }
    } catch (error) {
      _errorX(NotificationServiceV2.getClassName(), `showNotification`,
        {
          notification,
        });
    }
  }

  isNotificationEnabled(notification: NotificationContent) {
    let retVal = false;

    const SESSION = this.sessionService.getSession();
    const TENANT_CONFIGURATION_NOTIFICATIONS = SESSION?.tenant?.configuration?.notifications;
    if (
      lodash.isBoolean(TENANT_CONFIGURATION_NOTIFICATIONS)
    ) {
      return TENANT_CONFIGURATION_NOTIFICATIONS;
    }
    if (
      lodash.isEmpty(TENANT_CONFIGURATION_NOTIFICATIONS)
    ) {
      return retVal;
    }
    const INCOMING_NOTIFICATION_TYPE = notification?.type;
    const INCOMING_NOTIFICATION_TYPE_ENABLED = TENANT_CONFIGURATION_NOTIFICATIONS?.[INCOMING_NOTIFICATION_TYPE];
    if (
      lodash.isBoolean(INCOMING_NOTIFICATION_TYPE_ENABLED)
    ) {
      return INCOMING_NOTIFICATION_TYPE_ENABLED;
    }
    if (
      lodash.isEmpty(INCOMING_NOTIFICATION_TYPE_ENABLED)
    ) {
      return retVal;
    }
    return retVal;
  }

}
