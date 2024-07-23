/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';
import * as ramda from 'ramda';

import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { NotificationService } from 'carbon-components-angular';
import { EventsServiceV1 } from 'client-shared-services';

@Injectable()
export class RequestService {
  static getClassName() {
    return 'RequestHandlerUtils';
  }

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationService,
  ) { }

  public handleRequestError(error: any, title: string, messageOverride?: string, duration: number = 10000, showNotification: boolean = true) {
    this.eventsService.loadingEmit(false);

    let message;
    if (error instanceof HttpErrorResponse) {
      message = `[${error.status} - ${error.statusText}] ${error.message} - ${JSON.stringify(error.error)}`;
    } else {
      message = `${JSON.stringify(error)}`;
    }

    if (!lodash.isEmpty(messageOverride)) {
      message = messageOverride;
    }

    const NOTIFICATION = {
      type: 'error',
      title,
      message,
      target: '.notification-container',
      duration
    };

    if (showNotification) {
      this.notificationService.showNotification(NOTIFICATION);
    }

    return of();
  }

}
