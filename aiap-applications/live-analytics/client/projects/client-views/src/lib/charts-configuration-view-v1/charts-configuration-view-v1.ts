/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import {
  _debugX,
} from 'client-shared-utils';

import {
  DEFAULT_TABLE,
  OUTLETS,
} from 'client-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import { BaseView } from 'client-shared-views';

import { ChartSaveModalV1 } from './chart-save-modal-v1/chart-save-modal-v1';
import { ChartDeleteModalV1 } from './chart-delete-modal-v1/chart-delete-modal-v1';
import { ChartImportModalV1 } from './chart-import-modal-v1/chart-import-modal-v1';

@Component({
  selector: 'aiap-charts-configuration-view-v1',
  templateUrl: './charts-configuration-view-v1.html',
  styleUrls: ['./charts-configuration-view-v1.scss'],
})
export class ChartsConfigurationViewV1 extends BaseView implements OnInit, OnDestroy {

  static getClassName() {
    return 'ChartsConfigurationViewV1';
  }

  @ViewChild('aiapChartSaveModalV1') chartSaveModal: ChartSaveModalV1;
  @ViewChild('aiapChartDeleteModalV1') chartDeleteModal: ChartDeleteModalV1;
  @ViewChild('aiapChartImportModalV1') chartImportModal: ChartImportModalV1;

  outlet = OUTLETS.liveAnalytics;

  state: any = {
    queryType: DEFAULT_TABLE.CHARTS_CONFIGURATION.TYPE,
    defaultSort: DEFAULT_TABLE.CHARTS_CONFIGURATION.SORT
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
    _debugX(ChartsConfigurationViewV1.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchChangeEvent(event: any) {
    _debugX(ChartsConfigurationViewV1.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleShowSaveModal(event: any = undefined): void {
    _debugX(ChartsConfigurationViewV1.getClassName(), `handleShowSaveModal`, { event });
    const LAMBDA_MODULE_ID = event?.value?.id
    this.chartSaveModal.show(LAMBDA_MODULE_ID);
  }

  handleChartDeleteModal(chartsIds: any = undefined): void {
    _debugX(ChartsConfigurationViewV1.getClassName(), `handleShowDeleteModal`, { event });
    this.chartDeleteModal.show(chartsIds);
  }

  handleShowImportModal(event: any) {
    _debugX(ChartsConfigurationViewV1.getClassName(), `handleShowImportModal`, { event });
    this.chartImportModal.showImportModal();
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'charts-configuration',
      children: [
        ...children,
        {
          path: '',
          component: ChartsConfigurationViewV1,
          data: {
            name: 'Charts configuration view',
            component: ChartsConfigurationViewV1.getClassName(),
            actions: [
              {
                name: 'Add charts',
                component: 'charts.view.add'
              },
              {
                name: 'Edit charts',
                component: 'charts.view.edit'
              },
              {
                name: 'Delete charts',
                component: 'charts.view.delete'
              },
            ]
          }
        },
      ],
      data: {
        breadcrumb: 'charts_configuration_view_v1.breadcrumb',
      }
    }
    return RET_VAL;
  }

}
