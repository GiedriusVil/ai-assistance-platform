/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  of,
  Subject
} from 'rxjs';
import {
  catchError,
  takeUntil,
  tap
} from 'rxjs/operators';

import * as ramda from 'ramda';
import * as lodash from 'lodash';



import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  QueryServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  CLASSIFICATION_CATEGORIES_MESSAGES
} from '../../messages';

import {
  CLASSIFICATION_CATEGORY_ENUM
} from '../../enumerations';

import {
  ClassificationCategoriesServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-classification-category-save-modal-v1',
  templateUrl: './classification-category-save-modal-v1.html',
  styleUrls: ['./classification-category-save-modal-v1.scss'],
})
export class ClassificationCategorySaveModalV1 implements OnInit, AfterViewInit, OnDestroy {

  static getClassName() {
    return 'ClassificationCategorySaveModal';
  }

  private _destroyed$: Subject<void> = new Subject();

  isOpen = false;

  _state = {
    category: {
      catalogId: undefined,
      segmentId: undefined,
      familyId: undefined,
      classId: undefined,
      subClassId: undefined,
      code: undefined,
      title: {
        en: undefined
      },
      type: undefined,
      synonyms: []
    }
  }

  state: any = lodash.cloneDeep(this._state);

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private classificationCategoriesService: ClassificationCategoriesServiceV1,
  ) { }

  ngOnInit() { }

  ngAfterViewInit() { }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  private __sanitizedCategory() {
    const STATE_CATEGORY = ramda.path(['category'], this.state);
    const RET_VAL = lodash.cloneDeep(STATE_CATEGORY);
    const CATEGORY_TYPE = ramda.path(['type'], RET_VAL);
    if (
      lodash.isString(CATEGORY_TYPE) &&
      !lodash.isEmpty(CATEGORY_TYPE)
    ) {
      switch (CATEGORY_TYPE) {
        case 'SEGMENT':
          this.__sanitizeSegment(RET_VAL);
          break;
        case 'FAMILY':
          this.__sanitizeFamily(RET_VAL);
          break;
        case 'CLASS':
          this.__sanitizeClass(RET_VAL);
          break;
        case 'SUB_CLASS':
          this.__sanitizeSubClass(RET_VAL);
          break;
        default:
          break;
      }
    }

    return RET_VAL;
  }

  private __sanitizeSegment(category: any) {
    const ID = ramda.path(['segmentId'], category);
    delete category.segmentId;
    category.id = ID;
  }

  private __sanitizeFamily(category: any) {
    const ID = ramda.path(['familyId'], category);
    delete category.familyId;
    category.id = ID;
  }

  private __sanitizeClass(category: any) {
    const ID = ramda.path(['classId'], category);
    delete category.classId;
    category.id = ID;
  }

  private __sanitizeSubClass(category: any) {
    const ID = ramda.path(['subClassId'], category);
    delete category.subClassId;
    category.id = ID;
  }


  handleClassificationCategorySaveEvent(event) {
    const SANITIZED_CATEGORY = this.__sanitizedCategory();
    _debugX(ClassificationCategorySaveModalV1.getClassName(), 'handleClassificationCategorySaveEvent', {
      event: event,
      this_state: this._state,
      SANITIZED_CATEGORY: SANITIZED_CATEGORY
    });
    this.classificationCategoriesService.saveOne(SANITIZED_CATEGORY)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleClassificationCategorySaveError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response) => {
        _debugX(ClassificationCategorySaveModalV1.getClassName(), 'handleClassificationCategorySaveEvent', { response });
        this.notificationService.showNotification(CLASSIFICATION_CATEGORIES_MESSAGES.SUCCESS.SAVE_CLASSIFICATION_CATEGORY);
        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(null);
        this.isOpen = false;
      });
  }

  handleClassificationCategorySaveError(error: any) {
    _errorX(ClassificationCategorySaveModalV1.getClassName(), 'handleClassificationCategorySaveError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(CLASSIFICATION_CATEGORIES_MESSAGES.ERROR.SAVE_CLASSIFICATION_CATEGORY);
    return of();
  }

  isCategoryIdVisible(type: any) {
    let retVal = false;
    const STATE_TYPE = this.state?.category?.type;
    if (
      lodash.isString(STATE_TYPE) &&
      !lodash.isEmpty(STATE_TYPE)
    ) {
      switch (STATE_TYPE) {
        case CLASSIFICATION_CATEGORY_ENUM.SEGMENT:
          retVal = [
            CLASSIFICATION_CATEGORY_ENUM.SEGMENT
          ].includes(type);
          break;
        case CLASSIFICATION_CATEGORY_ENUM.FAMILY:
          retVal = [
            CLASSIFICATION_CATEGORY_ENUM.SEGMENT,
            CLASSIFICATION_CATEGORY_ENUM.FAMILY
          ].includes(type);
          break;
        case CLASSIFICATION_CATEGORY_ENUM.CLASS:
          retVal = [
            CLASSIFICATION_CATEGORY_ENUM.SEGMENT,
            CLASSIFICATION_CATEGORY_ENUM.FAMILY,
            CLASSIFICATION_CATEGORY_ENUM.CLASS
          ].includes(type);
          break;
        case CLASSIFICATION_CATEGORY_ENUM.SUB_CLASS:
          retVal = [
            CLASSIFICATION_CATEGORY_ENUM.SEGMENT,
            CLASSIFICATION_CATEGORY_ENUM.FAMILY,
            CLASSIFICATION_CATEGORY_ENUM.CLASS,
            CLASSIFICATION_CATEGORY_ENUM.SUB_CLASS
          ].includes(type);
          break;
        default:
          break;
      }
    }

    return retVal;
  }

  show(category: any) {
    const NEW_STATE: any = lodash.cloneDeep(this._state);
    if (
      !lodash.isEmpty(category)
    ) {
      NEW_STATE.category = category;
    }
    this.__ensureTitleExistance(NEW_STATE.category);
    this.__ensureExplicitIdsDeclaration(NEW_STATE.category);
    _debugX(ClassificationCategorySaveModalV1.getClassName(), 'handleClassificationCategorySaveEvent', { NEW_STATE });
    this.state = NEW_STATE;
    this.isOpen = true;
  }

  private __ensureTitleExistance(category: any) {
    const TITLE = ramda.path(['title'], category);
    if (
      lodash.isEmpty(TITLE)
    ) {
      category.title = {};
    }
    const TITLE_EN = ramda.path(['title', 'en'], category);
    if (
      lodash.isEmpty(TITLE_EN)
    ) {
      category.title.en = undefined;
    }
  }

  private __ensureExplicitIdsDeclaration(category: any): any {
    const CATEGORY_TYPE = ramda.path(['type'], category);
    if (
      !lodash.isEmpty(CATEGORY_TYPE) &&
      lodash.isString(CATEGORY_TYPE)
    ) {
      switch (CATEGORY_TYPE) {
        case 'SEGMENT':
          this.__ensureExplicitIdDeclaration(category, 'segmentId');
          break;
        case 'FAMILY':
          this.__ensureExplicitIdDeclaration(category, 'familyId');
          break;
        case 'CLASS':
          this.__ensureExplicitIdDeclaration(category, 'classId');
          break;
        case 'SUB_CLASS':
          this.__ensureExplicitIdDeclaration(category, 'subClassId');
          break;
        default:
          break;
      }
    }
  }

  private __ensureExplicitIdDeclaration(category: any, idField: string) {
    const ID = category?.id;
    category[idField] = ID;
  }


  close() {
    this.isOpen = false;
  }
}
