/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  AI_SERVICES_MESSAGES,
} from 'client-utils';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  AiServicesServiceV1,
} from 'client-services';

import { BaseModal } from 'client-shared-views';

@Component({
  selector: 'aiap-ai-service-delete-modal-v1',
  templateUrl: './ai-service-delete-modal-v1.html',
  styleUrls: ['./ai-service-delete-modal-v1.scss']
})
export class AiServiceDeleteModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiServiceDeleteModalV1';
  }

  _ids: Array<any> = [];
  ids: Array<any>;

  constructor(
    private notificationService: NotificationServiceV2,
    private aiServicesService: AiServicesServiceV1,
    private eventsService: EventsServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    //
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit(): void {
    //
  }

  show(ids: any) {
    if (
      lodash.isArray(ids) &&
      !lodash.isEmpty(ids)
    ) {
      this.ids = lodash.cloneDeep(ids);
      this.superShow();
    } else {
      this.notificationService.showNotification(AI_SERVICES_MESSAGES.ERROR.SHOW_DELETE_MODAL);
    }
  }

  delete(): void {
    _debugX(AiServiceDeleteModalV1.getClassName(), 'delete', { this_ids: this.ids });
    this.aiServicesService.deleteManyByIds(this.ids)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleDeleteManyByIds(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response) => {
        _debugX(AiServiceDeleteModalV1.getClassName(), 'delete', { response });
        this.notificationService.showNotification(AI_SERVICES_MESSAGES.SUCCESS.DELETE_MANY_BY_IDS);
        this.close();
        this.eventsService.filterEmit(null);
      });
  }

  handleDeleteManyByIds(error: any): Observable<void> {
    this.eventsService.loadingEmit(false);
    _errorX(AiServiceDeleteModalV1.getClassName(), 'handleDeleteOneByIdError', { error });
    this.notificationService.showNotification(AI_SERVICES_MESSAGES.ERROR.DELETE_MANY_BY_IDS);
    return of();
  }

}
