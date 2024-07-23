/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, AfterViewInit, Input } from '@angular/core';

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
  BrowserServiceV1,
  EventsServiceV1,
  QueryServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseModalV1,
} from 'client-shared-views';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  RuleMessagesServiceV1,
  RuleMessagesImportServiceV1,
  RulesServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-rule-message-delete-modal-v1',
  templateUrl: './rule-message-delete-modal-v1.html',
  styleUrls: ['./rule-message-delete-modal-v1.scss']
})
export class RuleMessageDeleteModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'RuleMessageDeleteModalV1';
  }

  @Input() isMessageImport: boolean = false;

  _state: any = {
    isInvalidDelete: false,
    ids: [],
    rules: [],
    query: {
      type: DEFAULT_TABLE.RULE_MESSAGES_V1.TYPE,
      sort: DEFAULT_TABLE.RULE_MESSAGES_V1.SORT,
    }
  }
  state = lodash.cloneDeep(this._state);

  constructor(
    protected queryService: QueryServiceV1,
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private browserService: BrowserServiceV1,
    private ruleMessagesService: RuleMessagesServiceV1,
    private ruleMessagesImportService: RuleMessagesImportServiceV1,
    private rulesService: RulesServiceV1,
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

  delete() {
    _debugX(RuleMessageDeleteModalV1.getClassName(), 'delete',
      {
        this_state: this.state,
      });

    let service = this.isMessageImport ? this.ruleMessagesImportService : this.ruleMessagesService;
    service.deleteManyByIds(this.state?.ids)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.hanldeDeleteOneByIdError(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response) => {
        _debugX(RuleMessageDeleteModalV1.getClassName(), 'delete',
          {
            response
          });

        const NOTIFICATION = {
          type: 'success',
          title: this.translateService.instant('rule_messages.delete_modal.notification.success.title'),
          target: '.notification-container',
          duration: 5000
        };
        this.notificationService.showNotification(NOTIFICATION);
        this.eventsService.loadingEmit(false);
        this.close();
        this.eventsService.filterEmit(undefined);

        const STATE_NEW = lodash.cloneDeep(this.state);
        STATE_NEW.ids = this._state.ids;
        this.state = STATE_NEW;
      });
  }

  hanldeDeleteOneByIdError(error: any) {
    _debugX(RuleMessageDeleteModalV1.getClassName(), 'hanldeDeleteOneByIdError',
      {
        error
      });

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
      title: this.translateService.instant('rule_messages.delete_modal.notification.error.title'),
      message: message,
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }
  handleOpenRuleInNewTab(rule: any = undefined) {
    _debugX(RuleMessageDeleteModalV1.getClassName(), 'handleOpenRuleInNewTab',
      {
        rule
      });

    const ROUTE = 'main-view-wbc/policy-manager(policyManager:main-view/rules-view-v1)';
    const QUERY_PARAMS = {
      id: rule.id
    };
    this.browserService.openInNewTabWithParams(ROUTE, QUERY_PARAMS);
  }

  show(ids: any[]) {
    _debugX(RuleMessageDeleteModalV1.getClassName(), 'show',
      {
        ids
      });

    if (
      lodash.isArray(ids)
    ) {
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.ids = ids;
      this.state = STATE_NEW;

      const QUERY = this.queryService.query(this.state?.query?.type);
      QUERY.filter.messageIds = ids;
      QUERY.pagination.size = 5;

      this.rulesService.findManyByQuery(QUERY)
        .subscribe((response: any) => {
          const STATE_NEW = lodash.cloneDeep(this.state);
          STATE_NEW.rules = response?.items;
          if (
            !lodash.isEmpty(STATE_NEW.rules)
          ) {
            STATE_NEW.isInvalidDelete = true;
          }
          this.state = STATE_NEW;
        });
      this.isOpen = true;
    } else {
      const NOTIFICATION = {
        type: 'error',
        title: this.translateService.instant('rule_messages.delete_modal.notification.error.title'),
        target: '.notification-container',
        duration: 10000
      };
      this.notificationService.showNotification(NOTIFICATION);
    }
  }

  close() {
    this.isOpen = false;
    const STATE_NEW = lodash.cloneDeep(this.state);
    STATE_NEW.isInvalidDelete = false;
    this.state = STATE_NEW;
  }

}
