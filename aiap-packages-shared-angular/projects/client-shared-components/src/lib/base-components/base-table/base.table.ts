/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  TableModel,
} from 'client-shared-carbon';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  sanitizeIBMOverflowMenuPaneElement,
} from 'client-shared-utils';

/**
 * This is abstract class which has to be extended for each view which is going to be developed!
 */
@Component({
  template: ''
})
export abstract class BaseTable implements OnInit, OnDestroy {

  static getClassName() {
    return 'BaseTable';
  }

  public _destroyed$: Subject<void> = new Subject();

  @Output() onShowSavePlace = new EventEmitter<any>();
  @Output() onShowImportPlace = new EventEmitter<any>();
  @Output() onShowDeletePlace = new EventEmitter<any>();

  @Output() onShowRemovePlace = new EventEmitter<any>();
  @Output() onShowEnablePlace = new EventEmitter<any>();
  @Output() onSearchPlace = new EventEmitter<any>();
  @Output() onClearPlace = new EventEmitter<any>();

  @Output() onShowSyncPlace = new EventEmitter<any>();
  @Output() onShowPullPlace = new EventEmitter<any>();

  public model: TableModel;
  public response: any = {
    items: [],
    total: 0
  };
  public selectedRows: Array<any> = [];
  public skeletonState = false;
  public skeleton = false;
  public showSelectionColumn = true;
  private queryType: string;

