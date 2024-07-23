/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, EventEmitter, Output, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  TableHeaderItem,
  TableItem,
  NotificationService
} from 'client-shared-carbon';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  TimezoneServiceV1,
  QueryServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  ApplicationsServiceV1,
} from 'client-services';

import {
  BaseTable,
} from 'client-shared-components';

@Component({
  selector: 'aiap-applications-table-v1',
  templateUrl: './applications-table-v1.html',
  styleUrls: ['./applications-table-v1.scss'],
})
export class ApplicationsTableV1 extends BaseTable implements OnInit, OnDestroy {

  static getClassName() {
    return 'ApplicationsTableV1';
  }

  @Output() onShowRemovePlace = new EventEmitter<any>();

  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;

  skeletonState = false;

  state: any = {
    queryType: DEFAULT_TABLE.APPLICATIONS.TYPE,
    defaultSort: DEFAULT_TABLE.APPLICATIONS.SORT,
    search: '',
  };

  selectedRows: Array<any> = [];

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationService,
    private applicationsService: ApplicationsServiceV1,
    private timezoneService: TimezoneServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    const QUERY = this.queryService.query(this.state.queryType);
    this.state.search = QUERY?.filter?.search;
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
      data: this.translateService.instant('applications_table_v1.col_name.header'),
      field: 'name',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('applications_table_v1.col_created.header'),
      field: 'created.date',
      style: {
        width: '15%',
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('applications_table_v1.col_updated.header'),
      field: 'updated.date',
      style: {
        width: '15%',
      }
    }));

    this.model.header = TABLE_HEADER;
  }

  userTimezone(data: any) {
    const RET_VAL = this.timezoneService.getTimeByUserTimezone(data);
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];

    RET_VAL.push(new TableItem({
      data: item?.name,
    }));
    RET_VAL.push(new TableItem({
      data: item,
      template: this.createdTemplate,
    }));
    RET_VAL.push(new TableItem({
      data: item,
      template: this.updatedTemplate,
    }));

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
        return this.applicationsService.findManyByQuery(defaultQuery).pipe(
          catchError((error: any) => this.handleFindManyByQueryError(error))
        );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(ApplicationsTableV1.getClassName(), `addFilterEventHandler`,
        {
          response,
        });

      const NOTIFICATION = {
        type: 'success',
        title: 'Applications',
        message: 'Have been refreshed!',
        target: '.notification-container',
        duration: 10000
      };
      this.notificationService.showNotification(NOTIFICATION);
      this.response = response;
      this.refreshTableModel();
      this.selectedRows = [];
      this.eventsService.loadingEmit(false);
    });
  }


  handleFindManyByQueryError(error: any) {
    _errorX(ApplicationsTableV1.getClassName(), `handleFindManyByQueryError`,
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: 'Applications',
      message: 'Unable to retrieve!',
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'applications.view.edit' });
    return RET_VAL;
  }

  rowSelect(selectedApplication) {
    const SELECTED_ROW_INDEX = selectedApplication.selectedRowIndex;
    const SELECTED_ROW_DATA = ramda.path(['model', '_data', SELECTED_ROW_INDEX], selectedApplication);
    this.selectedRows.push({
      rowData: SELECTED_ROW_DATA,
      rowIndex: SELECTED_ROW_INDEX
    });
  }

  rowDeselect(deselectedApplication) {
    const FILTERED_ARRAY = this.selectedRows.filter(deselectedRow => { return deselectedRow.rowIndex !== deselectedApplication.deselectedRowIndex });
    this.selectedRows = FILTERED_ARRAY;
  }

  emitRemovePlace() {
    const SELECTED_APPLICATIONS_IDS = [];
    const TABLE_ITEMS = this.response?.items;
    for (const selectedItem of this.selectedRows) {
      const SELECTED_APP_INDEX = selectedItem?.rowIndex;
      SELECTED_APPLICATIONS_IDS.push(TABLE_ITEMS[SELECTED_APP_INDEX].id);
    }
    this.onShowRemovePlace.emit(SELECTED_APPLICATIONS_IDS);
  }

  emitSearchPlace(event: any) {
    this.onSearchPlace.emit(event);
  }

  emitClearPlace(event: any) {
    this.onClearPlace.emit(event)
  }

  selectAllRows(allRows) {
    const ROWS_DATA = allRows?._data;
    ROWS_DATA.forEach((rowData, index) => {
      if (
        lodash.isEmpty(rowData)
      ) {
        return
      }
      this.selectedRows.push({
        rowData: rowData,
        rowIndex: index,
      });
    });
  }

  deselectAllRows() {
    this.selectedRows = [];
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    const SELECTED_IDS = this.retrieveSelectedRowsIds();
    this.applicationsService.exportMany(QUERY_PARAMS, SELECTED_IDS);
  }
}
