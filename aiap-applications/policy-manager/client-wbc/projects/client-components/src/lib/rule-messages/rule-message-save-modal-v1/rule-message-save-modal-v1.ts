/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { NotificationService } from 'carbon-components-angular';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseModalV1,
} from 'client-shared-views'

import {
  RuleMessagesServiceV1,
  RuleMessagesImportServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-rule-message-save-modal-v1',
  templateUrl: './rule-message-save-modal-v1.html',
  styleUrls: ['./rule-message-save-modal-v1.scss']
})
export class RuleMessageSaveModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'RuleMessageSaveModalV1';
  }

  @Input() isMessageImport: boolean = false;

  @ViewChild('actionsOverFlowTemplate', { static: true }) actionsOverFlowTemplate: TemplateRef<any>;

  isEdit = false;

  actions = [
    { content: 'PA' },
    { content: 'RESELLER' }
  ];

  selections: any = {

  }

  _message: any = {
    id: undefined,
    name: undefined,
    code: 0,
    templates: [
      {
        index: 0,
        language: 'en-gb',
        message: undefined
      }
    ]
  };
  message: any = lodash.cloneDeep(this._message);

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationService,
    private ruleMessagesService: RuleMessagesServiceV1,
    private ruleMessagesImportService: RuleMessagesImportServiceV1,
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

  ngAfterViewInit() { }

  refreshFormData() {
    _debugX(RuleMessageSaveModalV1.getClassName(), 'refreshFormData',
      {
        this_message: this.message
      });


    let service = this.isMessageImport ? this.ruleMessagesImportService : this.ruleMessagesService;

    service.retrieveMessageSaveFormData().pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleRetrieveMessageSaveFormDataError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(RuleMessageSaveModalV1.getClassName(), 'refreshFormData',
        {
          response
        });

      this.eventsService.loadingEmit(false);
      this.isOpen = true;
    });
    this.setEditAction();
  }

  setEditAction() {
    if (!lodash.isEmpty(this.message.id)) {
      this.isEdit = true;
    }
  }

  handleRetrieveMessageSaveFormDataError(error: any) {
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
      type: "error",
      title: this.translateService.instant('rule_messages.save_modal.notification.error.load_title'),
      message: message,
      target: ".notification-container",
      duration: 10000
    }
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  private _sanitizedMessage() {
    const RET_VAL = lodash.cloneDeep(this.message);
    return RET_VAL;
  }

  save() {
    const SANITIZED_MESSAGE = this._sanitizedMessage();
    _debugX(RuleMessageSaveModalV1.getClassName(), 'save',
      {
        SANITIZED_MESSAGE
      });

    let service = this.isMessageImport ? this.ruleMessagesImportService : this.ruleMessagesService;
    service.saveOne(SANITIZED_MESSAGE).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError(error => this.hanldeMessageSaveError(error)),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(RuleMessageSaveModalV1.getClassName(), 'save',
        {
          response
        });

      const NOTIFICATION = {
        type: 'success',
        title: this.translateService.instant('rule_messages.save_modal.notification.success.save_title'),
        target: '.notification-container',
        duration: 5000
      };
      this.notificationService.showNotification(NOTIFICATION);
      this.isOpen = false;
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(undefined);
    });
  }

  hanldeMessageSaveError(error: any) {
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
      title: this.translateService.instant('rule_messages.save_modal.notification.error.save_title'),
      message: message,
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  stopPropagation(event: any) {
    event.stopPropagation();
  }

  close() {
    this.isOpen = false;
    this.isEdit = false;
  }

  show(message: any) {
    _debugX(RuleMessageSaveModalV1.getClassName(), 'save',
      {
        message
      });

    if (
      lodash.isEmpty(message?.id)
    ) {
      this.message = lodash.cloneDeep(this._message);
    } else {
      this.message = lodash.cloneDeep(message);
    }
    this.refreshFormData();
  }

}
