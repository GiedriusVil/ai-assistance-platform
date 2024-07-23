/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  OnDestroy
} from '@angular/core';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  _debugX,
} from 'client-shared-utils';

import {
  ActivatedRouteServiceV1,
  SessionServiceV1,
  EventsServiceV1,
  QueryServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  BaseViewV1
} from 'client-shared-views';

import {
  CLASSIFICATION_CATEGORY_ENUM,
} from '../enumerations';

import {
  OUTLETS
} from 'client-utils'

import {
  ClassificationCatalogsServiceV1,
} from 'client-services';

import {
  ClassificationCategoryImportModalV1,
  ClassificationCategorySaveModalV1,
  ClassificationCategoryDeleteModalV1
} from '../components'


@Component({
  selector: 'aiap-classification-category-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss'],
})
export class ClassificationCategoryViewV1 extends BaseViewV1 implements OnInit, AfterViewInit, OnDestroy {

  static getClassName() {
    return 'ClassificationCatalogView';
  }

  @ViewChild('classificationCategorySaveModal') classificationCategorySaveModal: ClassificationCategorySaveModalV1;
  @ViewChild('classificationCategoryDeleteModal') classificationCategoryDeleteModal: ClassificationCategoryDeleteModalV1;
  @ViewChild('classificationCategoryImportModal') classificationCategoryImportModal: ClassificationCategoryImportModalV1;

  outlet = OUTLETS.tenantCustomizer;

  _selection: any = {
    catalogId: undefined,
    segmentId: undefined,
    segmentSearch: undefined,
    familyId: undefined,
    familySearch: undefined,
    classId: undefined,
    classSearch: undefined,
    subClassId: undefined,
    subClassSearch: undefined,
  }

  _catalogDetails: any = {};

  selection: any = lodash.cloneDeep(this._selection);
  catalogDetails: any = lodash.cloneDeep(this._catalogDetails);

