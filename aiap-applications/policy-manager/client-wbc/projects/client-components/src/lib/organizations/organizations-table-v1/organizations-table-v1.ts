/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, EventEmitter, Output, ViewChild, TemplateRef, OnDestroy, Input } from '@angular/core';

import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  TableHeaderItem,
  TableItem,
  NotificationService
} from 'carbon-components-angular';

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  QueryServiceV1,
  EventsServiceV1,
  TranslateHelperServiceV1
} from 'client-shared-services';

import {
  BaseTable,
} from 'client-shared-components';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  OrganizationsServiceV1,
  OrganizationsImportServiceV1,
  ClientSideDownloadServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-organizations-table-v1',
  templateUrl: './organizations-table-v1.html',
  styleUrls: ['./organizations-table-v1.scss'],
})
export class OrganizationsTableV1 extends BaseTable implements OnInit, OnDestroy {

  static getClassName() {
    return 'OrganizationsTableV1';
  }

  @Output() onShowPullPlace = new EventEmitter<any>();
  @Output() onSearchPlace = new EventEmitter<any>();
  @Output() onClearPlace = new EventEmitter<any>();
  @Output() onShowExportPlace = new EventEmitter<any>();

  @Input() isImport: boolean = false;

  @ViewChild('checkmarkTemplate', { static: true }) checkmarkTemplate: TemplateRef<any>;
  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  skeletonState: boolean = false;

  state: any = {
    queryType: DEFAULT_TABLE.ORGANIZATIONS_V1.TYPE,
    defaultSort: DEFAULT_TABLE.ORGANIZATIONS_V1.SORT,
    search: '',
  };

