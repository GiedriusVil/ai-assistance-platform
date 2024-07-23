/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  AfterViewInit,
  OnDestroy,
  OnInit
} from '@angular/core';

import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

import * as lodash from 'lodash';

import {
  CLASSIFICATION_CATEGORIES_MESSAGES,
} from '../../messages';

import {
  _debugX
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  ClassificationCategoriesServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-classification-category-delete-modal-v1',
  templateUrl: './classification-category-delete-modal-v1.html',
  styleUrls: ['./classification-category-delete-modal-v1.scss']
})
export class ClassificationCategoryDeleteModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'ClassificationCategoryDeleteModal';
  }

  private _destroyed$: Subject<void> = new Subject();

  isOpen = false;
  category: any;

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private classificationCategoriesService: ClassificationCategoriesServiceV1,
  ) { }

  ngOnInit() { }

  ngAfterViewInit(): void { }

  ngOnDestroy() { }

  handleClassificationCategoryDeleteEvent(event: any) {
    _debugX(ClassificationCategoryDeleteModalV1.getClassName(), 'handleClassificationCategoryDeleteEvent', { this_category: this.category, event });
    const OBSERVABLE = this.classificationCategoriesService.deleteOne(this.category)
    OBSERVABLE.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError(error => this.handleClassificationCategoryDeleteError(error)),
      takeUntil(this._destroyed$)
    ).subscribe((response) => {
      _debugX(ClassificationCategoryDeleteModalV1.getClassName(), '', { response });
      const NOTIFICATION = CLASSIFICATION_CATEGORIES_MESSAGES.SUCCESS.DELETE_ONE;
      this.notificationService.showNotification(NOTIFICATION);
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(undefined);
      this.isOpen = false;
    });
  }

  private handleClassificationCategoryDeleteError(error: any) {
    _debugX(ClassificationCategoryDeleteModalV1.getClassName(), 'handleClassificationCategoryDeleteError', { error });
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = CLASSIFICATION_CATEGORIES_MESSAGES.ERROR.DELETE_ONE;
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  show(category: any) {
    _debugX(ClassificationCategoryDeleteModalV1.getClassName(), 'show', { category });
    if (
      !lodash.isEmpty(category)
    ) {
      this.category = lodash.cloneDeep(category);
      this.isOpen = true;
    }
  }

  close() {
    this.isOpen = false;
  }
}
