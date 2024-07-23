/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseViewWbcV1,
} from 'client-shared-views';

import {
  DEFAULT_TABLE
} from 'client-utils';

import {
  RulesImportServiceV1,
} from 'client-services';

import {
  RuleClearModalV1,
  RuleDeleteModalV1,
  RuleSaveModalV1,
  RuleEnableModalV1,
} from 'client-components';

import { RuleInstructionModalV1 } from './rule-instruction-modal-v1/rule-instruction-modal-v1';

@Component({
  selector: 'aiap-wbc-rules-import-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class RulesImportViewV1 extends BaseViewWbcV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'RulesImportViewV1';
  }

  @ViewChild('ruleSaveModal') ruleSaveModal: RuleSaveModalV1;
  @ViewChild('ruleDeleteModal') ruleDeleteModal: RuleDeleteModalV1;
  @ViewChild('ruleClearModal') ruleClearModal: RuleClearModalV1;
  @ViewChild('ruleEnableModal') ruleEnableModal: RuleEnableModalV1;

  @ViewChild('ruleInstructionModal') ruleInstructionModal: RuleInstructionModalV1;

  _state: any = {
    query: {
      filter: {
        ruleId: undefined
      },
      type: DEFAULT_TABLE.RULES_V1.TYPE,
      sort: DEFAULT_TABLE.RULES_V1.SORT,
      pagination: {
        page: 1,
        size: 10,
      }
    },
    filterByWarning: false,
    ready: false,
  };
  state = lodash.cloneDeep(this._state);

  steps: any = [
    {
      text: this.translateService.instant('rules_import_v1.view.steps.import'),
      state: ["current"],
    },
    {
      text: this.translateService.instant('rules_import_v1.view.steps.review'),
      state: ["incomplete"],
    },
    {
      text: this.translateService.instant('rules_import_v1.view.steps.submit'),
      state: ["completed"],
    },
  ];
  current: number = 0;
  unsubmittedRulesCount: number = 0;

  constructor(
    // params-super
    protected notificationService: NotificationService,
    // params-native
    private router: Router,
    private rulesImportService: RulesImportServiceV1,
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super(notificationService);
  }

  ngOnInit() {
    this.startImportTracking();
    this.state.filterByWarning = this.queryService.getFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.IS_RULES_WITH_WARNING);
    this.eventsService.filterEmit({});
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  startImportTracking() {
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap(() => {
        return this.rulesImportService.findManyByQuery(this.state.query).pipe(
          catchError(error => this.handleFindManyByQueryError(error))
        );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugW(RulesImportViewV1.getClassName(), 'startImportTracking', { response });
      const IMPORT_ITEMS_TOTAL = response?.total;
      const IMPORT_ITEMS: any = response?.items;

      if (
        IMPORT_ITEMS_TOTAL > 0 &&
        this.current < 1
      ) {
        this.current = 1;
      }
      this.state.ready = IMPORT_ITEMS.every(
        r => r.status.selectedMessageExists && r.status.selectedBuyerExists
      );
      _debugW(RulesImportViewV1.getClassName(), 'startImportTracking', { ready: this.state.ready });

      this.eventsService.loadingEmit(false);
    });
  }

  handleFindManyByQueryError(error: any) {
    _errorW(RulesImportViewV1.getClassName(), 'handleFindManyByQueryError', { error });

    this.eventsService.loadingEmit(false);
    let message;
    if (
      error instanceof HttpErrorResponse
    ) {
      message = `[${error.status} - ${error.statusText}] ${error.message} - ${JSON.stringify(error.error)}`;
    } else {
      message = `${JSON.stringify(error)}`;
    }
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('rules_import_v1.view.notifications.error.retrieve'),
      message: message,
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  stepSelected(event: any) {
    _debugW(RulesImportViewV1.getClassName(), 'stepSelected', { event });
  }

  onFileUploadedSuccess($event) {
    if (
      !lodash.isEmpty($event) && $event.values()
    ) {
      const ITERATOR = $event.values();
      const FILE: any = ramda.path(['value', 'file'], ITERATOR.next());
      _debugW(RulesImportViewV1.getClassName(), 'onFilesAdded', { FILE });

      this.rulesImportService.uploadFile(FILE).pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.hanldeFileUploadError(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response) => {
        _debugW(RulesImportViewV1.getClassName(), 'save', { response });

        const NOTIFICATION = {
          type: 'success',
          title: this.translateService.instant('rules_import_v1.view.notifications.success.upload'),
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

  hanldeFileUploadError(error: any) {
    this.eventsService.loadingEmit(false);
    let message;
    if (error instanceof HttpErrorResponse) {
      message = `[${error.status} - ${error.statusText}] ${error.message} - ${JSON.stringify(error.error)}`;
    } else {
      message = `${JSON.stringify(error)}`;
    }
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('rules_import_v1.view.notifications.error.import'),
      message: message,
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  next() {
    this.current += 1;
  }

  back() {
    this.current -= 1;
  }

  cancel() { }

  handleWarningFilterCheck(event: any) {
    _debugW(RulesImportViewV1.getClassName(), 'handleWarningFilterCheck', { event });
    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.IS_RULES_WITH_WARNING, event.checked);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  import() {
    this.rulesImportService.submitImport().pipe(
      catchError(error => this.hanldeFileUploadError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response) => {
      _debugW(RulesImportViewV1.getClassName(), 'import', { response });
      const NOTIFICATION = {
        type: 'success',
        title: this.translateService.instant('rules_import_v1.view.notifications.success.import'),
        target: '.notification-container',
        duration: 5000
      };
      this.next();
      this.notificationService.showNotification(NOTIFICATION);
    });
  }

  showRuleSaveModal(event: any = undefined) {
    _debugW(RulesImportViewV1.getClassName(), 'showRuleSaveModal', { event });
    this.ruleSaveModal.show(event?.value);
  }

  showRuleDeleteModal(event: any) {
    _debugW(RulesImportViewV1.getClassName(), 'showRuleDeleteModal', { event });
    this.ruleDeleteModal.show(event);
  }

  showRuleEnableModal(ids: any[]) {
    _debugW(RulesImportViewV1.getClassName(), `showRuleEnableModal`, { ids });

    this.ruleEnableModal.show(ids);
  }

  showRuleClearModal(event: any) {
    _debugW(RulesImportViewV1.getClassName(), 'showRuleClearModal', { event });
    this.ruleClearModal.show(event);
  }

  showRuleInstructionsModal(event: any) {
    _debugW(RulesImportViewV1.getClassName(), 'showRuleInstructionsModal', { event });
    this.ruleInstructionModal.show(event);
  }

  routeToRuleView() {
    this.router.navigateByUrl('/main-view/rules');
  }

}
