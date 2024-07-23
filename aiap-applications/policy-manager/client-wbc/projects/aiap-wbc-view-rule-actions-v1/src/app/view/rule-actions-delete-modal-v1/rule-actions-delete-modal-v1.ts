/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

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
  BaseModalV1,
} from 'client-shared-views';

import {
  RULE_ACTIONS_MESSAGES_V1,
  RuleActionsServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-rule-actions-delete-modal-v1',
  templateUrl: './rule-actions-delete-modal-v1.html',
  styleUrls: ['./rule-actions-delete-modal-v1.scss']
})
export class RuleActionsDeleteModalV1 extends BaseModalV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'RuleActionsDeleteModalV1';
  }

  _state: any = {
    ids: [],
  }
  state = lodash.cloneDeep(this._state);

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private ruleActionsService: RuleActionsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.superNgOnInit(this.eventsService);
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  delete() {
    this.ruleActionsService.deleteManyByIds(this.state.ids)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleDeleteManyByIdsError(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugW(RuleActionsDeleteModalV1.getClassName(), 'delete', { response });

        const NOTIFICATION = RULE_ACTIONS_MESSAGES_V1
          .SUCCESS
          .DELETE_MANY_BY_IDS();

        this.notificationService.showNotification(NOTIFICATION);
        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(undefined);
        this.close();
      });
  }

  show(ids: any) {
    if (
      !lodash.isEmpty(ids)
    ) {
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.ids = ids;
      this.state = STATE_NEW;
      this.isOpen = true;
    } else {
      const NOTIFICATION = RULE_ACTIONS_MESSAGES_V1
        .ERROR
        .SHOW_DELETE_MODAL();

      this.notificationService.showNotification(NOTIFICATION);
    }
  }

  private handleDeleteManyByIdsError(error: any) {
    _debugW(RuleActionsDeleteModalV1.getClassName(), 'handleDeleteManyByIdsError', { error });

    const NOTIFICATION = RULE_ACTIONS_MESSAGES_V1
      .ERROR
      .DELETE_MANY_BY_IDS();

    this.notificationService.showNotification(NOTIFICATION);
    this.eventsService.loadingEmit(false);
    return of();
  }

}
