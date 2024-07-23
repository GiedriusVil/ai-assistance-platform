/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, EventEmitter, Output, ViewChild, TemplateRef, OnDestroy, Input } from '@angular/core';
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
  _errorX
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
  AnswerStoresServiceV1,
} from 'client-services';

import { BaseTableV1 } from 'client-shared-components';

import {
  ANSWER_STORES_MESSAGES
} from '../../messages';

@Component({
  selector: 'aiap-answer-stores-table-v1',
  templateUrl: './answer-stores-table-v1.html',
  styleUrls: ['./answer-stores-table-v1.scss'],
})
export class AnswerStoresTableV1 extends BaseTableV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'AnswerStoresTableV1';
  }
  @Input() config;

  @Output() onShowAnswerPlace = new EventEmitter<any>();
  @Output() onFilterPanelOpenEvent = new EventEmitter<any>();

  @ViewChild('overflowActionsTemplate', { static: true }) overflowActionsTemplate: TemplateRef<any>;
  @ViewChild('releaseDateTemplate', { static: true }) releaseDateTemplate: TemplateRef<any>;
  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  skeletonState = false;
  filterIcon: string;
  response = {
    items: [],
    total: 0
  };
  state: any = {
    queryType: DEFAULT_TABLE.ANSWER_STORES.TYPE,
    defaultSort: DEFAULT_TABLE.ANSWER_STORES.SORT,
    search: '',
  };
  selectedRows: Array<any> = [];

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private answerStoresService: AnswerStoresServiceV1,
    private translateService: TranslateHelperServiceV1
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    this.syncSearchFieldInputWithQuery();
    this.filterIcon = this.config?.filterIcon;
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
    const AVAILABLE_ACTIONS = ['answer-stores.view.delete'];
    const ACTIONS_ALLOWED = this.sessionService.areActionsAllowed(AVAILABLE_ACTIONS);

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('answer_stores_table_v1.col_id.header'),
      field: 'id',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('answer_stores_table_v1.col_name.header'),
      field: 'name',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('answer_stores_table_v1.col_assistant.header'),
      field: 'assistantId',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('answer_stores_table_v1.col_updated.header'),
      field: 'updated.date',
      style: {
        width: '15%',
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('answer_stores_table_v1.col_created.header'),
      field: 'created.date',
      style: {
        width: '15%',
      }
    }));
    if (
      this.isShowRowSavePlaceAllowed()
    ) {
      TABLE_HEADER.push(new TableHeaderItem({ data: this.translateService.instant('answer_stores_table_v1.col_configuration.header'), sortable: false }));
    }
    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];

    RET_VAL.push(new TableItem({
      data: item.id,
    }));
    RET_VAL.push(new TableItem({
      data: {
        releaseDate: item.latestReleaseDeployedTime,
        name: item.name
      },
      template: this.releaseDateTemplate,
    }));
    RET_VAL.push(new TableItem({
      data: item.assistantId,
    }));
    RET_VAL.push(new TableItem({
      data: item,
      template: this.updatedTemplate,
    }));
    RET_VAL.push(new TableItem({
      data: item,
      template: this.createdTemplate,
    }));
    if (this.isShowRowSavePlaceAllowed()) {
      RET_VAL.push(new TableItem({
        data: item,
        template: this.overflowActionsTemplate,
      }));
    }

    return RET_VAL;
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query) => {
        if (
          query
        ) {
          defaultQuery = query;
        }
        return this.answerStoresService.findManyLiteByQuery(defaultQuery).pipe(
          catchError((error: any) => this.handleFindManyByQueryError(error))
        );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(AnswerStoresTableV1.getClassName(), `addFilterEventHandler`, { response });
      this.notificationService.showNotification(ANSWER_STORES_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY);
      this.response = response;
      this.refreshTableModel();
      this.selectedRows = [];
      this.eventsService.loadingEmit(false);
    });
  }

  handleFindManyByQueryError(error: any) {
    _errorX(AnswerStoresTableV1.getClassName(), `handleFindManyByQueryError`, { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(ANSWER_STORES_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'answer-stores.view.edit' });
    return RET_VAL;
  }

  rowSelect(selectedAnswerStore) {
    const SELECTED_ROW_INDEX = selectedAnswerStore.selectedRowIndex;
    const SELECTED_ROW_DATA = ramda.path(['model', '_data', SELECTED_ROW_INDEX], selectedAnswerStore);
    this.selectedRows.push({
      rowData: SELECTED_ROW_DATA,
      rowIndex: SELECTED_ROW_INDEX
    });
  }

  rowDeselect(deselectedAnswerStore) {
    const filteredArray = this.selectedRows.filter(deselectedRow => { return deselectedRow.rowIndex !== deselectedAnswerStore.deselectedRowIndex });
    this.selectedRows = filteredArray;
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    this.answerStoresService.exportMany(QUERY_PARAMS);
  }

  syncSearchFieldInputWithQuery() {
    const QUERY = this.queryService.query(this.state.queryType);
    if (!lodash.isEmpty(QUERY?.filter?.search)) {
      this.state.search = QUERY?.filter?.search;
    }
  }

  emitShowAnswerStorePlace(store) {
    if (!this._isActionsClickAllowed) {
      const TABLE_ITEMS = this.response?.items;
      const selectedAnswerStore = TABLE_ITEMS[store];
      this.onShowAnswerPlace.emit(selectedAnswerStore);
    }
    this._isActionsClickAllowed = false;
  }

  showAnswerStoreConfiguration(store) {
    this._isActionsClickAllowed = true;
    if (this.isShowRowSavePlaceAllowed()) {
      this.onShowSavePlace.emit(store);
    }
  }

  emitRemovePlace() {
    const selectedAnsverStoresIds = [];
    const TABLE_ITEMS = this.response?.items;
    for (const selectedItem of this.selectedRows) {
      const SELECTED_APP_INDEX = selectedItem?.rowIndex;
      selectedAnsverStoresIds.push(TABLE_ITEMS[SELECTED_APP_INDEX].id);
    }
    this.onShowRemovePlace.emit(selectedAnsverStoresIds);
  }

  emitSearchPlace(event) {
    this.onSearchPlace.emit(event);
  }

  emitClearPlace(event) {
    this.onClearPlace.emit(event);
  }

  emitShowPullPlaceEvent() {
    const SELECTED_ANSWER_STORES = this.retrieveSelectedRowsIdsAndPullConfigs();
    _debugX(BaseTableV1.getClassName(), `emitShowPullPlaceEvent`, { SELECTED_ANSWER_STORES });
    this.onShowPullPlace.emit(SELECTED_ANSWER_STORES);
  }

  private retrieveSelectedRowsIdsAndPullConfigs() {
    const RET_VAL = [];
    const TABLE_ITEMS = this.response?.items;

    for (const selectedRow of this.selectedRows) {
      const SELECTED_APP_INDEX = selectedRow?.rowIndex;
      const ANSWER_STORE_ID = TABLE_ITEMS[SELECTED_APP_INDEX].id;
      const ANSWER_STORE_PULL_CONFIG = TABLE_ITEMS[SELECTED_APP_INDEX].pullConfiguration;
      RET_VAL.push(
        {
          id: ANSWER_STORE_ID,
          pullConfiguration: ANSWER_STORE_PULL_CONFIG
        });
    }
    return RET_VAL;
  }

  selectAllRows(allRows) {
    const ROWS_DATA = allRows?._data;
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

  isPullDisabled() {
    const RET_VAL =
      !(
        !this.isEmptySelectedRows()
      );
    return RET_VAL;
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

  emitFilterPanelOpen() {
    this.onFilterPanelOpenEvent.emit();
  }
}
