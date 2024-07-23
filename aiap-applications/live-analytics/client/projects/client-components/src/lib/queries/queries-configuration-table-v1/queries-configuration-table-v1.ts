/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnInit, ViewChild, TemplateRef, OnChanges, AfterViewInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

import * as ramda from 'ramda';
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
  SessionServiceV1, TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
  QUERIES_CONFIGURATION_MESSAGES,
} from 'client-utils';

import {
  QueriesConfigurationsService
} from 'client-services';

import {
  EventsServiceV1,
  QueryServiceV1,
  NotificationServiceV2,
} from 'client-shared-services'

import {
  BaseTable,
} from 'client-shared-components';

@Component({
  selector: 'aiap-queries-configuration-table-v1',
  templateUrl: './queries-configuration-table-v1.html',
  styleUrls: ['./queries-configuration-table-v1.scss'],
})
export class QueriesConfigurationTableV1 extends BaseTable implements OnInit, OnChanges, AfterViewInit {

  static getClassName() {
    return 'QueriesConfigurationTableV1';
  }

  @Input() config;

  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;
  @ViewChild('healthCheckIcon', { static: true }) healthCheckIcon: TemplateRef<any>;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;

  timezone: any = null;
  isActionsClickAllowed = false;
  basePaths = true;
  missingBasePath = '';
  state: any = {
    queryType: DEFAULT_TABLE.QUERIES_CONFIGURATION.TYPE,
    defaultSort: DEFAULT_TABLE.QUERIES_CONFIGURATION.SORT,
    search: '',
  };

  constructor(
    private notificationService: NotificationServiceV2,
    private queriesConfigurationsService: QueriesConfigurationsService,
    protected eventsService: EventsServiceV1,
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.setSearch();
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    this.checkForBasePaths();
    super.ngOnInit();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  ngOnChanges() {
  }

  _isEmpty(data) {
    return lodash.isEmpty(data);
  }

  setSearch() {
    const QUERY = this.queryService.query(this.state.queryType);
    this.state.search = QUERY?.filter?.search || '';
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    const SELECTED_IDS = this.retrieveSelectedRowsIds();
    this.queriesConfigurationsService.exportMany(QUERY_PARAMS, SELECTED_IDS);
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query) => {
        _debugX(QueriesConfigurationTableV1.getClassName(), `addFilterEventHandler`, { query });
        if (query) {
          defaultQuery = query;
        }
        return this.queriesConfigurationsService.findManyByQuery(defaultQuery).pipe(
          catchError((error: any) => this.handleFindManyByQueryError(error))
        )
      }),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(QueriesConfigurationTableV1.getClassName(), `addFilterEventHandler`, { response });
      this.eventsService.loadingEmit(false);
      this.response = response;
      this.deselectAllRows();
      this.refreshTableModel();
      this.notificationService.showNotification(QUERIES_CONFIGURATION_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY);
    });
  }

  handleFindManyByQueryError(error: any) {
    _errorX(QueriesConfigurationTableV1.getClassName(), 'handleFindManyByQueryError', { error })
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(QUERIES_CONFIGURATION_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('queries_configuration_table_v1.col_header_healthCheck'),
      field: 'healthCheck',
      sortable: false,
      style: { "width": "5%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('filters_configuration_table_v1.col_header_reference'),
      field: 'ref'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('queries_configuration_table_v1.col_header_updated'),
      field: 'updated.date',
      style: { "width": "15%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('queries_configuration_table_v1.col_header_created'),
      field: 'created.date',
      style: { "width": "15%" }
    }));

    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(params) {
    const ITEM = params?.item;
    const BASE_PATH_ERROR = {
      basePathError: this.missingBasePath
    };
    const HEALTH_CHECK = ramda.pathOr(BASE_PATH_ERROR, ['healthCheck'], params);

    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: HEALTH_CHECK, template: this.healthCheckIcon }));
    RET_VAL.push(new TableItem({ data: ITEM?.ref }));
    RET_VAL.push(new TableItem({ data: ITEM, template: this.updatedTemplate }));
    RET_VAL.push(new TableItem({ data: ITEM, template: this.createdTemplate }));
    return RET_VAL;
  }

  public refreshTableDataRows() {
    const TABLE_ROWS = [];
    if (
      !lodash.isEmpty(this.response.items) &&
      lodash.isArray(this.response.items)
    ) {
      for (let index = 0; index < this.response.items.length; index++) {
        const ITEM = this.response?.items?.[index];
        const HEALTH_CHECK_ITEM = this.response?.healthCheck?.[index];
        TABLE_ROWS.push(this.transformResponseItemToRow({
          item: ITEM,
          healthCheck: HEALTH_CHECK_ITEM
        }));
      }
    }
    this.model.data = TABLE_ROWS;
  }

  isShowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }

  emitSearchEvent(event: any) {
    this.onSearchPlace.emit(event);
  }

  emitSearchClearEvent() {
    this.onClearPlace.emit();
  }

  checkForBasePaths() {
    const SESSION = this.sessionService.getSession();
    const TENANT = SESSION?.tenant;
    const LIVE_ANALYTICS_BASE_URL = TENANT?.liveAnalyticsBaseUrl;
    if (lodash.isEmpty(LIVE_ANALYTICS_BASE_URL)) {
      this.basePaths = false;
      this.missingBasePath = 'liveAnalyticsBaseUrl is not configured in Tenant!';
    }
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }
}
