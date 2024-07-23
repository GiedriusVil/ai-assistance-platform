/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnInit, ViewChild, TemplateRef, OnChanges, AfterViewInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import { TranslateHelperServiceV1 } from 'client-shared-services';

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
  NotificationServiceV2,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
  FILTERS_CONFIGURATION_MESSAGES,
} from 'client-utils';

import {
  FiltersConfigurationsService
} from 'client-services';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services'

import {
  BaseTableV1,
} from 'client-shared-components';


@Component({
  selector: 'aiap-filters-configuration-table-v1',
  templateUrl: './filters-configuration-table-v1.html',
  styleUrls: ['./filters-configuration-table-v1.scss'],
})
export class FiltersConfigurationTableV1 extends BaseTableV1 implements OnInit, OnChanges, AfterViewInit {

  static getClassName() {
    return 'FiltersConfigurationTableV1';
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
    queryType: DEFAULT_TABLE.FILTERS_CONFIGURATION.TYPE,
    defaultSort: DEFAULT_TABLE.FILTERS_CONFIGURATION.SORT,
    search: '',
  };

  constructor(
    private notificationService: NotificationServiceV2,
    private filtersConfigurationsService: FiltersConfigurationsService,
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
    super.ngOnInit();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  ngOnChanges() {
    //
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
    this.filtersConfigurationsService.exportMany(QUERY_PARAMS, SELECTED_IDS);
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query) => {
        _debugX(FiltersConfigurationTableV1.getClassName(), `addFilterEventHandler`,
          {
            query,
          });

        if (query) {
          defaultQuery = query;
        }
        return this.filtersConfigurationsService.findManyByQuery(defaultQuery).pipe(
          catchError((error: any) => this.handleFindManyByQueryError(error))
        )
      }),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(FiltersConfigurationTableV1.getClassName(), `addFilterEventHandler`, { response });
      this.eventsService.loadingEmit(false);
      this.response = response;
      this.deselectAllRows();
      this.refreshTableModel();
      this.notificationService.showNotification(FILTERS_CONFIGURATION_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY);
    });
  }

  handleFindManyByQueryError(error: any) {
    _errorX(FiltersConfigurationTableV1.getClassName(), 'handleFindManyByQueryError',
      {
        error,
      })
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(FILTERS_CONFIGURATION_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('filters_configuration_table_v1.col_header_reference'),
      field: 'ref'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('filters_configuration_table_v1.col_header_type'),
      field: 'type'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('filters_configuration_table_v1.col_header_updated'),
      field: 'updated.date',
      style: {
        width: '15%',
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('filters_configuration_table_v1.col_header_created'),
      field: 'created.date',
      style: {
        width: '15%',
      }
    }));

    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(params) {
    const ITEM = params?.item;

    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: ITEM?.ref }));
    RET_VAL.push(new TableItem({ data: ITEM?.type }));
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
        TABLE_ROWS.push(this.transformResponseItemToRow({
          item: ITEM
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

  isShowRowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }
}
