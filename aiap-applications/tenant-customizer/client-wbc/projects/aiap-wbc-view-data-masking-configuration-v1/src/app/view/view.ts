/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';


import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  BaseViewV1,
} from 'client-shared-views';

import {
  DEFAULT_TABLE,
  OUTLETS,
} from 'client-utils';

import {
  MaskingConfigurationSaveModalV1,
  MaskingConfigurationDeleteModalV1,
  MaskingConfigurationImportModalV1
} from '../components';

@Component({
  selector: 'aiap-data-masking-configuration-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss'],
})
export class DataMaskingConfigurationViewV1 extends BaseViewV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'DataMaskingConfigurationViewV1';
  }

  @ViewChild('MaskingConfigurationSaveModal') MaskingConfigurationSaveModal: MaskingConfigurationSaveModalV1;
  @ViewChild('MaskingConfigurationDeleteModal') MaskingConfigurationDeleteModal: MaskingConfigurationDeleteModalV1;
  @ViewChild('MaskingConfigurationImportModal') MaskingConfigurationImportModal: MaskingConfigurationImportModalV1;

  outlet = OUTLETS.tenantCustomizer;

  response: any = {
    items: [],
    total: 0,
  };

  state: any = {
    queryType: DEFAULT_TABLE.DATA_MASKING_CONFIGURATIONS_V1.TYPE,
    defaultSort: DEFAULT_TABLE.DATA_MASKING_CONFIGURATIONS_V1.SORT,
  };

  constructor(
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngAfterViewInit() {
    //
  }

  handleMaskingConfigurationDeleteModal(configKeys: any = undefined) {
    _debugX(DataMaskingConfigurationViewV1.getClassName(), `handleShowDeleteModal`, { configKeys });
    this.MaskingConfigurationDeleteModal.show(configKeys);
  }

  handleSearchClearEvent(configuration: any) {
    _debugX(DataMaskingConfigurationViewV1.getClassName(), `handleSearchClearEvent`, { configuration });
    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchEvent(configuration: any) {
    _debugX(DataMaskingConfigurationViewV1.getClassName(), `handleSearchEvent`, { configuration });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, configuration);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleShowSaveModal(event: any = undefined) {
    _debugX(DataMaskingConfigurationViewV1.getClassName(), `handleShowSaveModal`, { event });
    const CONFIG_KEY = event?.value?.key;
    this.MaskingConfigurationSaveModal.show(CONFIG_KEY);
  }

  handleShowImportQueue(event: any) {
    _debugX(DataMaskingConfigurationViewV1.getClassName(), `handleShowImportQueue`, { event });
    this.MaskingConfigurationImportModal.show();
  }
}
