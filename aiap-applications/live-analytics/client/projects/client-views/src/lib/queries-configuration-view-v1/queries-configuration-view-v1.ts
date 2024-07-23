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

import { QuerySaveModalV1 } from './query-save-modal-v1/query-save-modal-v1';
import { QueryDeleteModalV1 } from './query-delete-modal-v1/query-delete-modal-v1';
import { QueryImportModalV1 } from './query-import-modal-v1/query-import-modal-v1';

@Component({
  selector: 'aiap-queries-configuration-view-v1',
  templateUrl: './queries-configuration-view-v1.html',
  styleUrls: ['./queries-configuration-view-v1.scss'],
})
export class QueriesConfigurationViewV1 extends BaseView implements OnInit, OnDestroy {

  static getClassName() {
    return 'QueriesConfigurationViewV1';
  }

  @ViewChild('aiapQuerySaveModalV1') querySaveModalV1: QuerySaveModalV1;
  @ViewChild('aiapQueryDeleteModalV1') queryDeleteModalV1: QueryDeleteModalV1;
  @ViewChild('aiapQueryImportModalV1') queryImportModalV1: QueryImportModalV1;

  outlet = OUTLETS.liveAnalytics;

  state: any = {
    queryType: DEFAULT_TABLE.QUERIES_CONFIGURATION.TYPE,
    defaultSort: DEFAULT_TABLE.QUERIES_CONFIGURATION.SORT
  };

  constructor(
    private queryService: QueryServiceV1,
    private eventsService: EventsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleSearchClearEvent(event: any) {
    _debugX(QueriesConfigurationViewV1.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchChangeEvent(event: any) {
    _debugX(QueriesConfigurationViewV1.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleShowSaveModal(event: any = undefined): void {
    _debugX(QueriesConfigurationViewV1.getClassName(), `handleShowSaveModal`, { event });
    const LAMBDA_MODULE_ID = event?.value?.id
    this.querySaveModalV1.show(LAMBDA_MODULE_ID);
  }

  handleQuerydeleteModal(queriesIds: any = undefined): void {
    _debugX(QueriesConfigurationViewV1.getClassName(), `handleShowDeleteModal`, { event });
    this.queryDeleteModalV1.show(queriesIds);
  }

  handleShowImportModal(event: any) {
    _debugX(QueriesConfigurationViewV1.getClassName(), `handleShowImportModal`, { event });
    this.queryImportModalV1.showImportModal();
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'queries-configuration',
      children: [
        ...children,
        {
          path: '',
          component: QueriesConfigurationViewV1,
          data: {
            name: 'queries_configuration_view_v1.name',
            component: QueriesConfigurationViewV1.getClassName(),
          }
        },
      ],
      data: {
        breadcrumb: 'queries_configuration_view_v1.breadcrumb',
      }
    }
    return RET_VAL;
  }

}
