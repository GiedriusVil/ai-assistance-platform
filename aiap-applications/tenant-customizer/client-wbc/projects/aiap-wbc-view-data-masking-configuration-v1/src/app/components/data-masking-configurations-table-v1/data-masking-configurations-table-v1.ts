/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  TemplateRef,
  OnDestroy,
  } from '@angular/core';
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
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  QueryServiceV1,
  NotificationServiceV2,
  TranslateHelperServiceV1
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  DATA_MASKING_CONFIGURATIONS_MESSAGES,
} from '../../messages';

import {
  DataMaskingConfigurationsServiceV1,
} from 'client-services';

import {
  BaseTableV1
} from 'client-shared-components';

@Component({
  selector: 'aiap-data-masking-configurations-table-v1',
  templateUrl: './data-masking-configurations-table-v1.html',
  styleUrls: ['./data-masking-configurations-table-v1.scss'],
})
export class DataMaskingConfigurationsTableV1 extends BaseTableV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'DataMaskingConfigurationsTable';
  }

  @Output() onShowRemovePlace = new EventEmitter<any>();
  @Output() onSearchEvent = new EventEmitter<any>();
  @Output() onSearchClearEvent = new EventEmitter<any>();

  @ViewChild('isEnabledIcon', { static: true }) isEnabledIcon: TemplateRef<any>;
  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  state: any = {
    queryType: DEFAULT_TABLE.DATA_MASKING_CONFIGURATIONS_V1.TYPE,
    defaultSort: DEFAULT_TABLE.DATA_MASKING_CONFIGURATIONS_V1.SORT,
    search: '',
  };

  selectedRows: Array<any> = [];

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private dataMaskingConfigurationsService: DataMaskingConfigurationsServiceV1,
    private translateService: TranslateHelperServiceV1
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    this.syncSearchFieldInputWithQuery();
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('data_masking_configurations_table_v1.col_status.header'),
      field: 'enabled',
      sortable: false,
      style: { 'width': '5%' }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('data_masking_configurations_table_v1.col_key.header'),
      field: '_id',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('data_masking_configurations_table_v1.col_pattern_type.header'),
      field: 'patternType',
      style: { 'width': '15%' }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('data_masking_configurations_table_v1.col_replace_type.header'),
      field: 'replaceType',
      style: { 'width': '15%' }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('data_masking_configurations_table_v1.col_updated.header'),
      field: 'updated.date',
      style: { 'width': '15%' }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('data_masking_configurations_table_v1.col_created.header'),
      field: 'created.date',
      style: { 'width': '15%' }
    }));
    this.model.header = TABLE_HEADER
  }

  transformResponseItemToRow(params) {
    const ITEM = params;
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: ITEM, template: this.isEnabledIcon }));
    RET_VAL.push(new TableItem({ data: ITEM?.key }));
    RET_VAL.push(new TableItem({ data: ITEM?.patternType }));
    RET_VAL.push(new TableItem({ data: ITEM?.replaceType }));
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
        const ITEM = ramda.path(['items', index], this.response);
        TABLE_ROWS.push(this.transformResponseItemToRow(ITEM));
      }
    }
    this.model.data = TABLE_ROWS;
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap(query => {
        if (query) {
          defaultQuery = query;
        }
        _debugX(DataMaskingConfigurationsTableV1.getClassName(), `addFilterEventHandler`, { this_query: defaultQuery });
        return this.dataMaskingConfigurationsService.findManyByQuery(defaultQuery).pipe(
          catchError((error) => this.handleFindManyByQueryError(error))
        );
      }
      ),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(DataMaskingConfigurationsTableV1.getClassName(), `addFilterEventHandler`, { response });
      this.response = response;
      this.refreshTableModel();
      this.selectedRows = [];
      this.notificationService.showNotification(DATA_MASKING_CONFIGURATIONS_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY);
      this.eventsService.loadingEmit(false);
    });
  }

  handleFindManyByQueryError(error: any) {
    _errorX(DataMaskingConfigurationsTableV1.getClassName(), `handleFindManyByQueryError`, { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(DATA_MASKING_CONFIGURATIONS_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'data-masking-configurations.view.edit' });
    return RET_VAL;
  }

  syncSearchFieldInputWithQuery() {
    const QUERY = this.queryService.query(this.state.queryType);
    if (!lodash.isEmpty(QUERY.filter.search)) {
      this.state.search = QUERY.filter.search;
    }
  }

  rowSelect(selected) {
    const SELECTED_ROW_INDEX = selected.selectedRowIndex;
    const SELECTED_ROW_DATA = ramda.path(['model', '_data', SELECTED_ROW_INDEX], selected);
    this.selectedRows.push({
      rowData: SELECTED_ROW_DATA,
      rowIndex: SELECTED_ROW_INDEX
    });
  }

  rowDeselect(deselected) {
    const filteredArray = this.selectedRows.filter(deselectedRow => { return deselectedRow.rowIndex !== deselected.deselectedRowIndex });
    this.selectedRows = filteredArray;
  }

  selectAllRows(allRows) {
    const ROWS_DATA = ramda.path(['_data'], allRows);
    ROWS_DATA.forEach((rowData, index) => {
      if (lodash.isEmpty(rowData)) {
        return
      }
      this.selectedRows.push({
        rowData: rowData,
        rowIndex: index
      });
    });
  }

  deselectAllRows() {
    this.selectedRows = [];
  }

  isRemoveDisabled() {
    if (!lodash.isEmpty(this.selectedRows)) {
      return false;
    } else {
      return true;
    }
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    this.dataMaskingConfigurationsService.exportMany(QUERY_PARAMS);
  }

  emitRemovePlace() {
    const REMOVE_CONFIG_KEYS = [];
    const TABLE_ITEMS = ramda.path(['items'], this.response);
    for (const selectedItem of this.selectedRows) {
      const SELECTED_CONFIG_INDEX = ramda.path(['rowIndex'], selectedItem);
      REMOVE_CONFIG_KEYS.push(TABLE_ITEMS[SELECTED_CONFIG_INDEX].key);
    }
    _debugX(DataMaskingConfigurationsTableV1.getClassName(), 'emitRemovePlace', { REMOVE_CONFIG_KEYS });
    this.onShowRemovePlace.emit(REMOVE_CONFIG_KEYS);
  }

  emitSearchEvent(event: any) {
    this.onSearchEvent.emit(event);
  }

  emitSearchClearEvent() {
    this.onSearchClearEvent.emit();
  }

}
