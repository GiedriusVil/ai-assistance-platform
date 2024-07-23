/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

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

import { LiveMetricsConfigurationSaveModal } from './live-metrics-configuration-save-modal-v1/live-metrics-configuration-save-modal-v1';
import { LiveMetricsConfigurationDeleteModal } from './live-metrics-configuration-delete-modal-v1/live-metrics-configuration-delete-modal-v1';
import { LiveMetricsConfigurationImportModal } from './live-metrics-configuration-import-modal-v1/live-metrics-configuration-import-modal-v1';

@Component({
  selector: 'aca-live-metrics-configuration-view',
  templateUrl: './live-metrics-configuration-view-v1.html',
  styleUrls: ['./live-metrics-configuration-view-v1.scss'],
})
export class LiveMetricsConfigurationView extends BaseViewV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'LiveMetricsConfigurationView';
  }

  @ViewChild('LiveMetricsConfigurationSaveModal') LiveMetricsConfigurationSaveModal: LiveMetricsConfigurationSaveModal;
  @ViewChild('LiveMetricsConfigurationDeleteModal') LiveMetricsConfigurationDeleteModal: LiveMetricsConfigurationDeleteModal;
  @ViewChild('LiveMetricsConfigurationImportModal') LiveMetricsConfigurationImportModal: LiveMetricsConfigurationImportModal;

  outlet = OUTLETS.tenantCustomizer;

  response: any = {
    items: [],
    total: 0,
  };

  state: any = {
    queryType: DEFAULT_TABLE.LIVE_METRICS_CONFIGURATIONS.TYPE,
    defaultSort: DEFAULT_TABLE.LIVE_METRICS_CONFIGURATIONS.SORT,
  };

  constructor(
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    //
  }

  ngAfterViewInit() {
    //
  }

  handleLiveMetricsConfigurationDeleteModal(configuration: any = undefined) {
    _debugX(LiveMetricsConfigurationView.getClassName(), `handleShowDeleteModal`,
      {
        configuration,
      });

    this.LiveMetricsConfigurationDeleteModal.show(configuration);
  }

  handleSearchClearEvent(configuration: any) {
    _debugX(LiveMetricsConfigurationView.getClassName(), `handleSearchClearEvent`,
      {
        configuration,
      });

    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchChangeEvent(configuration: any) {
    _debugX(LiveMetricsConfigurationView.getClassName(), `handleSearchChangeEvent`,
      {
        configuration,
      });

    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, configuration);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleLiveMetricsConfigurationSaveModal(event: any) {
    _debugX(LiveMetricsConfigurationView.getClassName(), `handleShowSaveModal`,
      {
        event,
      });

    this.LiveMetricsConfigurationSaveModal.show(event?.value?.id);
  }

  handleShowImportModal(event: any) {
    _debugX(LiveMetricsConfigurationView.getClassName(), `handleShowImportModal`,
      {
        event,
      });

    this.LiveMetricsConfigurationImportModal.show();
  }

  static route() {
    const RET_VAL = {
      path: 'live-metrics-configuration-view',
      component: LiveMetricsConfigurationView,
      data: {
        name: 'live_metrics_configurations_view_v1.name',
        breadcrumb: 'live_metrics_configuration_view_v1.breadcrumb',
        component: LiveMetricsConfigurationView.getClassName(),
        description: 'live_metrics_configurations_view_v1.description',
        actions: [
          {
            title: 'live_metrics_configurations_view_v1.action_add.name',
            description: 'live_metrics_configurations_view_v1.action_add.description',
            component: 'live-metrics-configurations.view.add',
          },
          {
            title: 'live_metrics_configurations_view_v1.action_edit.name',
            description: 'live_metrics_configurations_view_v1.action_edit.description',
            component: 'live-metrics-configurations.view.edit',
          },
          {
            title: 'live_metrics_configurations_view_v1.action_delete.name',
            description: 'live_metrics_configurations_view_v1.action_delete.description',
            component: 'live-metrics-configurations.view.delete',
          },
          {
            title: 'live_metrics_configurations_view_v1.action_import.name',
            description: 'live_metrics_configurations_view_v1.action_import.description',
            component: 'live-metrics-configurations.view.import',
          },
          {
            title: 'live_metrics_configurations_view_v1.action_export.name',
            description: 'live_metrics_configurations_view_v1.action_export.description',
            component: 'live-metrics-configurations.view.export',
          },
        ]
      }
    };
    return RET_VAL;
  }
}
