/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnInit, ViewChild, TemplateRef, OnChanges, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  TableHeaderItem,
  TableItem,
} from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  QueryServiceV1,
  NotificationServiceV2,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
  DASHBOARDS_CONFIGURATION_MESSAGES,
} from 'client-utils';

import {
  DashboardsConfigurationsService
} from 'client-services';

import {
  BaseTable,
} from 'client-shared-components';

@Component({
  selector: 'aiap-dashboards-configuration-table-v1',
  templateUrl: './dashboards-configuration-table-v1.html',
  styleUrls: ['./dashboards-configuration-table-v1.scss'],
})
export class DashboardsConfigurationTableV1 extends BaseTable implements OnInit, OnChanges, AfterViewInit {

  static getClassName() {
    return 'DashboardsConfigurationTableV1';
  }

  @Input() config;

  @Output() onSearchEvent = new EventEmitter<any>();
  @Output() onSearchClearEvent = new EventEmitter<any>();

  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  timezone: any = null;
  isActionsClickAllowed: boolean = false;

  state: any = {
    queryType: DEFAULT_TABLE.DASHBOARDS_CONFIGURATION.TYPE,
    defaultSort: DEFAULT_TABLE.DASHBOARDS_CONFIGURATION.SORT,
    search: '',
  };

  constructor(
    private dashboardsConfigurationService: DashboardsConfigurationsService,
    private translateService: TranslateHelperServiceV1,
    private notificationService: NotificationServiceV2,
    protected eventsService: EventsServiceV1,
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.setSearch();
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    super.ngOnInit();
  }

  ngOnChanges() {
    //
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  _isEmpty(data) {
    return lodash.isEmpty(data);
  }

  setSearch() {
    const QUERY = this.queryService.query(this.state.queryType);
    this.state.search = QUERY?.filter?.search || '';
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query) => {
        _debugX(DashboardsConfigurationTableV1.getClassName(), `addFilterEventHandler`, { query });
        if (query) {
          defaultQuery = query;
        }
        return this.dashboardsConfigurationService.findManyByQuery(defaultQuery).pipe(
          catchError((error: any) => this.handleFindManyByQueryError(error))
        )
      }),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(DashboardsConfigurationTableV1.getClassName(), `addFilterEventHandler`, { response });
      this.eventsService.loadingEmit(false);
      this.response = response;
      this.deselectAllRows();
      this.refreshTableModel();
      this.notificationService.showNotification(DASHBOARDS_CONFIGURATION_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY);
    });
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    const SELECTED_IDS = this.retrieveSelectedRowsIds();
    this.dashboardsConfigurationService.exportMany(QUERY_PARAMS, SELECTED_IDS);
  }

  handleFindManyByQueryError(error: any) {
    _errorX(DashboardsConfigurationTableV1.getClassName(), 'handleFindManyByQueryError', { error })
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(DASHBOARDS_CONFIGURATION_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('dashboards_configuration_table_v1.col_header_reference'),
      field: 'ref',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('dashboards_configuration_table_v1.col_header_name'),
      field: 'name',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('dashboards_configuration_table_v1.col_header_updated'),
      field: 'updated.date',
      style: {
        width: '15%'
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('dashboards_configuration_table_v1.col_header_created'),
      field: 'created.date',
      style: {
        width: '15%'
      }
    }));

    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: item?.ref }));
    RET_VAL.push(new TableItem({ data: item?.name }));
    RET_VAL.push(new TableItem({ data: item, template: this.updatedTemplate }));
    RET_VAL.push(new TableItem({ data: item, template: this.createdTemplate }));
    return RET_VAL;
  }

  isShowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }

  emitSearchEvent(event: any) {
    this.onSearchEvent.emit(event);
  }

  emitSearchClearEvent() {
    this.onSearchClearEvent.emit();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }
}
