/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  BaseModalV1
} from 'client-shared-views';

import {
  EventsServiceV1,
  NotificationServiceV2,
  AiServicesChangeRequestServiceV1
} from 'client-shared-services';

import {
  CHANGE_REQUEST_MESSAGES,
} from 'client-utils';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-ai-services-change-request-delete-modal-v1',
  templateUrl: './ai-services-change-request-delete-modal-v1.html',
  styleUrls: ['./ai-services-change-request-delete-modal-v1.scss']
})
export class AiServicesChangeRequestDeleteModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiServicesChangeRequestDeleteModalV1';
  }

  _ids: Array<any> = [];
  ids: any = lodash.cloneDeep(this._ids);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private aiServicesChangeRequestServiceV1: AiServicesChangeRequestServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    //
  }

  delete() {
    _debugX(AiServicesChangeRequestDeleteModalV1.getClassName(), 'delete', { this_ids: this.ids });
    this.aiServicesChangeRequestServiceV1.deleteManyByIds(this.ids)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleDeleteManyByIdsErrors(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugX(AiServicesChangeRequestDeleteModalV1.getClassName(), 'delete', { response });
        this.notificationService.showNotification(CHANGE_REQUEST_MESSAGES.SUCCESS.DELETE_MANY_BY_IDS);
        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(null);
        this.close();
      });
  }

  handleDeleteManyByIdsErrors(error: any) {
    _debugX(AiServicesChangeRequestDeleteModalV1.getClassName(), 'handleDeleteManyByIdsErrors', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(CHANGE_REQUEST_MESSAGES.ERROR.DELETE_MANY_BY_IDS);
    return of();
  }

  show(ids: any) {
    _debugX(AiServicesChangeRequestDeleteModalV1.getClassName(), 'show', { ids });
    if (
      !lodash.isEmpty(ids)
    ) {
      this.ids = lodash.cloneDeep(ids);
      this.superShow();
    } else {
      this.notificationService.showNotification(CHANGE_REQUEST_MESSAGES.ERROR.MISSING_MANY);
    }
  }

}
