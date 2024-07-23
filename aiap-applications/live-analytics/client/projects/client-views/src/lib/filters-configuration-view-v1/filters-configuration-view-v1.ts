/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
  OUTLETS,
} from 'client-utils';

import { BaseView } from 'client-shared-views';

import { FilterSaveModalV1 } from './filter-save-modal-v1/filter-save-modal-v1';
import { FilterDeleteModalV1 } from './filter-delete-modal-v1/filter-delete-modal-v1';
import { FilterImportModalV1 } from './filter-import-modal-v1/filter-import-modal-v1';

@Component({
  selector: 'aiap-filters-configuration-view-v1',
  templateUrl: './filters-configuration-view-v1.html',
  styleUrls: ['./filters-configuration-view-v1.scss'],
})
export class FiltersConfigurationViewV1 extends BaseView implements OnInit, OnDestroy {

  static getClassName() {
    return 'FiltersConfigurationViewV1';
  }

  @ViewChild('aiapFilterSaveModalV1') filterSaveModalV1: FilterSaveModalV1;
  @ViewChild('aiapFilterDeleteModalV1') filterDeleteModalV1: FilterDeleteModalV1;
  @ViewChild('aiapFilterImportModalV1') filterImportModalV1: FilterImportModalV1;

  outlet = OUTLETS.liveAnalytics;

  state: any = {
    queryType: DEFAULT_TABLE.FILTERS_CONFIGURATION.TYPE,
    defaultSort: DEFAULT_TABLE.FILTERS_CONFIGURATION.SORT
  };

  constructor(
    private queryService: QueryServiceV1,
    private eventsService: EventsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleSearchClearEvent(event: any) {
    _debugX(FiltersConfigurationViewV1.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchChangeEvent(event: any) {
    _debugX(FiltersConfigurationViewV1.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleShowSaveModal(event: any = undefined): void {
    _debugX(FiltersConfigurationViewV1.getClassName(), `handleShowSaveModal`, { event });
    const FILTER_ID = event?.value?.id
    this.filterSaveModalV1.show(FILTER_ID);
  }

  handleQuerydeleteModal(queriesIds: any = undefined): void {
    _debugX(FiltersConfigurationViewV1.getClassName(), `handleShowDeleteModal`, { event });
    this.filterDeleteModalV1.show(queriesIds);
  }

  handleShowImportModal(event: any) {
    _debugX(FiltersConfigurationViewV1.getClassName(), `handleShowImportModal`, { event });
    this.filterImportModalV1.showImportModal();
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'filters-configuration',
      children: [
        ...children,
        {
          path: '',
          component: FiltersConfigurationViewV1,
          data: {
            name: 'filters_configuration_view_v1.name',
            description: 'filters_configuration_view_v1.description',
            component: FiltersConfigurationViewV1.getClassName(),
          }
        },
      ],
      data: {
        breadcrumb: 'filters_configuration_view_v1.breadcrumb',
      }
    }
    return RET_VAL;
  }

}
