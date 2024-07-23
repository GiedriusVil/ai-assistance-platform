/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  TableHeaderItem,
  TableItem,
} from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
  _info
} from 'client-shared-utils';

import {
  ActivatedRouteServiceV1,
  SessionServiceV1,
  EventsServiceV1,
  QueryServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  LiveMetricsConfigurationsService,
} from 'client-services';

import {
  DEFAULT_TABLE,
  MESSAGES_LIVE_METRICS_CONFIGURATION,
} from 'client-utils';

import { BaseTable } from 'client-shared-components';

@Component({
  selector: 'aca-live-metrics-configuration-table',
  templateUrl: './live-metrics-configuration-table.html',
  styleUrls: ['./live-metrics-configuration-table.scss'],
})
export class LiveMetricsConfigurationTable extends BaseTable implements OnInit, AfterViewInit {

  static getClassName() {
    return 'LiveMetricsConfigurationTable';
  }

  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  dashboard = undefined;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  skeletonState: boolean = false;
  response: {
    items: [],
    total: 0
  };
  state: any = {
    queryType: DEFAULT_TABLE.LIVE_METRICS_CONFIGURATIONS.TYPE,
    defaultSort: DEFAULT_TABLE.LIVE_METRICS_CONFIGURATIONS.SORT,
    search: '',
  };
  selectedRows: Array<any> = [];
  isExportAllowed: boolean = false;

  constructor(
    private ActivatedRouteServiceV1: ActivatedRouteServiceV1,
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private liveMetricsConfigurationsService: LiveMetricsConfigurationsService,
    private notificationService: NotificationServiceV2,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    this.syncSearchFieldInputWithQuery();
    super.ngOnInit();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(new TableHeaderItem({ data: "Id", field: 'id' }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Name",
      style: { "width": "20%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Updated",
      field: 'updated.date',
      style: { "width": "15%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Created",
      field: 'created.date',
      style: { "width": "15%" }
    }));
    this.model.header = TABLE_HEADER;
  }

  subscribeToQueryParams() {
    this.ActivatedRouteServiceV1.queryParams()
      .subscribe((params: any) => {
        _debugX(LiveMetricsConfigurationTable.getClassName(), 'subscribeToQueryParams', { params });
        this.dashboard = params.dasboard;
      });
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap(query => {
        if (query) {
          defaultQuery = query;
        }
        _debugX(LiveMetricsConfigurationTable.getClassName(), `addFilterEventHandler`, { this_query: defaultQuery });
        return this.liveMetricsConfigurationsService.findManyByQuery(defaultQuery).pipe(
          catchError((error) => this.handleFindManyByQueryError(error))
        );
      }
      ),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(LiveMetricsConfigurationTable.getClassName(), `addFilterEventHandler`, { response });
      this.response = response;
      this.refreshTableModel();
      this.selectedRows = [];
      this.eventsService.loadingEmit(false);
    });
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];

    RET_VAL.push(new TableItem({ data: item.id }));
    RET_VAL.push(new TableItem({ data: item.name }));
    RET_VAL.push(new TableItem({ data: item, template: this.updatedTemplate }));
    RET_VAL.push(new TableItem({ data: item, template: this.createdTemplate }));

    return RET_VAL;
  }

  handleFindManyByQueryError(error: any) {
    _errorX(LiveMetricsConfigurationTable.getClassName(), `handleFindManyByQueryError`, { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(MESSAGES_LIVE_METRICS_CONFIGURATION.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'live-metrics-configurations.view.edit' });
    return RET_VAL;
  }

  syncSearchFieldInputWithQuery() {
    const QUERY = this.queryService.query(this.state.queryType);
    if (!lodash.isEmpty(QUERY?.filter?.search)) {
      this.state.search = QUERY?.filter?.search;
    }
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    this.liveMetricsConfigurationsService.exportMany(QUERY_PARAMS);
  }
}
