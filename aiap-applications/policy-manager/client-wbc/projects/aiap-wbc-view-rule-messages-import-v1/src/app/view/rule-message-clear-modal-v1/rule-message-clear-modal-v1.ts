/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseModalV1,
} from 'client-shared-views';

import {
  RuleMessagesImportServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-rule-message-clear-modal-v1',
  templateUrl: './rule-message-clear-modal-v1.html',
  styleUrls: ['./rule-message-clear-modal-v1.scss']
})
export class RuleMessageClearModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'RuleMessageClearModalV1';
  }

  @Input() isMessageImport: boolean = false;

  @Output() onClear = new EventEmitter<void>();

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private ruleMessagesImportService: RuleMessagesImportServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.superNgOnInit(this.eventsService);
  }

  ngAfterViewInit(): void { }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  clear() {
    this.ruleMessagesImportService.clearImport()
      .pipe(
        catchError(error => this.hanldeClearError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(RuleMessageClearModalV1.getClassName(), 'clearƒ',
          {
            response
          });

        const NOTIFICATION = {
          type: 'success',
          title: this.translateService.instant('rule_messages_import_v1.clear_modal.notification.success.title'),
          target: '.notification-container',
          duration: 5000
        };
        this.notificationService.showNotification(NOTIFICATION);
        this.isOpen = false;
        this.onClear.emit();
      });
  }

  private hanldeClearError(error: any) {
    this.eventsService.loadingEmit(false);
    let message: any;
    if (
      error instanceof HttpErrorResponse
    ) {
      message = `[${error.status} - ${error.statusText}] ${error.message} - ${JSON.stringify(error.error)}`;
    } else {
      message = `${JSON.stringify(error)}`;
    }
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('rule_messages_import_v1.clear_modal.notification.error.title'),
      message: message,
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }


  show(event: any) {
    _debugX(RuleMessageClearModalV1.getClassName(), 'show', { event });
    if (
      !lodash.isEmpty(event)
    ) {
      this.isOpen = true;
    }
  }

}
