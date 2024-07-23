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
  BaseViewV1
} from 'client-shared-views';

import {
  LambdaModuleDeleteModalV1,
  LambdaModuleSaveModalV1,
  LambdaModulesImportModalV1,
  LambdaModulesPullModalV1,
} from '../components';

@Component({
  selector: 'aiap-lambda-modules-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class LambdaModulesViewV1 extends BaseViewV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'LambdaModulesViewV1';
  }

  @ViewChild('lambdaModuleDeleteModal') lambdaModuleDeleteModal: LambdaModuleDeleteModalV1;
  @ViewChild('lambdaModuleSaveModal') lambdaModuleSaveModal: LambdaModuleSaveModalV1;

  @ViewChild('lambdaModulesImportModal') lambdaModulesImportModal: LambdaModulesImportModalV1;
  @ViewChild('lambdaModulesPullModal') lambdaModulesPullModal: LambdaModulesPullModalV1;

  outlet = OUTLETS.tenantCustomizer;

  constructor(
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    const QUERY = this.queryService.query(DEFAULT_TABLE.LAMBDA.TYPE);
    _debugX(LambdaModulesViewV1.getClassName(), `ngOnInit`, { QUERY });
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngAfterViewInit() {
    //
  }

  handleSearchChangeEvent(event: any) {
    _debugX(LambdaModulesViewV1.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(DEFAULT_TABLE.LAMBDA.TYPE, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(DEFAULT_TABLE.LAMBDA.TYPE));
  }

  handleSearchClearEvent(event: any) {
    _debugX(LambdaModulesViewV1.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(DEFAULT_TABLE.LAMBDA.TYPE, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(DEFAULT_TABLE.LAMBDA.TYPE));
  }

  handleShowSaveModal(event: any = undefined): void {
    _debugX(LambdaModulesViewV1.getClassName(), `handleShowSaveModal`, { event });
    const LAMBDA_MODULE_ID = event?.value?.id
    this.lambdaModuleSaveModal.show(LAMBDA_MODULE_ID);
  }

  handleShowDeleteModal(event: any) {
    _debugX(LambdaModulesViewV1.getClassName(), `handleShowDeleteModal`, { event });
    this.lambdaModuleDeleteModal.show(event);
  }

  handleShowPullModal(event: any) {
    _debugX(LambdaModulesViewV1.getClassName(), `handleShowPullModal`, { event });
    this.lambdaModulesPullModal.show();
  }

  handleShowImportModal(event: any) {
    _debugX(LambdaModulesViewV1.getClassName(), `handleShowImportModal`, { event });
    this.lambdaModulesImportModal.showImportModal();
  }
}
