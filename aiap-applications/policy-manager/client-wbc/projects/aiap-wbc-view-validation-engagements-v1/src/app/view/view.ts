/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import * as lodash from 'lodash';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  BaseViewWbcV1,
} from 'client-shared-views';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  ValidationEngagementsDeleteModalV1,
  ValidationEngagementsImportModalV1,
  ValidationEngagementsSaveModalV1,
} from '.';

@Component({
  selector: 'aiap-wbc-validation-engagements-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class ValidationEngagementsViewV1 extends BaseViewWbcV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'ValidationEngagementsViewV1';
  }

  @ViewChild('validationEngagementsDeleteModalV1') validationEngagementsDeleteModalV1: ValidationEngagementsDeleteModalV1;
  @ViewChild('validationEngagementsImportModalV1') validationEngagementsImportModalV1: ValidationEngagementsImportModalV1;
  @ViewChild('validationEngagementsSaveModalV1') validationEngagementsSaveModalV1: ValidationEngagementsSaveModalV1;

  response: any = {
    items: [],
    total: 0,
  };

  _state: any = {
    query: {
      type: DEFAULT_TABLE.VALIDATION_ENGAGEMENTS_V1.TYPE,
      sort: DEFAULT_TABLE.VALIDATION_ENGAGEMENTS_V1.SORT,
    }
  };
  state = lodash.cloneDeep(this._state);

  constructor(
    // params-super
    protected notificationService: NotificationService,
    // params-native
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
  ) {
    super(notificationService);
  }

  ngOnInit(): void { }

  ngOnDestroy() {
    super.superNgOnDestroy();
  }

  handleValidationEngagementsDeleteModal(keys: string[] = undefined) {
    _debugW(ValidationEngagementsViewV1.getClassName(), `handleShowDeleteModal`, { keys });
    this.validationEngagementsDeleteModalV1.show(keys);
  }

  handleSearchClearEvent(validationEngagement: any) {
    _debugW(ValidationEngagementsViewV1.getClassName(), `handleSearchClearEvent`, { validationEngagement });
    this.queryService.deleteFilterItems(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleSearchEvent(validationEngagement: any) {
    _debugW(ValidationEngagementsViewV1.getClassName(), `handleSearchEvent`, { validationEngagement });
    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH, validationEngagement);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleShowSaveModal(event: any = undefined) {
    _debugW(ValidationEngagementsViewV1.getClassName(), `handleShowSaveModal`, { event });
    const ID = event?.value?.id;
    this.validationEngagementsSaveModalV1.show(ID);
  }

  handleShowImportQueue(event: any) {
    _debugW(ValidationEngagementsViewV1.getClassName(), `handleShowImportQueue`, { event });
    this.validationEngagementsImportModalV1.show();
  }

}
