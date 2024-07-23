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

import { DashboardSaveModalV1 } from './dashboard-save-modal-v1/dashboard-save-modal-v1';
import { DashboardDeleteModalV1 } from './dashboard-delete-modal-v1/dashboard-delete-modal-v1';
import { DashboardsImportModalV1 } from './dashboard-import-modal-v1/dashboard-import-modal-v1';
@Component({
  selector: 'aiap-dashboards-configuration-view-v1',
  templateUrl: './dashboards-configuration-view-v1.html',
  styleUrls: ['./dashboards-configuration-view-v1.scss'],
})
export class DashboardsConfigurationViewV1 extends BaseView implements OnInit, OnDestroy {

  static getClassName() {
    return 'DashboardsConfigurationViewV1';
  }

  @ViewChild('aiapDashboardSaveModalV1') dashboardSaveModal: DashboardSaveModalV1;
  @ViewChild('aiapDashboardDeleteModalV1') dashboardDeleteModal: DashboardDeleteModalV1;
  @ViewChild('aiapDashboardsImportModalV1') dashboardImportModal: DashboardsImportModalV1;

  outlet = OUTLETS.liveAnalytics;

  state: any = {
    queryType: DEFAULT_TABLE.DASHBOARDS_CONFIGURATION.TYPE,
    defaultSort: DEFAULT_TABLE.DASHBOARDS_CONFIGURATION.SORT
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
    _debugX(DashboardsConfigurationViewV1.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchChangeEvent(event: any) {
    _debugX(DashboardsConfigurationViewV1.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleShowSaveModal(event: any = undefined): void {
    _debugX(DashboardsConfigurationViewV1.getClassName(), `handleShowSaveModal`, { event });
    const LAMBDA_MODULE_ID = event?.value?.id
    this.dashboardSaveModal.show(LAMBDA_MODULE_ID);
  }

  handleDashboardDeleteModal(dashboardsIds: any = undefined): void {
    _debugX(DashboardsConfigurationViewV1.getClassName(), `handleShowDeleteModal`, { event });
    this.dashboardDeleteModal.show(dashboardsIds);
  }

  handleShowImportModal(event: any) {
    _debugX(DashboardsConfigurationViewV1.getClassName(), `handleShowImportModal`, { event });
    this.dashboardImportModal.showImportModal();
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'dashboards-configuration',
      children: [
        ...children,
        {
          path: '',
          component: DashboardsConfigurationViewV1,
          data: {
            name: 'Dashboards configuration view',
            component: DashboardsConfigurationViewV1.getClassName(),
            actions: [
              {
                name: 'Add dashboards',
                component: 'dashboards.view.add'
              },
              {
                name: 'Edit dashboards',
                component: 'dashboards.view.edit'
              },
              {
                name: 'Delete dashboards',
                component: 'dashboards.view.delete'
              },
            ]
          }
        },
      ],
      data: {
        breadcrumb: 'dashboards_configuration_view_v1.breadcrumb',
      }
    }
    return RET_VAL;
  }

}
