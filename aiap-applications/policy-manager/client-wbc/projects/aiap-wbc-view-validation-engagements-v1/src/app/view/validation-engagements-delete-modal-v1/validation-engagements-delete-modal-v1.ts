/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  NotificationService
} from 'carbon-components-angular';

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import {
  EventsServiceV1,
} from 'client-shared-services';

import {
  BaseModal
} from 'client-shared-views';

import {
  VALIDATION_ENGAGEMENTS_MESSAGES_V1,
  ValidationEngagementsServiceV1,
} from 'client-services';


@Component({
  selector: 'aiap-wbc-validation-engagements-delete-modal-v1',
  templateUrl: './validation-engagements-delete-modal-v1.html',
  styleUrls: ['./validation-engagements-delete-modal-v1.scss']
})
export class ValidationEngagementsDeleteModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'ValidationEngagementsDeleteModalV1';
  }

  _engagementsKeys: string[] = [];
  engagementsKeys: string[] = lodash.cloneDeep(this._engagementsKeys);

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationService,
    private validationEngagementsService: ValidationEngagementsServiceV1,
  ) {
    super();
  }

  ngOnInit() { }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit() { }

  show(engagementsKeys: string[]) {
    if (
      !lodash.isEmpty(engagementsKeys) &&
      lodash.isArray(engagementsKeys)
    ) {
      this.engagementsKeys = lodash.cloneDeep(engagementsKeys);
      this.superShow();
    } else {
      this.notificationService.showNotification(VALIDATION_ENGAGEMENTS_MESSAGES_V1.ERROR.SHOW_VALIDATION_ENGAGEMENTS_DELETE_MODAL());
    }
  }

  delete(): void {
    this.validationEngagementsService.deleteManyByKeys(this.engagementsKeys)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleValidationEngagementsDeleteError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugW(ValidationEngagementsDeleteModalV1.getClassName(), 'handleShowValidationEngagementsDeleteModal', { response });
        this.eventsService.loadingEmit(false)
        this.notificationService.showNotification(VALIDATION_ENGAGEMENTS_MESSAGES_V1.SUCCESS.DELETE_MANY_BY_KEYS());
        this.close();
        this.eventsService.filterEmit(null);
      });
  }

  handleValidationEngagementsDeleteError(error: any): Observable<void> {
    this.eventsService.loadingEmit(false);
    _errorW(ValidationEngagementsDeleteModalV1.getClassName(), 'handleValidationEngagementsDeleteError', { error });
    this.notificationService.showNotification(VALIDATION_ENGAGEMENTS_MESSAGES_V1.ERROR.DELETE_MANY_BY_KEYS());
    this.isOpen = false;
    return of();
  }
}