  isExportAllowed: boolean;
  isPullAllowed: boolean;

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationService,
    private organizationsService: OrganizationsServiceV1,
    private organizationsImportService: OrganizationsImportServiceV1,
    private clientSideDownloadServiceV1: ClientSideDownloadServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);

    const QUERY = this.queryService.query(this.state.queryType);
    this.state.search = QUERY?.filter?.search || '';

    super.ngOnInit();

    this.isExportAllowed = this.isExportActionEnabled() && !this.isImport;
    this.isPullAllowed = this.isPullActionEnabled() && !this.isImport;
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('organizations.organizations_table_v1.id_header'),
      field: 'id'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('organizations.organizations_table_v1.external_id_header'),
      field: 'external.id'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('organizations.organizations_table_v1.name_header'),
      field: 'name'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('organizations.organizations_table_v1.is_buyer_header'),
      sortable: false,
      visible: true
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('organizations.organizations_table_v1.is_seller_header'),
      sortable: false,
      visible: true
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('organizations.organizations_table_v1.is_authorized_header'),
      sortable: false,
      visible: true
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('organizations.organizations_table_v1.created_header'),
      field: 'created.date',
      style: { "width": "10%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('organizations.organizations_table_v1.updated_header'),
      field: 'updated.date',
      style: { "width": "10%" }
    }));

    this.model.header = TABLE_HEADER
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: item?.id }));
    RET_VAL.push(new TableItem({ data: item?.external?.id }));
    RET_VAL.push(new TableItem({ data: item?.name }));
    RET_VAL.push(new TableItem({ template: item?.isBuyer ? this.checkmarkTemplate : null }));
    RET_VAL.push(new TableItem({ template: item?.isSeller ? this.checkmarkTemplate : null }));
    RET_VAL.push(new TableItem({ template: item?.isAuthorized ? this.checkmarkTemplate : null }));
    RET_VAL.push(new TableItem({ data: item, template: this.createdTemplate }));
    RET_VAL.push(new TableItem({ data: item, template: this.updatedTemplate }));
    return RET_VAL;
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    let service = this.isImport ? this.organizationsImportService : this.organizationsService;
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query) => {
        if (query) {
          defaultQuery = query;
        }
        return service.findManyByQuery(defaultQuery).pipe(
          catchError((error: any) => this.handleFindManyByQueryError(error))
        );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugW(OrganizationsTableV1.getClassName(), `addFilterEventHandler`, { response });
      const NOTIFICATION = {
        type: 'success',
        title: this.translateService.instant('organizations.organizations_table_v1.notification.success.refresh.title'),
        message: this.translateService.instant('organizations.organizations_table_v1.notification.success.refresh.message'),
        target: '.notification-container',
        duration: 10000
      };
      this.notificationService.showNotification(NOTIFICATION);
      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
    });
  }

  handleFindManyByQueryError(error: any) {
    _errorW(OrganizationsTableV1.getClassName(), `handleFindManyByQueryError`, { error });
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('organizations.organizations_table_v1.notification.success.refresh.title'),
      message: this.translateService.instant('organizations.organizations_table_v1.notification.error.refresh.message'),
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'organizations.view.edit' });
    return RET_VAL;
  }

  emitShowPullPlace() {
    _debugW(OrganizationsTableV1.getClassName(), `emitShowPullPlace`, {});
    this.onShowPullPlace.emit({});
  }

  isPullActionEnabled() {
    let retVal = false;
    const IS_PULL_ACTION_ALLOWED = this.sessionService.isActionAllowed({ action: 'organizations.view.pull' });
    const TENANT = this.sessionService.getTenant();
    if (
      IS_PULL_ACTION_ALLOWED &&
      !lodash.isEmpty(TENANT?.pullTenant?.id)
    ) {
      retVal = true;
    }
    return retVal;
  }

  isExportActionEnabled() {
    let retVal = false;
    let isExportActionAllowed = this.sessionService.isActionAllowed({ action: 'rules.view.export' });
    if (isExportActionAllowed) {
      retVal = true;
    }
    return retVal;
  }

  emitShowExportPlace() {
    _debugW(OrganizationsTableV1.getClassName(), `emitShowExportPlace`, {});
    this.onShowExportPlace.emit({});
  }

  emitSearchPlace(event) {
    this.onSearchPlace.emit(event);
  }

  emitClearPlace(event) {
    this.onClearPlace.emit(event)
  }

  export() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    QUERY_PARAMS.pagination = {
      page: 1,
      size: 999999,
    };
    _debugW(OrganizationsTableV1.getClassName(), `export`, { QUERY_PARAMS });
    this.organizationsService.export(QUERY_PARAMS).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError(error => this.hanldeExportError(error)),
      takeUntil(this._destroyed$)
    ).subscribe((data) => {
      this.clientSideDownloadServiceV1.openSaveFileDialog(data, 'OrganizationsExport_' + new Date().toISOString() + '.xlsx', undefined);
      const NOTIFICATION = {
        type: 'success',
        title: this.translateService.instant('organizations.organizations_table_v1.notification.success.refresh.title'),
        messages: this.translateService.instant('organizations.organizations_table_v1.notification.success.export.message'),
        target: '.notification-container',
        duration: 10000
      };
      this.notificationService.showNotification(NOTIFICATION);
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
    });
  }

  hanldeExportError(error: any) {
    _debugW(OrganizationsTableV1.getClassName(), `handleExportError`, { error });
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('organizations.organizations_table_v1.notification.success.refresh.title'),
      message: this.translateService.instant('organizations.organizations_table_v1.notification.error.export.message'),
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of({ items: [] });
  }

  rowSelect(selectedItem) {
    const SELECTED_ROW_INDEX = selectedItem?.selectedRowIndex;
    const SELECTED_ROW_DATA = selectedItem?.model?._data?.[SELECTED_ROW_INDEX];
    this.selectedRows.push({
      rowData: SELECTED_ROW_DATA,
      rowIndex: SELECTED_ROW_INDEX
    });
  }

  rowDeselect(deselectedItem) {
    let filteredArray = this.selectedRows.filter(deselectedRow => deselectedRow?.rowIndex !== deselectedItem?.deselectedRowIndex);
    this.selectedRows = filteredArray;
  }

  selectAllRows(allRows) {
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
    if (!lodash.isEmpty(this.selectedRows)) {
      return false
    } else {
      return true
    }
  }

  emitRemovePlace() {
    let selectedIds = [];
    const TABLE_ITEMS = this.response?.items;
    for (const selectedItem of this.selectedRows) {
      const SELECTED_INDEX = selectedItem?.rowIndex;
      selectedIds.push(TABLE_ITEMS[SELECTED_INDEX].id);
    };
    this.onShowRemovePlace.emit(selectedIds);
  }
}
