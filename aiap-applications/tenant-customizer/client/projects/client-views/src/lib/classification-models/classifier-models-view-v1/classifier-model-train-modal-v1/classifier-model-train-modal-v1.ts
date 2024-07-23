/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
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
  selector: 'aca-classifier-model-train-modal',
  templateUrl: './classifier-model-train-modal-v1.html',
  styleUrls: ['./classifier-model-train-modal-v1.scss']
})
export class ClassifierModelTrainModal extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'ClassifierModelTrainModal';
  }

  _model: any = {
    id: undefined,
    name: undefined,
  }
  model: any = lodash.cloneDeep(this._model);

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

  train() {
    const MODEL_ID = this.model?.id;
    _debugX(ClassifierModelTrainModal.getClassName(), 'train',
      {
        MODEL_ID,
      });

    this.classifierService.trainOneById(MODEL_ID)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleTrainOneByIdError(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugX(ClassifierModelTrainModal.getClassName(), 'train',
          {
            response,
          });

        this.notificationService.showNotification(CLASSIFIER_MESSAGES.SUCCESS.TRAIN_ONE_BY_ID);
        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(undefined);
        this.close();
      });
  }


  handleTrainOneByIdError(error: any) {
    _debugX(ClassifierModelTrainModal.getClassName(), 'handleTrainOneByIdError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(CLASSIFIER_MESSAGES.ERROR.TRAIN_ONE_BY_ID);
    return of();
  }

  show(model: any) {
    _debugX(ClassifierModelTrainModal.getClassName(), 'show', { model });
    if (
      !lodash.isEmpty(model)
    ) {
      this.model = lodash.cloneDeep(model);
      this.superShow();
    } else {
      this.notificationService.showNotification(CLASSIFIER_MESSAGES.ERROR.SHOW_CLASSIFIER_MODEL_TRAIN_MODAL);
    }
  }
}
