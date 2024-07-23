/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
} from '@angular/core';

import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  BaseModal
} from 'client-shared-views';

import {
  CLASSIFIER_MESSAGES,
} from 'client-utils';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  ClassifierServiceV1,
} from 'client-services';

@Component({
  selector: 'aca-classifier-model-delete-modal',
  templateUrl: './classifier-model-delete-modal-v1.html',
  styleUrls: ['./classifier-model-delete-modal-v1.scss']
})
export class ClassifierModelDeleteModal extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'ClassifierModelDeleteModal';
  }

  _models: any = [];
  models: any = lodash.cloneDeep(this._models);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private classifierService: ClassifierServiceV1,
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
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  handleDeleteManyByIds() {
    this.classifierService.deleteManyByIds(this.models)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleDeleteManyByIdsError(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response) => {
        _debugX(ClassifierModelDeleteModal.getClassName(), 'handleDeleteManyByIds', { response });

        this.notificationService.showNotification(CLASSIFIER_MESSAGES.SUCCESS.DELETE_MANY_BY_QUERY);
        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(undefined);
        this.close();
      });
  }

  handleDeleteManyByIdsError(error: any) {
    _debugX(ClassifierModelDeleteModal.getClassName(), 'handleDeleteManyByIdsError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(CLASSIFIER_MESSAGES.ERROR.DELETE_MANY_BY_QUERY);
    return of();
  }


  show(modelIds: Array<any>) {
    _debugX(ClassifierModelDeleteModal.getClassName(), 'show', { modelIds });
    if (!lodash.isEmpty(modelIds)) {
      this.models = lodash.cloneDeep(modelIds);
      this.superShow();
    } else {
      this.notificationService.showNotification(CLASSIFIER_MESSAGES.ERROR.SHOW_CLASSIFIER_MODEL_DELETE_MODAL);
    }
  }
}
