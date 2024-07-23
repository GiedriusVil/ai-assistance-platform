/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, AfterViewInit, Input } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  EventsServiceV1,
  ClassificationRulesClassificationsService
} from 'client-services';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  TranslateHelperServiceV1
} from 'client-shared-services';

@Component({
  selector: 'aca-classification-rules-classification-delete-modal-v1',
  templateUrl: './classification-rules-classification-delete-modal-v1.html',
  styleUrls: ['./classification-rules-classification-delete-modal-v1.scss']
})
export class ClassificationRulesClassificationDeleteModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'ClassificationRulesClassificationDeleteModalV1';
  }

  private _destroyed$: Subject<void> = new Subject();

  isOpen = false;

  _classificationIds: any = [];
  classificationIds: any = lodash.cloneDeep(this._classificationIds);

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private classificationRulesClassificationService: ClassificationRulesClassificationsService,
    private translateService: TranslateHelperServiceV1
  ) { }

  ngOnInit() { }

  ngAfterViewInit(): void { }

  ngOnDestroy() { }

  delete() {
    this.classificationRulesClassificationService.deleteManyByIds(this.classificationIds)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.hanldeDeleteManyByIdsErrors(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugX(ClassificationRulesClassificationDeleteModalV1.getClassName(), 'delete', { response });
        const NOTIFICATION = {
          type: 'success',
          title: this.translateService.instant('classification_rules.delete_modal.notification.success.title'),
          target: '.notification-container',
          duration: 5000
        };
        this.notificationService.showNotification(NOTIFICATION);
        this.eventsService.loadingEmit(false);
        this.isOpen = false;
        this.eventsService.classificationRuleClassificationsEmit(undefined);
      });
  }

  hanldeDeleteManyByIdsErrors(error: any) {
    _debugX(ClassificationRulesClassificationDeleteModalV1.getClassName(), 'hanldeDeleteManyByIdsErrors', { error });
    this.eventsService.loadingEmit(false);
    let message;
    if (error instanceof HttpErrorResponse) {
      message = `[${error.status} - ${error.statusText}] ${error.message} - ${JSON.stringify(error.error)}`;
    } else {
      message = `${JSON.stringify(error)}`;
    }
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('classification_rules.delete_modal.notification.error.title'),
      message: message,
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  show(classificationIds: any) {
    if (
      !lodash.isEmpty(classificationIds)
    ) {
      this.classificationIds = lodash.cloneDeep(classificationIds);
      this.isOpen = true;
    } else {
      const NOTIFICATION = {
        type: 'error',
        title: this.translateService.instant('classification_rules.delete_modal.notification.error.title'),
        target: '.notification-container',
        duration: 10000
      };
      this.notificationService.showNotification(NOTIFICATION);
    }
  }

  close() {
    this.isOpen = false;
  }

}
