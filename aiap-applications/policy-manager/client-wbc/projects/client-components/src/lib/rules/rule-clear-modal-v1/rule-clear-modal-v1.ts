/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { catchError, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseModal,
} from 'client-shared-views';

import {
  RulesImportServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-rule-clear-modal-v1',
  templateUrl: './rule-clear-modal-v1.html',
  styleUrls: ['./rule-clear-modal-v1.scss']
})
export class RuleClearModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'RuleClearModalV1';
  }

  @Input() isRuleImport: boolean = false;
  @Output() onClear = new EventEmitter<void>();

  path = 'main-view/rules-import';

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private rulesImportService: RulesImportServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.superNgOnInit(this.eventsService);
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngAfterViewInit(): void { }

  clear() {
    this.rulesImportService.clearImport().pipe(
      catchError(error => this.hanldeClearError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response) => {
      _debugX(RuleClearModalV1.getClassName(), 'submit', { response });

      const NOTIFICATION = {
        type: 'success',
        title: this.translateService.instant('rule_clear_modal_v1.notification.success_title'),
        target: '.notification-container',
        duration: 5000
      };
      this.notificationService.showNotification(NOTIFICATION);
      this.isOpen = false;
      this.onClear.emit();
    })
  }


  private hanldeClearError(error: any) {
    _errorX(RuleClearModalV1.getClassName(), 'hanldeClearError', { error });

    this.eventsService.loadingEmit(false);
    let message;
    if (error instanceof HttpErrorResponse) {
      message = `[${error.status} - ${error.statusText}] ${error.message} - ${JSON.stringify(error.error)}`;
    } else {
      message = `${JSON.stringify(error)}`;
    }
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('rule_clear_modal_v1.notification.error_title'),
      message: message,
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  show(event: any) {
    _debugX(RuleClearModalV1.getClassName(), 'show', { event });

    if (
      !lodash.isEmpty(event)
    ) {
      this.isOpen = true;
    }
  }


}