  protected _isActionsClickAllowed = false;

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1 = undefined,
  ) { }

  public ngOnInit() {
    this.ensureModelExistance();
    this.constructTableHeader();
    this.addFilterEventHandler();
    this.addLoadingEventHandler();
    this.refreshTableHeader();
  }

  public ensureModelExistance() {
    if (
      lodash.isEmpty(this.model)
    ) {
      this.model = new TableModel();
    }
  }

  public refreshTableHeader() {
    const SORT_ITEM = this.queryService.getSortItem(this.queryType);
    if (lodash.isObject(SORT_ITEM) && lodash.isEmpty(SORT_ITEM)) {
      this.model.header.map(item => item.sorted = false);
    } else if (!lodash.isEmpty(SORT_ITEM)) {
      const CONDITION = (item) => item.field === SORT_ITEM.field;
      const INDEX = this.model.header.findIndex(CONDITION);
      const DIRECTION = (SORT_ITEM.direction === 'asc') ? true : false;

      if (INDEX === -1) {
        return;
      }

      this.model.header[INDEX].sorted = true;
      this.model.header[INDEX].ascending = DIRECTION;
    }
  }

  public refreshTableModel() {
    this.refreshTableDataRows();
    this.model.totalDataLength = this.response?.total;
    const PAGINATION = this.queryService.pagination(this.queryType);
    this.model.pageLength = PAGINATION.size;
    this.model.currentPage = PAGINATION.page;
  }

  public handleSortEvent(index: any) {
    this.handleEventSort(index);
  }

  public handleEventSort(index: any) {
    this.queryService.handleSortByHeader(
      this.queryType,
      this.model,
      index,
    );
    _debugX(BaseTable.getClassName(), 'handleEventSort',
      {
        index: index,
      });
  }

  public handleSelectPageEvent(page: any) {
    this.handleEventPageSelect(page);
  }

  public handleEventPageSelect(page: any) {
    _debugX(BaseTable.getClassName(), 'handleEventPageSelect', { page });
    this.queryService.handlePageChangeEvent(this.queryType, this.model, page);
  }

  public emitShowSavePlace(value = undefined) {
    if (this._isActionsClickAllowed) {
      this._isActionsClickAllowed = false;
      return;
    }
    const IS_EDIT_ALLOWED = this.isShowRowSavePlaceAllowed();
    if (lodash.isUndefined(value)) {
      _debugX(BaseTable.getClassName(), 'emitShowSavePlace', {
        value,
      });
      this.onShowSavePlace.emit();
    } else if (IS_EDIT_ALLOWED) {
      const EVENT: any = {};
      if (
        lodash.isFinite(value)
      ) {
        EVENT.value = this.response?.items?.[value];
      } else if (
        lodash.isObject(value)
      ) {
        EVENT.value = value;
      }
      _debugX(BaseTable.getClassName(), 'emitShowSavePlace', {
        value,
        IS_EDIT_ALLOWED,
        EVENT,
      });
      this.onShowSavePlace.emit(EVENT);
    }
  }

  public emitShowDeletePlace(value) {
    const EVENT = lodash.cloneDeep(value);
    _debugX(BaseTable.getClassName(), 'emitShowDeletePlace', { EVENT });
    this.onShowDeletePlace.emit(EVENT);
  }

  public emitShowImportPlace() {
    const EVENT = {};
    _debugX(BaseTable.getClassName(), 'emitShowImportPlace', { EVENT });
    this.onShowImportPlace.emit(EVENT);
  }

  public emitSearchPlace(event) {
    _debugX(BaseTable.getClassName(), 'emitSearchPlace', { event });
    this.onSearchPlace.emit(event);
  }

  public emitClearPlace(event) {
    _debugX(BaseTable.getClassName(), 'emitClearPlace', { event });
    this.onClearPlace.emit(event)
  }

  public emitShowSyncPlaceEvent() {
    const SELECTED_IDS = this.retrieveSelectedRowsIds();
    _debugX(BaseTable.getClassName(), `emitShowSyncPlaceEvent`, { SELECTED_IDS });
    this.onShowSyncPlace.emit(SELECTED_IDS);
  }

  public emitShowPullPlaceEvent() {
    const SELECTED_IDS = this.retrieveSelectedRowsIds();
    _debugX(BaseTable.getClassName(), `emitShowPullPlaceEvent`, { SELECTED_IDS });
    this.onShowPullPlace.emit(SELECTED_IDS);
  }

  public emitRemovePlace() {
    const SELECTED_IDS = this.retrieveSelectedRowsIds();
    _debugX(BaseTable.getClassName(), `emitRemovePlace`,
      {
        SELECTED_IDS,
      });
    this.onShowRemovePlace.emit(SELECTED_IDS);
    this.deselectAllRows();
  }
  public emitEnablePlace() {
    const SELECTED_IDS = this.retrieveSelectedRowsIds();
    _debugX(BaseTable.getClassName(), `emitEnablePlace`,
      {
        SELECTED_IDS,
      });
    this.onShowEnablePlace.emit(SELECTED_IDS);
  }

  public _allowActionsClick(event: any) {
    _debugX(BaseTable.getClassName(), `_allowActionsClick`, { event });
    this._isActionsClickAllowed = true;
  }

  /**
  * 
  * @deprecated -> Use BaseTableV1.handleEventAllSelect(...)!
  */
  public selectAllRows(event: any) {
    this.handleEventAllSelect(event);
  }

  public handleEventAllSelect(event: any) {
    const ROWS_DATA = event?._data;
    ROWS_DATA.forEach((rowData, index) => {
      if (lodash.isEmpty(rowData)) {
        return
      }
      this.selectedRows.push({
        rowData: rowData,
        rowIndex: index
      });
    });
    _debugX(BaseTable.getClassName(), 'handleEventAllSelect',
      {
        event: event,
        this_selectedRows: this.selectAllRows,
      });
  }

  /**
  * 
  * @deprecated -> Use BaseTableV1.handleEventAllDeselect(...)!
  */
  public deselectAllRows(event: any = null) {
    this.handleEventAllDeselect(event);
  }


  public handleEventAllDeselect(event: any = null) {
    this.selectedRows = [];
    _debugX(BaseTable.getClassName(), 'handleEventAllSelect',
      {
        event: event,
        this_selectedRows: this.selectAllRows,
      });
  }

  public ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
    sanitizeIBMOverflowMenuPaneElement(BaseTable.getClassName(), document);
  }

  public refreshTableDataRows() {
    const TABLE_ROWS = [];
    if (
      !lodash.isEmpty(this.response.items) &&
      lodash.isArray(this.response.items)
    ) {
      for (const ITEM of this.response.items) {
        TABLE_ROWS.push(this.transformResponseItemToRow(ITEM));
      }
    }
    this.model.data = TABLE_ROWS;
  }

  /**
  * 
  * @deprecated -> Use BaseTableV1.handleEventRowSelect(...)!
  */
  public rowSelect(row: any) {
    this.handleEventRowSelect(row)
  }

  public handleEventRowSelect(row: any) {
    const SELECTED_ROW_INDEX = row.selectedRowIndex;
    const SELECTED_ROW_DATA = ramda.path(['model', '_data', SELECTED_ROW_INDEX], row);
    this.selectedRows.push({
      rowData: SELECTED_ROW_DATA,
      rowIndex: SELECTED_ROW_INDEX
    });
    _debugX(BaseTable.getClassName(), 'handleEventRowSelect',
      {
        row: row,
        this_selectedRows: this.selectAllRows,
      });
  }

  public isEmptySelectedRows() {
    return lodash.isEmpty(this.selectedRows)
  }

  public isRemoveDisabled() {
    if (
      this.isEmptySelectedRows()
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
 * 
 * @deprecated -> Use BaseTableV1.handleEventRowDeselect(...)!
 */
  public rowDeselect(row: any) {
    this.handleEventRowDeselect(row);
  }

  public handleEventRowDeselect(row: any) {
    const FILTERED_ARRAY = this.selectedRows.filter((selectedRow: any) => {
      const RET_VAL = selectedRow.rowIndex !== row?.deselectedRowIndex;
      return RET_VAL;
    });
    this.selectedRows = FILTERED_ARRAY;
    _debugX(BaseTable.getClassName(), 'handleEventRowDeselect',
      {
        row: row,
        this_selectedRows: this.selectAllRows,
      });
  }

  public handleRefreshClickEvent(event: any) {
    _debugX(BaseTable.getClassName(), 'handleRefreshClickEvent', { event });
    if (
      this.eventsService
    ) {
      this.eventsService.filterEmit(null);
    }
  }

  public setQueryType(type) {
    this.queryType = type;
  }

  private addLoadingEventHandler() {
    if (
      this.eventsService
    ) {
      this.eventsService.loadingEmitter.subscribe((event) => {
        if (
          lodash.isBoolean(event) &&
          event
        ) {
          this.skeleton = true;
        } else {
          this.skeleton = false;
        }
      });
    }
  }

  protected abstract constructTableHeader();

  protected abstract addFilterEventHandler();

  protected abstract transformResponseItemToRow(item: any);

  protected abstract isShowRowSavePlaceAllowed(): boolean;

  protected retrieveSelectedRowsIds() {
    const RET_VAL = [];
    const TABLE_ITEMS = ramda.path(['items'], this.response);
    for (const selectedRow of this.selectedRows) {
      const SELECTED_APP_INDEX = ramda.path(['rowIndex'], selectedRow);
      RET_VAL.push(TABLE_ITEMS[SELECTED_APP_INDEX].id);
    };
    return RET_VAL;
  }
}
