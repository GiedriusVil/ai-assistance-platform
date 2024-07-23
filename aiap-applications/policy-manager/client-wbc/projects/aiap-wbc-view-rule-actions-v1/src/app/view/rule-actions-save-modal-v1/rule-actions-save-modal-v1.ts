/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { catchError, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import { NotificationService } from 'carbon-components-angular';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  BaseModalV1,
} from 'client-shared-views';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  RULE_ACTIONS_MESSAGES_V1,
  RuleActionsServiceV1,
} from 'client-services';


@Component({
  selector: 'aiap-rule-actions-save-modal-v1',
  templateUrl: './rule-actions-save-modal-v1.html',
  styleUrls: ['./rule-actions-save-modal-v1.scss']
})
export class RuleActionsSaveModalV1 extends BaseModalV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'RuleActionsSaveModalV1';
  }

  _query: any = {
    type: DEFAULT_TABLE.RULE_ACTIONS_V1.TYPE,
  }
  query = lodash.cloneDeep(this._query);

  _value = {
    id: undefined,
    key: undefined,
    text: undefined,
  }
  value: any = lodash.cloneDeep(this._value);

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
    private ruleActionsService: RuleActionsServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    this.superNgOnInit(this.eventsService);
  }

  ngOnDestroy(): void {
    this.superNgOnDestroy();
  }

  loadSaveModalData(id: any) {
    _debugX(RuleActionsSaveModalV1.getClassName(), 'loadSaveModalData', { id });
    this.eventsService.loadingEmit(true);
    this.ruleActionsService.loadSaveModalData(id).pipe(
      catchError((error) => this.handleLoadSaveModalDataError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(RuleActionsSaveModalV1.getClassName(), 'loadFormData', { response });
      let newValue;
      if (
        lodash.isEmpty(response?.value)
      ) {
        newValue = lodash.cloneDeep(this._value);
      } else {
        newValue = lodash.cloneDeep(response.value);
      }
      this.value = newValue;
      this.eventsService.loadingEmit(false);
      this.superShow();
    });
  }

  handleSaveClickEvent(event: any) {
    const SANITIZED_VALUE = this.sanitizedValue();
    _debugX(RuleActionsSaveModalV1.getClassName(), 'handleSaveClickEvent', { event, SANITIZED_VALUE });
    this.eventsService.loadingEmit(true);
    this.ruleActionsService.saveOne(SANITIZED_VALUE).pipe(
      catchError((error) => this.handleSaveOneError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(RuleActionsSaveModalV1.getClassName(), 'handleSaveClickEvent', { response, });
      this.eventsService.loadingEmit(false);
      const NOTIFICATION = RULE_ACTIONS_MESSAGES_V1.SUCCESS.SAVE_ONE();
      this.notificationService.showNotification(NOTIFICATION);
      this.close();
      this.refreshBuyRulesActions();
    });
  }

  show(id: any) {
    this.loadSaveModalData(id);
  }

  refreshBuyRulesActions(): void {
    this.eventsService.filterEmit(this.queryService.query(this.query?.type));
  }

  private sanitizedValue() {
    const RET_VAL = lodash.cloneDeep(this.value);
    return RET_VAL;
  }

  private handleSaveOneError(error: any) {
    _debugX(RuleActionsSaveModalV1.getClassName(), 'handleSaveOneError', { error });
    const NOTIFICATION = RULE_ACTIONS_MESSAGES_V1.ERROR.SAVE_ONE();
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  private handleLoadSaveModalDataError(error: any) {
    _debugX(RuleActionsSaveModalV1.getClassName(), 'handleLoadSaveModalDataError', { error });
    const NOTIFICATION = RULE_ACTIONS_MESSAGES_V1.ERROR.LOAD_SAVE_MODAL_DATA();
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

}
