/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

import {
  DEFAULT_TABLE,
  OUTLETS,
} from 'client-utils';

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

import { LambdaModulesConfigurationsSaveModalV1 } from '../components';
import { LambdaModulesConfigurationsDeleteModalV1 } from '../components';
import { LambdaModulesConfigurationsImportModalV1 } from '../components';

@Component({
  selector: 'aiap-lambda-modules-configurations-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class LambdaModulesConfigurationsViewV1 extends BaseViewV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'LambdaModulesConfigurationsViewV1';
  }

  @ViewChild('lambdaModulesConfigurationSaveModal') lambdaModulesConfigSaveModal: LambdaModulesConfigurationsSaveModalV1;
  @ViewChild('lambdaModulesConfigurationDeleteModal') lambdaModulesConfigDeleteModal: LambdaModulesConfigurationsDeleteModalV1;
  @ViewChild('lambdaModulesConfigurationImportModal') lambdaModulesConfigImportModal: LambdaModulesConfigurationsImportModalV1;

  outlet = OUTLETS.tenantCustomizer;

  state: any = {
    search: '',
    queryType: DEFAULT_TABLE.LAMBDA_CHANGES.TYPE,
  }

  constructor(
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    const QUERY = this.queryService.query(this.state.queryType);
    this.state.search = QUERY?.filter?.search;
    _debugX(LambdaModulesConfigurationsViewV1.getClassName(), `ngOnInit`, {
      query: QUERY,
      this_state: this.state
    });
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngAfterViewInit() {
    // 
  }

  handleSearchChangeEvent(event: any) {
    _debugX(LambdaModulesConfigurationsViewV1.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchClearEvent(event: any) {
    _debugX(LambdaModulesConfigurationsViewV1.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleLambdaModuleConfigSaveModal(event: any = undefined): void {
    _debugX(LambdaModulesConfigurationsViewV1.getClassName(), `handleShowSaveModal`, { event });
    const LAMBDA_CONFIG_ID = event?.value?.id;
    this.lambdaModulesConfigSaveModal.show(LAMBDA_CONFIG_ID);
  }

  handleLambdaModuleConfigDeleteModal(event: any = undefined): void {
    _debugX(LambdaModulesConfigurationsViewV1.getClassName(), `handleShowDeleteModal`, { event });
    this.lambdaModulesConfigDeleteModal.show(event);
  }

  handleShowImportModal(event: any) {
    _debugX(LambdaModulesConfigurationsViewV1.getClassName(), `handleShowImportModal`, { event });
    this.lambdaModulesConfigImportModal.showImportModal();
  }
}
