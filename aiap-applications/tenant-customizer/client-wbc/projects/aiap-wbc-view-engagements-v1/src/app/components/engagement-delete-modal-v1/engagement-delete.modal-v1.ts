/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  BaseModal
} from 'client-shared-views';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  EngagementsServiceV1
} from 'client-services';

import {
  ENGAGEMENTS_MESSAGES,
} from 'client-utils';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-engagement-delete-modal-v1',
  templateUrl: './engagement-delete.modal-v1.html',
  styleUrls: ['./engagement-delete.modal-v1.scss']
})
export class EngagementDeleteModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'EngagementDeleteModalV1';
  }

  _engagementsIds: any = [];
  engagementsIds: any = lodash.cloneDeep(this._engagementsIds);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private engagementsService: EngagementsServiceV1,
  ) {
    super();
  }

  ngOnInit() { }

  ngAfterViewInit(): void { }

  ngOnDestroy() { }

  delete() {
    this.engagementsService.deleteManyByIds(this.engagementsIds)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleDeleteManyByIdsErrors(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugX(`[${EngagementDeleteModalV1.getClassName()}] delete`, response);

        this.notificationService.showNotification(ENGAGEMENTS_MESSAGES.SUCCESS.DELETE_MANY_BY_QUERY);
        this.eventsService.loadingEmit(false);
        this.close();
        this.eventsService.filterEmit(undefined);
      });
  }

  handleDeleteManyByIdsErrors(error: any) {
    _debugX(EngagementDeleteModalV1.getClassName(), 'handleDeleteManyByIdsErrors', { error });

    this.notificationService.showNotification(ENGAGEMENTS_MESSAGES.ERROR.DELETE_MANY_BY_QUERY);
    this.eventsService.loadingEmit(false);
    return of();
  }

  show(engagementsIds: any) {
    if (
      !lodash.isEmpty(engagementsIds)
    ) {
      this.engagementsIds = lodash.cloneDeep(engagementsIds);
      this.superShow();
    } else {
      this.notificationService.showNotification(ENGAGEMENTS_MESSAGES.ERROR.DELETE_MANY_BY_QUERY);
    }
  }
}
