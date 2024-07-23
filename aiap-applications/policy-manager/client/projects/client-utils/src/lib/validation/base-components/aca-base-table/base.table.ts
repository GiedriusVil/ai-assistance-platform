/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Output, OnInit, OnDestroy, EventEmitter, Inject } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  TableModel,
} from 'carbon-components-angular';

import {
  _debugX,
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
  @Output() onRowSelection = new EventEmitter<any>();

  public model: TableModel;
  public response: any = {
    items: [],
    total: 0
  };
  private queryType: string;

  protected _isActionsClickAllowed: boolean = false;

  constructor(
    @Inject('QueryService') protected queryService: any,// [LEGO] need define inteface
    @Inject('EventsService') protected eventsService: any, // [LEGO] need define inteface
  ) { }

  public ngOnInit() {
    _debugX(BaseTable.getClassName(), 'ngOnInit', {});
    this.ensureModelExistance();
    this.constructTableHeader();
    this.addFilterEventHandler();
  }

  public ensureModelExistance() {
    _debugX(BaseTable.getClassName(), 'ensureModelExistance', {});
    if (lodash.isEmpty(this.model)) {
      this.model = new TableModel();
    }
  }

  public refreshTableModel() {
    _debugX(BaseTable.getClassName(), 'refreshTableModel', {});
    this.refreshTableDataRows();
    this.model.totalDataLength = this.response?.total;
    const PAGINATION = this.queryService.pagination(this.queryType);
    this.model.pageLength = PAGINATION.size;
    this.model.currentPage = PAGINATION.page;
  }

  public handleSortEvent(index: any) {
    _debugX(BaseTable.getClassName(), 'handleSortEvent', { index });
    this.queryService.handleSortByHeader(this.queryType, this.model, index);
  }

  public handleSelectPageEvent(page: any) {
    _debugX(BaseTable.getClassName(), 'handleSelectPageEvent', { page });
    this.queryService.handlePageChangeEvent(this.queryType, this.model, page);
  }

  public handleRefreshClickEvent(event: any) {
    _debugX(BaseTable.getClassName(), 'handleRefreshClickEvent', { event });
    this.eventsService.filterEmit(this.queryService.query(this.queryType))
  }

  public emitShowSavePlace(value = undefined) {
    _debugX(BaseTable.getClassName(), 'emitShowSavePlace', { value });
    const EVENT: any = {};
    if (lodash.isFinite(value)) {
      EVENT.value = ramda.path(['items', value], this.response);
    } else if (lodash.isObject(value)) {
      EVENT.value = value;
    }

    const IS_EDIT_ALLOWED = true;
    if (IS_EDIT_ALLOWED && !this._isActionsClickAllowed) {
      this.onShowSavePlace.emit(EVENT);
    }



    this._isActionsClickAllowed = false;
  }

  public emitShowDeletePlace(value) {
    _debugX(BaseTable.getClassName(), 'emitShowDeletePlace', { value });
    this.onShowDeletePlace.emit(value);
  }

  public emitShowImportPlace() {
    _debugX(BaseTable.getClassName(), 'emitShowImportPlace', {});
    const EVENT = {};
    this.onShowImportPlace.emit(EVENT);
  }

  public _allowActionsClick(event: any) {
    _debugX(BaseTable.getClassName(), `_allowActionsClick`, { event });
    this._isActionsClickAllowed = true;
  }

  public ngOnDestroy(): void {
    _debugX(BaseTable.getClassName(), 'ngOnDestroy', {});
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  refreshTableDataRows() {
    const TABLE_ROWS = [];
    if (
      !lodash.isEmpty(this.response.items) &&
      lodash.isArray(this.response.items)
    ) {
      for (let item of this.response.items) {
        TABLE_ROWS.push(this.transformResponseItemToRow(item));
      }
    }
    this.model.data = TABLE_ROWS;
  }

  public setQueryType(type) {
    this.queryType = type;
  }

  public onSelectRow(event: any): void {
    const SELECTED_INDEX: number = ramda.path(['selectedRowIndex'], event);
    this.response.items[SELECTED_INDEX].selected = true;
    this.onRowSelection.emit(this.getSelectedIds());
  }

  public onDeselectRow(event: any): void {
    const DESELECTED_INDEX: number = ramda.path(['deselectedRowIndex'], event);
    this.response.items[DESELECTED_INDEX].selected = false;
    this.onRowSelection.emit(this.getSelectedIds());
  }

  public onSelectAll(event: any): void {
    for (const item of this.response.items) {
      item.selected = true;
    };
    this.onRowSelection.emit(this.getSelectedIds());
  }

  public onDeselectAll(event: any): void {
    for (const item of this.response.items) {
      item.selected = false;
    };
    this.onRowSelection.emit(this.getSelectedIds());
  }

  public getSelectedIds() {
    const ITEMS: any[] = ramda.pathOr([], ['items'], this.response);
    const SELECTED_IDS = ITEMS.reduce((result, el) => {
      if (el.selected) {
        result.push(el.id);
      }
      return result;
    }, []);

    return SELECTED_IDS;
  }

  public getSelectedRowItems() {
    const ITEMS: any[] = ramda.pathOr([], ['items'], this.response);
    const SELECTED_ROWS = ITEMS.reduce((result, el) => {
      if (el.selected) {
        result.push(el);
      }
      return result;
    }, []);

    _debugX(BaseTable.getClassName(), `getSelectedRowItems`, { SELECTED_ROWS });
    return SELECTED_ROWS;
  }

  public getSelectedIndexes() {
    const ITEMS: any[] = ramda.pathOr([], ['items'], this.response);
    const SELECTED_INDEXES = ITEMS.reduce((result, el) => {
      if (el.selected) {
        result.push(ITEMS.indexOf(el));
      }
      return result;
    }, []);

    return SELECTED_INDEXES;
  }

  public removeIndexesFromTable(indexes: number[]): void {
    const ITEMS: any[] = lodash.cloneDeep(ramda.path(['items'], this.response));
    const FILTERED_ITEMS = ITEMS.filter((el, index) => {
      if (!indexes.includes(index)) {
        return el;
      };
    });
    this.response.items = FILTERED_ITEMS;
    this.response.total = FILTERED_ITEMS.length;
    this.refreshTableDataRows();
  }

  protected abstract constructTableHeader();

  protected abstract addFilterEventHandler();

  protected abstract transformResponseItemToRow(item: any);

  protected abstract isShowSavePlaceAllowed(): boolean;
}
