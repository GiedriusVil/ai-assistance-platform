/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy, AfterViewInit
} from '@angular/core';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
  WbcLocationServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
  OUTLETS,
} from 'client-utils';

import { BaseViewV1 } from 'client-shared-views';

import {
  ClassificationCatalogDeleteModalV1,
  ClassificationCatalogImportModalV1,
  ClassificationCatalogSaveModalV1
} from '../components';

@Component({
  selector: 'aiap-classification-catalogs-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss'],
})
export class ClassificationCatalogsViewV1 extends BaseViewV1 implements OnInit, OnDestroy,AfterViewInit {

  static getClassName() {
    return 'ClassificationCatalogsViewV1';
  }

  @ViewChild('classificationCatalogDeleteModal') classificationCatalogDeleteModal: ClassificationCatalogDeleteModalV1;
  @ViewChild('classificationCatalogImportModal') classificationCatalogImportModal: ClassificationCatalogImportModalV1;
  @ViewChild('classificationCatalogSaveModal') classificationCatalogSaveModal: ClassificationCatalogSaveModalV1;

  outlet = OUTLETS.tenantCustomizer;

  state: any = {
    queryType: DEFAULT_TABLE.CLASSIFICATION_CATALOGS_V1.TYPE,
    defaultSort: DEFAULT_TABLE.CLASSIFICATION_CATALOGS_V1.SORT
  };

  constructor(
    private queryService: QueryServiceV1,
    private eventsService: EventsServiceV1,
    private wbcLocationService: WbcLocationServiceV1
  ) {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleShowSavePlaceEvent(event: any = undefined): void {
    _debugX(ClassificationCatalogsViewV1.getClassName(), `handleShowSavePlaceEvent`, { event });
    this.classificationCatalogSaveModal.show(event);
  }

  handleDeleteEvent(event: any = undefined): void {
    _debugX(ClassificationCatalogsViewV1.getClassName(), `handleDeleteEvent`, { event });
    this.classificationCatalogDeleteModal.show(event);
  }

  handleSearchClearEvent(event: any) {
    _debugX(ClassificationCatalogsViewV1.getClassName(), `handleSearchClearEvent`, { event });

    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchChangeEvent(event: any) {
    _debugX(ClassificationCatalogsViewV1.getClassName(), `handleSearchChangeEvent`, { event });

    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleShowCategoriesEvent(event: any) {
    try {
      const NAVIGATION: any = {};
      const ID = event;
      console.log('ID', ID)
      NAVIGATION.path = `(tenantCustomizer:main-view/classification-catalog)`;
      NAVIGATION.extras = {
        queryParams: {
          id: ID
        }
      };
      _debugX(ClassificationCatalogsViewV1.getClassName(), `handleShowCategoryEvent`, { event, NAVIGATION });
      this.wbcLocationService.navigateToPathByEnvironmentServiceV1(NAVIGATION.path, NAVIGATION.extras);
    } catch (error) {
      _errorX(ClassificationCatalogsViewV1.getClassName(), 'handleShowSavePlaceEvent', { error, event });
      throw error;
    }
  }

  handleShowImportQueue(event: any) {
    _debugX(ClassificationCatalogsViewV1.getClassName(), `handleShowImportQueue`, { event });
    this.classificationCatalogImportModal.show();
  }

}
