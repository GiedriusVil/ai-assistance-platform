/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import { Component, OnInit, EventEmitter, Output, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

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
  TimezoneServiceV1,
  QueryServiceV1,
  NotificationServiceV2,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseTableV1,
} from 'client-shared-components';

import {
  DEFAULT_TABLE,
  LAMBDA_MODULES_CONFIGURATIONS_MESSAGES
} from 'client-utils';

import {
  LambdaModulesConfigurationsServiceV1,
} from 'client-services';


@Component({
  selector: 'aiap-lambda-modules-configurations-table-v1',
  templateUrl: './lambda-modules-configurations-table-v1.html',
  styleUrls: ['./lambda-modules-configurations-table-v1.scss'],
})
export class LambdaModulesConfigurationsTableV1 extends BaseTableV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'LambdaModulesConfigurationsTableV1';
  }

  @Output() onSearchChangeEvent = new EventEmitter<any>();
  @Output() onSearchClearEvent = new EventEmitter<any>();
  @Output() onShowPullPlace = new EventEmitter<any>();

  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;

  skeletonState = false;

  state: any = {
    search: '',
    query: {
      type: DEFAULT_TABLE.LAMBDA_CONFIGURATIONS.TYPE,
      sort: DEFAULT_TABLE.LAMBDA_CONFIGURATIONS.SORT,
    }
  };

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private lambdaModulesConfigurationsService: LambdaModulesConfigurationsServiceV1,
    private timezoneService: TimezoneServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
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
      data: this.translateService.instant('lambda_modules_configurations_table_v1.col_key.header'),
      field: 'key'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('lambda_modules_configurations_table_v1.col_updated.header'),
      field: 'updated.date',
      style: {
        width: '15%'
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('lambda_modules_configurations_table_v1.col_created.header'),
      field: 'created.date',
      style: {
        width: '15%'
      }
    }));
    this.model.header = TABLE_HEADER
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];

    RET_VAL.push(new TableItem({ data: item?.key }));
    RET_VAL.push(new TableItem({ data: item, template: this.updatedTemplate }));
    RET_VAL.push(new TableItem({ data: item, template: this.createdTemplate }));

    return RET_VAL;
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query) => {
        if (query) {
          defaultQuery = query;
        }
        return this.lambdaModulesConfigurationsService.findManyByQuery(defaultQuery).pipe(
          catchError((error: any) => this.handleFindManyByQueryError(error))
        );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(LambdaModulesConfigurationsTableV1.getClassName(), `addFilterEventHandler`, { response });
      this.notificationService.showNotification(LAMBDA_MODULES_CONFIGURATIONS_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY);
      this.response = response;
      this.eventsService.loadingEmit(false);
      this.refreshTableModel();
    });
  }

  handleFindManyByQueryError(error: any) {
    _errorX(LambdaModulesConfigurationsTableV1.getClassName(), `handleFindManyByQueryError`, { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(LAMBDA_MODULES_CONFIGURATIONS_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'lambda-modules-configurations.view.edit' });
    return RET_VAL;
  }

  emitSearchChangeEvent(event: any) {
    this.onSearchChangeEvent.emit(event);
  }

  emitSearchClearEvent() {
    this.onSearchClearEvent.emit();
  }

  rowSelect(selectedItem: any) {
    const SELECTED_ROW_INDEX = selectedItem?.selectedRowIndex;
    const SELECTED_ROW_DATA = selectedItem?.model?._data?.[SELECTED_ROW_INDEX];
    this.selectedRows.push({
      rowData: SELECTED_ROW_DATA,
      rowIndex: SELECTED_ROW_INDEX
    });
    _debugX(LambdaModulesConfigurationsTableV1.getClassName(), 'rowSelect', {
      selectedItem: selectedItem,
      this_selected_rows: this.selectedRows,
    })
  }

  rowDeselect(deselectedItem: any) {
    const FILTERED_ARRAY = this.selectedRows.filter(deselectedRow => deselectedRow?.rowIndex !== deselectedItem?.deselectedRowIndex);
    this.selectedRows = FILTERED_ARRAY;
  }

  selectAllRows(allRows: any) {
    const ROWS_DATA = allRows?._data || [];
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
    if (
      !lodash.isEmpty(this.selectedRows)
    ) {
      return false;
    } else {
      return true;
    }
  }

  emitRemovePlace() {
    const SELECTED_ITEMS = [];
    const TABLE_ITEMS = this.response?.items;
    for (const selectedItem of this.selectedRows) {
      const SELECTED_INDEX = selectedItem?.rowIndex;
      SELECTED_ITEMS.push(TABLE_ITEMS[SELECTED_INDEX]);
    }
    _debugX(LambdaModulesConfigurationsTableV1.getClassName(), 'emitRemovePlace', { SELECTED_ITEMS })
    this.onShowRemovePlace.emit(SELECTED_ITEMS);
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    this.lambdaModulesConfigurationsService.exportMany(QUERY_PARAMS);
  }
}
