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
  RulesConditionsServiceV2,
} from 'client-services';

import {
  RULES_CONDITIONS_MESSAGES_V2,
} from '../../../messages';

@Component({
  selector: 'aiap-rules-conditions-delete-modal-v2',
  templateUrl: './rules-conditions-delete-modal-v2.html',
  styleUrls: ['./rules-conditions-delete-modal-v2.scss']
})
export class RulesConditionsDeleteModalV2 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'RulesConditionsDeleteModalV2';
  }

  _conditions: any[] = [];
  conditions: any[] = lodash.cloneDeep(this._conditions);

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationService,
    private RulesConditionsServiceV2: RulesConditionsServiceV2,
  ) {
    super();
  }

  ngOnInit() { }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit() { }

  show(conditions: any) {
    if (
      !lodash.isEmpty(conditions) &&
      lodash.isArray(conditions)
    ) {
      this.conditions = lodash.cloneDeep(conditions);
      this.superShow();
    } else {
      this.notificationService.showNotification(RULES_CONDITIONS_MESSAGES_V2.ERROR.SHOW_RULES_DELETE_MODAL_V2);
    }
  }

  delete(): void {
    const CONDITION_IDS = this.conditions.map(condition => condition?.id);
    this.RulesConditionsServiceV2.deleteManyByIds(CONDITION_IDS)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleRulesV2ConditionsDeleteError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugW(RulesConditionsDeleteModalV2.getClassName(), 'handleShowRulesV2ConditionsDeleteModal', { response });
        this.eventsService.loadingEmit(false)
        this.notificationService.showNotification(RULES_CONDITIONS_MESSAGES_V2.SUCCESS.DELETE_MANY_BY_IDS);
        this.close();
        this.eventsService.modalFilterEmit(null);
      });
  }

  handleRulesV2ConditionsDeleteError(error: any): Observable<void> {
    this.eventsService.loadingEmit(false);
    _errorW(RulesConditionsDeleteModalV2.getClassName(), 'handleRulesV2ConditionsDeleteError', { error });
    this.notificationService.showNotification(RULES_CONDITIONS_MESSAGES_V2.ERROR.DELETE_MANY_BY_IDS);
    this.isOpen = false;
    return of();
  }
}
