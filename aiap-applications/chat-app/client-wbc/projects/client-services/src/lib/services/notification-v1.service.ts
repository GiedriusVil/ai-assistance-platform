/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import * as ramda from 'ramda';

import { NOTIFICATION_TYPES } from 'client-utils';

import {
  SessionServiceV1,
} from '.';

@Injectable()
export class NotificationServiceV1 {

  static getClassName() {
    return 'NotificationServiceV1';
  }

  constructor(
    private sessionService: SessionServiceV1,
  ) { }

  isNotificationVisibleAcaError(message: any): boolean {
    const IS_ENABLED = ramda.pathOr(false, ['engagement', 'chatApp', 'notifications', NOTIFICATION_TYPES.ACA_ERROR], this.sessionService.getSession());
    const RET_VAL = IS_ENABLED && NOTIFICATION_TYPES.ACA_ERROR === message?.type;
    return RET_VAL;
  }


  isNotificationVisibleAcaDebug(message: any): boolean {
    const IS_ENABLED = ramda.pathOr(false, ['engagement', 'chatApp', 'notifications', NOTIFICATION_TYPES.ACA_DEBUG], this.sessionService.getSession());
    const RET_VAL = IS_ENABLED && NOTIFICATION_TYPES.ACA_DEBUG === message?.type;
    return RET_VAL;
  }

}
