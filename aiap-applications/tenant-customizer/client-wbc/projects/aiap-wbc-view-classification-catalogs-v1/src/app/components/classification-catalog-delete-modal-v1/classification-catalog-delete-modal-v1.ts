/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import { HttpErrorResponse } from '@angular/common/http';
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
} from 'client-shared-services';

import {
  _debugX,
} from 'client-shared-utils';

import { ClassificationCatalogsServiceV1 } from 'client-services';

@Component({
  selector: 'aiap-classification-catalog-delete-modal-v1',
  templateUrl: './classification-catalog-delete-modal-v1.html',
  styleUrls: ['./classification-catalog-delete-modal-v1.scss']
})
export class ClassificationCatalogDeleteModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'ClassificationCatalogDeleteModalV1';
  }

  _keys: any = [];

  keys: any = lodash.cloneDeep(this._keys);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private classificationCatalogsService: ClassificationCatalogsServiceV1,
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

  handleDeleteManyByIds() {
    const OBSERVABLE = this.classificationCatalogsService.deleteManyByIds(this.keys);
    OBSERVABLE.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError(error => this.handleDeleteManyByIdsError(error)),
      takeUntil(this._destroyed$)
    ).subscribe((response) => {
      _debugX(ClassificationCatalogDeleteModalV1.getClassName(), 'handleDeleteManyByIds', { response });
      const NOTIFICATION = {
        type: 'success',
        title: 'Classification Catalogs removed!',
        target: '.notification-container',
        duration: 5000
      };
      this.notificationService.showNotification(NOTIFICATION);
      this.eventsService.loadingEmit(false);
      this.close();
    });
  }

  private handleDeleteManyByIdsError(error: any) {
    _debugX(ClassificationCatalogDeleteModalV1.getClassName(), 'handleDeleteManyByIdsError', { error });
    this.eventsService.loadingEmit(false);
    let message;
    if (error instanceof HttpErrorResponse) {
      message = `[${error.status} - ${error.statusText}] ${error.message} - ${JSON.stringify(error.error)}`;
    } else {
      message = `${JSON.stringify(error)}`;
    }
    const NOTIFICATION = {
      type: 'error',
      title: 'Unable delete engagements',
      message: message,
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }


  show(ids: Array<any>) {
    _debugX(ClassificationCatalogDeleteModalV1.getClassName(), 'show', { ids });

    if (!lodash.isEmpty(ids)) {
      this.keys = lodash.cloneDeep(ids);
      this.superShow();
    } else {
      this.notificationService.showNotification({
        type: 'error',
        title: 'No classification catalog selected for removal',
        target: '.notification-container',
        duration: 10000
      });
    }
  }

  close() {
    super.close();
    this.eventsService.filterEmit(undefined);
  }
}
