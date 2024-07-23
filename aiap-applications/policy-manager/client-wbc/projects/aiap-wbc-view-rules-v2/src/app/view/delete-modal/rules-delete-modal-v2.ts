/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';

import { catchError, takeUntil, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import * as lodash from 'lodash';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import {
  EventsServiceV1,
} from 'client-shared-services';

import {
  BaseModal,
} from 'client-shared-views';

import {
  RulesServiceV2,
} from 'client-services';

import {
  RULES_MESSAGES_V2,
} from '../../messages';

@Component({
  selector: 'aiap-rules-delete-modal-v2',
  templateUrl: './rules-delete-modal-v2.html',
  styleUrls: ['./rules-delete-modal-v2.scss']
})
export class RulesDeleteModalV2 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'RulesDeleteModalV2';
  }

  _rulesIds: string[] = [];
  _rules: any[] = [];
  rulesIds: string[] = lodash.cloneDeep(this._rulesIds);
  rules: any[] = lodash.cloneDeep(this._rules);

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationService,
    private RulesServiceV2: RulesServiceV2,
  ) {
    super();
  }

  ngOnInit() { }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit() { }

  show(rules: any[]) {
    if (
      !lodash.isEmpty(rules) &&
      lodash.isArray(rules)
    ) {
      this.rules = lodash.cloneDeep(rules);
      this.rulesIds = rules.map(rule => rule?.id);
      this.superShow();
    } else {
      this.notificationService.showNotification(RULES_MESSAGES_V2.ERROR.SHOW_RULES_DELETE_MODAL_V2);
    }
  }

  delete(): void {
    this.RulesServiceV2.deleteManyByIds(this.rulesIds)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleRulesV2DeleteError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugW(RulesDeleteModalV2.getClassName(), 'handleShowRulesV2DeleteModal', { response });
        this.eventsService.loadingEmit(false)
        this.notificationService.showNotification(RULES_MESSAGES_V2.SUCCESS.DELETE_MANY_BY_IDS);
        this.close();
        this.eventsService.filterEmit(null);
      });
  }

  handleRulesV2DeleteError(error: any): Observable<void> {
    this.eventsService.loadingEmit(false);
    _errorW(RulesDeleteModalV2.getClassName(), 'handleRulesV2DeleteError', { error });
    this.notificationService.showNotification(RULES_MESSAGES_V2.ERROR.DELETE_MANY_BY_IDS);
    this.isOpen = false;
    return of();
  }

}