  constructor(
    private ActivatedRouteServiceV1: ActivatedRouteServiceV1,
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private catalogService: ClassificationCatalogsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.subscribeToQueryParams();
  }
  subscribeToQueryParams() {
    this.ActivatedRouteServiceV1.queryParams()
      .subscribe((params: any) => {
        _debugX(ClassificationCategoryViewV1.getClassName(), 'subscribeToQueryParams', { params: params, this_selection: this.selection });
        this.retrieveCatalogDetails(params.id);
        this.refreshState(params);
      });
    this.eventsService.filterEmitter.subscribe((event: any) => {
      const NEW_SELECTION = lodash.cloneDeep(this.selection);
      NEW_SELECTION.id = this.selection?.catalogId;
      this.refreshState(NEW_SELECTION);
    });
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngAfterViewInit() {
    //
  }

  retrieveCatalogDetails(id) {
    this.catalogDetails = this.catalogService.findOneById(id).subscribe((response: any) => {
      this.catalogDetails = response;
    });
  }

  refreshState(params: any) {
    const NEW_SELECTION = lodash.cloneDeep(this._selection);

    NEW_SELECTION.catalogId = params?.id;
    NEW_SELECTION.segmentId = params?.segmentId;
    NEW_SELECTION.segmentSearch = params?.segmentSearch;
    NEW_SELECTION.familyId = params?.familyId;
    NEW_SELECTION.familySearch = params?.familySearch;
    NEW_SELECTION.classId = params?.classId;
    NEW_SELECTION.classSearch = params?.classSearch;
    NEW_SELECTION.subClassId = params?.subClassId;
    NEW_SELECTION.subClassSearch = params?.subClassSearch;

    this.selection = NEW_SELECTION;
    _debugX(ClassificationCategoryViewV1.getClassName(), 'loadCatalog -> result', { params: params, this_selection: this.selection });
  }

  handleCategoryShowDeletePlaceEvent(event) {
    _debugX(ClassificationCategoryViewV1.getClassName(), `handleCategoryShowDeletePlaceEvent`, { event });
    this.classificationCategoryDeleteModal.show(event);
  }

  handleClassificationCategoryShowEvent(event: any) {
    const CATEGORY = ramda.path(['data'], event);
    _debugX(ClassificationCategoryViewV1.getClassName(), 'handleClassificationCategoryShowEvent', { event, CATEGORY });
    this.classificationCategorySaveModal.show(CATEGORY);
  }

  handleClassificationCategoryImportClickEvent(event: any) {
    _debugX(ClassificationCategoryViewV1.getClassName(), 'handleClassificationCatalogImportClickEvent', { event, this_selection: this.selection });
    this.classificationCategoryImportModal.show(this.selection?.catalogId);
  }

  handleCategorySelectEvent(event) {
    _debugX(ClassificationCategoryViewV1.getClassName(), `handleCategorySelectEvent`, { event });
    const CATEGORY_TYPE = ramda.path(['categoryType'], event);
    const CATEGORY = ramda.path(['category'], event);
    const NEW_SELECTION = lodash.cloneDeep(this.selection);
    if (
      lodash.isString(CATEGORY_TYPE) &&
      !lodash.isEmpty(CATEGORY_TYPE)
    ) {
      switch (CATEGORY_TYPE) {
        case 'SEGMENT':
          this.handleSegmentSelectionEvent(NEW_SELECTION, CATEGORY);
          break;
        case 'FAMILY':
          this.handleFamilySelectionEvent(NEW_SELECTION, CATEGORY);
          break;
        case 'CLASS':
          this.handleClassSelectionEvent(NEW_SELECTION, CATEGORY);
          break;
        case 'SUB_CLASS':
          this.handleSubClassSelectionEvent(NEW_SELECTION, CATEGORY);
          break;
        default:
          break;
      }
    }
  }

  handleSearchEvent(event: any) {
    _debugX(ClassificationCategoryViewV1.getClassName(), `handleFamilySelectionEvent`, { this_selection: this.selection, event: event });
    const CATEGORY_TYPE = event?.type;
    if (
      lodash.isString(CATEGORY_TYPE) &&
      !lodash.isEmpty(CATEGORY_TYPE)
    ) {
      switch (CATEGORY_TYPE) {
        case CLASSIFICATION_CATEGORY_ENUM.SEGMENT:
          this.handleSegmentSearchEvent(event);
          break;
        case CLASSIFICATION_CATEGORY_ENUM.FAMILY:
          this.handleFamilySearchEvent(event);
          break;
        case CLASSIFICATION_CATEGORY_ENUM.CLASS:
          this.handleClasSearchEvent(event);
          break;
        case CLASSIFICATION_CATEGORY_ENUM.SUB_CLASS:
          this.handleSubClassSearchEvent(event);
          break;
        default:
          break;
      }
    }
  }

  private handleSegmentSearchEvent(event: any) {
    const NEW_SELECTION = lodash.cloneDeep(this.selection);
    NEW_SELECTION.segmentSearch = event?.search;
    this.selection = NEW_SELECTION;
    _debugX(ClassificationCategoryViewV1.getClassName(), `handleSegmentSearchEvent`, { this_selection: this.selection, event: event });
  }

  private handleFamilySearchEvent(event: any) {
    const NEW_SELECTION = lodash.cloneDeep(this.selection);
    NEW_SELECTION.familySearch = event?.search;
    this.selection = NEW_SELECTION;
    _debugX(ClassificationCategoryViewV1.getClassName(), `handleFamilySearchEvent`, { this_selection: this.selection, event: event });
  }

  private handleClasSearchEvent(event: any) {
    const NEW_SELECTION = lodash.cloneDeep(this.selection);
    NEW_SELECTION.classSearch = event?.search;
    this.selection = NEW_SELECTION;
    _debugX(ClassificationCategoryViewV1.getClassName(), `handleClasSearchEvent`, { this_selection: this.selection, event: event });
  }

  private handleSubClassSearchEvent(event: any) {
    const NEW_SELECTION = lodash.cloneDeep(this.selection);
    NEW_SELECTION.subClassSearch = event?.search;
    this.selection = NEW_SELECTION;
    _debugX(ClassificationCategoryViewV1.getClassName(), `handleSubClassSearchEvent`, { this_selection: this.selection, event: event });
  }

  isShowSavePlaceAllowed() {
    return this.sessionService.isActionAllowed({ action: 'classification-catalogs.view.edit' });
  }

  private handleSegmentSelectionEvent(selection: any, category: any) {
    const SEGMENT_ID = ramda.path(['id'], category);
    selection.segmentId = SEGMENT_ID;
    selection.familyId = undefined;
    selection.classId = undefined;
    selection.subClassId = undefined;
    this.selection = selection;
    _debugX(ClassificationCategoryViewV1.getClassName(), `handleSegmentSelectionEvent`, { this_selection: this.selection, category: category });
  }

  private handleFamilySelectionEvent(selection: any, category: any) {
    const SEGMENT_ID = ramda.path(['segmentId'], selection);
    const FAMILY_ID = ramda.path(['id'], category);

    selection.segmentId = SEGMENT_ID;
    selection.familyId = FAMILY_ID;
    selection.classId = undefined;
    selection.subClassId = undefined;

    this.selection = selection;
    _debugX(ClassificationCategoryViewV1.getClassName(), `handleFamilySelectionEvent`, { this_selection: this.selection, category: category });
  }

  private handleClassSelectionEvent(selection: any, category: any) {
    const SEGMENT_ID = ramda.path(['segmentId'], selection);
    const FAMILY_ID = ramda.path(['familyId'], selection);
    const CLASS_ID = ramda.path(['id'], category);

    selection.segmentId = SEGMENT_ID;
    selection.familyId = FAMILY_ID;
    selection.classId = CLASS_ID;
    selection.subClassId = undefined;

    this.selection = selection;
    _debugX(ClassificationCategoryViewV1.getClassName(), `handleClassSelectionEvent`, { this_selection: this.selection, category: category });
  }

  private handleSubClassSelectionEvent(selection: any, category: any) {
    const SEGMENT_ID = ramda.path(['segmentId'], selection);
    const FAMILY_ID = ramda.path(['familyId'], selection);
    const CALSS_ID = ramda.path(['classId'], selection);
    const SUB_CLASS_ID = ramda.path(['id'], category);

    selection.segmentId = SEGMENT_ID;
    selection.familyId = FAMILY_ID;
    selection.classId = CALSS_ID;
    selection.subClassId = SUB_CLASS_ID;

    this.selection = selection;
    _debugX(ClassificationCategoryViewV1.getClassName(), `handleSubClassSelectionEvent`, { this_selection: this.selection, category: category });
  }

}
