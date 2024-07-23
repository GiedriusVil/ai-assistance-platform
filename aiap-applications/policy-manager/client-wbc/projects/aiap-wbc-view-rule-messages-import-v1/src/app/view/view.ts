/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugW,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseViewWbcV1,
} from 'client-shared-views';

import {
  RuleMessagesImportServiceV1,
} from 'client-services';

import {
  RuleMessageDeleteModalV1,
  RuleMessageSaveModalV1,
} from 'client-components';

import { RuleMessageClearModalV1 } from './rule-message-clear-modal-v1/rule-message-clear-modal-v1';
import { RuleMessageInstructionModalV1 } from './rule-message-instruction-modal-v1/rule-message-instruction-modal-v1';

@Component({
  selector: 'aiap-wbc-rule-messages-import-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class RuleMessagesImportViewV1 extends BaseViewWbcV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'RuleMessagesImportViewV1';
  }

  @ViewChild('deleteModal') deleteModal: RuleMessageDeleteModalV1;
  @ViewChild('saveModal') saveModal: RuleMessageSaveModalV1;

  @ViewChild('clearModal') clearModal: RuleMessageClearModalV1;
  @ViewChild('instructionModal') instructionModal: RuleMessageInstructionModalV1;

  steps: any = [
    {
      text: this.translateService.instant('rule_messages_import_v1.view.steps.import'),
      state: ["current"],
    },
    {
      text: this.translateService.instant('rule_messages_import_v1.view.steps.review'),
      state: ["incomplete"],
    },
    {
      text: this.translateService.instant('rule_messages_import_v1.view.steps.submit'),
      state: ["completed"],
    },
  ];

  current: number = 0;
  unsubmittedRulesCount: number = 0;

  _state: any = {
    query: {
      filter: {
        ruleId: undefined
      },
      sort: {
        field: 'id',
        direction: 'desc'
      },
      pagination: {
        page: 1,
        size: 10,
      }
    }
  };
  state = lodash.cloneDeep(this._state);

  constructor(
    // params-super
    protected notificationService: NotificationService,
    // params-native
    private router: Router,
    private eventsService: EventsServiceV1,
    private ruleMessagesImportService: RuleMessagesImportServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super(notificationService);
  }

  ngOnInit() {
    this.getUnsubmittedRuleCount();
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  getUnsubmittedRuleCount() {
    this.ruleMessagesImportService.findManyByQuery(this.state?.query)
      .pipe(
        catchError(error => this.handleFindManyByQueryError(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        this.unsubmittedRulesCount = response?.total;

        if (
          this.unsubmittedRulesCount > 0
        ) {
          this.next();
        }
      });
  }

  handleFindManyByQueryError(error: any) {
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
      title: this.translateService.instant('rule_messages_import_v1.view.notifications.error.retrieve'),
      message: message,
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  stepSelected(event: any) { }

  onFileUploadedSuccess($event) {
    if (
      !lodash.isEmpty($event) &&
      $event.values()
    ) {
      const ITERATOR = $event.values();
      const FILE: File = ramda.path(['value', 'file'], ITERATOR.next());

      this.ruleMessagesImportService.uploadFile(FILE).pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.hanldeFileUploadError(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        const NOTIFICATION = {
          type: 'success',
          title: this.translateService.instant('rule_messages_import_v1.view.notifications.success.upload'),
          target: '.notification-container',
          duration: 5000
        };
        this.notificationService.showNotification(NOTIFICATION);
        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(undefined);
        this.next();
      });
    }
  }

  next() {
    this.current += 1;
  }

  back() {
    this.current -= 1;
  }

  cancel() { }

  hanldeFileUploadError(error: any) {
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
      title: this.translateService.instant('rule_messages_import_v1.view.notifications.error.import'),
      message: message,
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  import() {
    this.ruleMessagesImportService.submitImport().pipe(
      catchError(error => this.hanldeFileUploadError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {

      const NOTIFICATION = {
        type: 'success',
        title: this.translateService.instant('rule_messages_import_v1.view.notifications.success.import'),
        target: '.notification-container',
        duration: 5000
      };
      this.next();
      this.notificationService.showNotification(NOTIFICATION);
    });
  }

  showMessageSaveModal(event: any = undefined) {
    this.saveModal.show(event?.value);
  }

  showMessageDeleteModal(ids: any[]) {
    this.deleteModal.show(ids);
  }

  showMessageClearModal(event: any) {
    this.clearModal.show(event);
  }

  showMessagesInstructionsModal(event: any) {
    this.instructionModal.show(event);
  }

  routeToMessagesView() {
    this.router.navigateByUrl('/main-view/messages');
  }

}
