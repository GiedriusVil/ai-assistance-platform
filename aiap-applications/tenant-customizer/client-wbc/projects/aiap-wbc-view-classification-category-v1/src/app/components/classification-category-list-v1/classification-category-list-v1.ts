/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/

import { Component, Input, OnInit, EventEmitter, Output, OnDestroy, AfterViewInit, OnChanges } from '@angular/core';

import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of, Subject } from 'rxjs';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  CLASSIFICATION_CATEGORIES_MESSAGES
} from '../../messages';

import {
  CLASSIFICATION_CATEGORY_ENUM
} from '../../enumerations';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  ClassificationCategoriesServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-classification-category-list-v1',
  templateUrl: './classification-category-list-v1.html',
  styleUrls: ['./classification-category-list-v1.scss'],
})
export class ClassificationCategoryListV1 implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'ClassificationCategoryList';
  }

  private _destroyed$: Subject<void> = new Subject();

  @Input() label: string;
  @Input() type: string;

  @Input() selection: any;

  @Output() onSearch = new EventEmitter<any>();
  @Output() onShowSavePlace = new EventEmitter<any>();
  @Output() onShowDeletePlace = new EventEmitter<any>();
  @Output() onSelect = new EventEmitter<any>();

  _state = {
    categories: [],
    categoriesTotal: 0,
  }
  state: any = lodash.cloneDeep(this._state);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private classificationCategoriesService: ClassificationCategoriesServiceV1
  ) { }

  ngOnInit() {
    // this.addFilterEventHandler();
    // this.eventsService.filterEmit({});
  }

  ngOnChanges() {
    _debugX(ClassificationCategoryListV1.getClassName(), `ngOnChanges`, {
      this_label: this.label,
      this_type: this.type,
      this_selection: this.selection,
      this_state: this.state
    });
    this.loadCategories(this.type, this.retrieveQuery());
  }

  ngAfterViewInit() { }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  categoriesTotalQty() {
    const RET_VAL = this.state.categoriesTotal;
    return RET_VAL;
  }

  private retrieveQuery() {
    const CATALOG_ID = this.selection?.catalogId;
    const SEGMENT_ID = this.selection?.segmentId;
    const SEGMENT_SEARCH = this.selection?.segmentSearch;
    const FAMILY_ID = this.selection?.familyId;
    const FAMILY_SEARCH = this.selection?.familySearch;
    const CLASS_ID = this.selection?.classId;
    const CLASS_SEARCH = this.selection?.classSearch;
    const SUB_CLASS_SEARCH = this.selection?.subClassSearch;

    const RET_VAL = {
      filter: {
        catalogId: CATALOG_ID,
        segmentId: SEGMENT_ID,
        segmentSearch: SEGMENT_SEARCH,
        familyId: FAMILY_ID,
        familySearch: FAMILY_SEARCH,
        classId: CLASS_ID,
        classSearch: CLASS_SEARCH,
        subClassSearch: SUB_CLASS_SEARCH,
      },
      sort: {
        field: 'id',
        direction: 'asc',
      },
      pagination: {
        page: 1,
        size: 10
      }
    }
    return RET_VAL;
  }

  private loadCategories(type: any, query: any) {
    const OBSERBABLE = this.classificationCategoriesService.findManyByQuery(type, query);
    OBSERBABLE.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleFindManyByQueryError(error))
    ).subscribe((response: any) => {
      this.assignResponseToCategories(response);
      // 2021-12-06 [LEGO] [START] Brings a lot of noise!!! Turning them off for now
      // const NOTIFICATION = CLASSIFICATION_CATEGORIES_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY(this.type);
      // this.notificationService.showNotification(NOTIFICATION);
      // 2021-12-06 [LEGO] [END] Brings a lot of noise!!! Turning them off for now
      this.eventsService.loadingEmit(false);
    });
  }

  private assignResponseToCategories(response: any) {
    const NEW_STATE = lodash.cloneDeep(this._state);
    const CATEGORIES = ramda.pathOr([], ['items'], response);
    const CATEGORIES_TOTAL = ramda.pathOr(0, ['total'], response);
    NEW_STATE.categories = CATEGORIES;
    console.log('NEW_STATE.categories', NEW_STATE.categories)
    NEW_STATE.categoriesTotal = CATEGORIES_TOTAL;
    this.state = NEW_STATE;
  }

  handleCategoryAddEvent(event: any) {
    _debugX(ClassificationCategoryListV1.getClassName(), 'handleCategoryAddEvent', { event });
    const CATALOG_ID = this.selection?.catalogId;
    const SEGMENT_ID = this.selection?.segmentId;
    const FAMILY_ID = this.selection?.familyId;
    const CLASS_ID = this.selection?.classId;
    const EVENT = {
      type: 'ADD_CATEGORY',
      data: {
        type: this.type,
        catalogId: CATALOG_ID,
        segmentId: SEGMENT_ID,
        familyId: FAMILY_ID,
        classId: CLASS_ID,
        subClassId: undefined,
      }
    };
    this.onShowSavePlace.emit(EVENT);
  }

  handleCategoryEditEvent(event: any, category: any) {
    _debugX(ClassificationCategoryListV1.getClassName(), 'handleCategoryEditEvent', { event, category });
    const EVENT = {
      type: 'ADD_CATEGORY',
      data: category
    };
    this.onShowSavePlace.emit(EVENT);
    event.stopPropagation();
  }

  handleCategoryDeleteEvent(event: any, category: any) {
    _debugX(ClassificationCategoryListV1.getClassName(), 'handleCategoryDeleteEvent', { event, category });
    this.onShowDeletePlace.emit(category);
    event.stopPropagation();
  }

  isBtnAddEnabled() {
    let retVal = false;
    switch (this.type) {
      case CLASSIFICATION_CATEGORY_ENUM.SEGMENT:
        retVal = true;
        break;
      case CLASSIFICATION_CATEGORY_ENUM.FAMILY:
        if (
          !lodash.isEmpty(this.selection?.segmentId)
        ) {
          retVal = true;
        }
        break;
      case CLASSIFICATION_CATEGORY_ENUM.CLASS:
        if (
          !lodash.isEmpty(this.selection?.segmentId) &&
          !lodash.isEmpty(this.selection?.familyId)
        ) {
          retVal = true;
        }
        break;
      case CLASSIFICATION_CATEGORY_ENUM.SUB_CLASS:
        if (
          !lodash.isEmpty(this.selection?.segmentId) &&
          !lodash.isEmpty(this.selection?.familyId) &&
          !lodash.isEmpty(this.selection?.classId)
        ) {
          retVal = true;
        }
        break;
      default:
        break;
    }
    return retVal;
  }

  handleClassificationCategoryClickEvent(event, category) {
    const SELECTION_EVENT: any = {
      categoryType: this.type,
    };
    let isSelect = false;
    const CATEGORY_ID = category?.id;

    switch (this.type) {
      case CLASSIFICATION_CATEGORY_ENUM.SEGMENT:
        isSelect = !(this.selection?.segmentId === CATEGORY_ID);
        break;
      case CLASSIFICATION_CATEGORY_ENUM.FAMILY:
        isSelect = !(this.selection?.familyId === CATEGORY_ID);
        break;
      case CLASSIFICATION_CATEGORY_ENUM.CLASS:
        isSelect = !(this.selection?.classId === CATEGORY_ID);
        break;
      case CLASSIFICATION_CATEGORY_ENUM.SUB_CLASS:
        isSelect = !(this.selection?.subClassId === CATEGORY_ID);
        break;
      default:
        break;
    }
    if (isSelect) {
      SELECTION_EVENT.category = category;
    }
    _debugX(ClassificationCategoryListV1.getClassName(), 'handleClassificationCategoryClickEvent', { this_selection: this.selection, event, category });
    this.onSelect.emit(SELECTION_EVENT)
  }

  getClassificationCategoryNgClass(category) {
    const RET_VAL = ['bx--structured-list-row'];
    let isSelected = false;
    const CATEGORY_ID = category?.id;
    switch (this.type) {
      case CLASSIFICATION_CATEGORY_ENUM.SEGMENT:
        isSelected = this.selection?.segmentId === CATEGORY_ID;
        break;
      case CLASSIFICATION_CATEGORY_ENUM.FAMILY:
        isSelected = this.selection?.familyId === CATEGORY_ID;
        break;
      case CLASSIFICATION_CATEGORY_ENUM.CLASS:
        isSelected = this.selection?.classId === CATEGORY_ID;
        break;
      case CLASSIFICATION_CATEGORY_ENUM.SUB_CLASS:
        isSelected = this.selection?.subClassId === CATEGORY_ID;
        break;
      default:
        break;
    }
    if (isSelected) {
      RET_VAL.push('classification-category-selected');
    } else {
      RET_VAL.push('classification-category');
    }
    return RET_VAL;
  }

  handleSearchEvent(event: any) {
    _errorX(ClassificationCategoryListV1.getClassName(), `handleSearchEvent`, { event });
    const SEARCH_EVENT = {
      type: this.type,
      search: event,
    }
    this.onSearch.emit(SEARCH_EVENT);
  }

  handleSearchClearEvent(event: any) {
    _errorX(ClassificationCategoryListV1.getClassName(), `handleSearchClearEvent`, { event });
    const SEARCH_EVENT = {
      type: this.type,
      search: undefined,
    }
    this.onSearch.emit(SEARCH_EVENT);
  }

  private handleFindManyByQueryError(error: any) {
    _errorX(ClassificationCategoryListV1.getClassName(), `handleFindManyByQueryError`, { error });
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = CLASSIFICATION_CATEGORIES_MESSAGES.ERROR.FIND_MANY_BY_QUERY(this.type);
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

}
