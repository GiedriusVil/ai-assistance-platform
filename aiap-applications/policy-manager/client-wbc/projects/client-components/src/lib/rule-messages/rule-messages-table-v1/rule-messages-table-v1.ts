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
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  QueryServiceV1,
  EventsServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseTableV1,
} from 'client-shared-components';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  ClientSideDownloadServiceV1,
  RuleMessagesImportServiceV1,
  RuleMessagesServiceV1,
} from 'client-services';



@Component({
  selector: 'aiap-rule-messages-table-v1',
  templateUrl: './rule-messages-table-v1.html',
  styleUrls: ['./rule-messages-table-v1.scss'],
})
export class RuleMessagesTableV1 extends BaseTableV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'RuleMessagesTableV1';
  }

  @Output() onShowPullPlace = new EventEmitter<any>();
  @Output() onShowExportPlace = new EventEmitter<any>();
  @Output() onSearchPlace = new EventEmitter<any>();
  @Output() onClearPlace = new EventEmitter<any>();

  @Output() onSaveMessage = new EventEmitter();
  @Output() onDeleteMessage = new EventEmitter();

  @Input() isImport: boolean;

  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  skeletonState: boolean = false;

  state: any = {
    search: '',
    query: {
      type: DEFAULT_TABLE.RULE_MESSAGES_V1.TYPE,
      sort: DEFAULT_TABLE.RULE_MESSAGES_V1.SORT,
    }
  };

  isExportAllowed: boolean;
  isPullAllowed: boolean;

  constructor(
    // super-services
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    // native-services
    private notificationService: NotificationService,
    private clientSideDownloadService: ClientSideDownloadServiceV1,
    private ruleMessagesImportService: RuleMessagesImportServiceV1,
    private ruleMessagesService: RuleMessagesServiceV1,
    private translateService: TranslateHelperServiceV1,

  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit(): void {
    super.setQueryType(this.state?.query?.type);
    this.queryService.setSort(this.state?.query?.type, this.state.defaultSort);

    const QUERY = this.queryService.query(this.state?.query?.type);
    this.state.search = QUERY?.filter?.search || '';

    this.isExportAllowed = this.sessionService.isActionAllowed({ action: 'messages.view.export' }) && !this.isImport;
    this.isPullAllowed = this.isPullActionEnabled() && !this.isImport;

    super.ngOnInit();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('rule_messages.table_v1.name_header'),
      field: 'name'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('rule_messages.table_v1.created_header'),
      field: 'created.date',
      style: { "width": "10%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('rule_messages.table_v1.updated_header'),
      field: 'updated.date',
      style: { "width": "10%" }
    }));
    this.model.header = TABLE_HEADER
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: item?.name }));
    RET_VAL.push(new TableItem({ data: item, template: this.createdTemplate }));
    RET_VAL.push(new TableItem({ data: item, template: this.updatedTemplate }));
    return RET_VAL;
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state?.query?.type);
    let service = this.isImport ? this.ruleMessagesImportService : this.ruleMessagesService;
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
      _debugX(RuleMessagesTableV1.getClassName(), `addFilterEventHandler`,
        {
          response
        });

      const NOTIFICATION = {
        type: 'success',
        title: this.translateService.instant('rule_messages.table_v1.notification.success.refresh_title'),
        target: '.notification-container',
        duration: 10000
      };
      this.notificationService.showNotification(NOTIFICATION);
      this.response = response;
      this.selectedRows = [];
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
    });
  }

  handleFindManyByQueryError(error: any) {
    _errorX(RuleMessagesTableV1.getClassName(), `handleFindManyByQueryError`,
      {
        error
      });

    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('rule_messages.table_v1.notification.error.refresh_title'),
      message: this.translateService.instant('rule_messages.table_v1.notification.error.refresh_message'),
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'messages.view.edit' });
    return RET_VAL;
  }

  emitShowPullPlace() {
    _debugX(RuleMessagesTableV1.getClassName(), `emitShowPullPlace`,
      {});
    this.onShowPullPlace.emit({});
  }

  isPullActionEnabled() {
    let retVal = false;
    let IS_PULL_ACTION_ALLOWED = this.sessionService.isActionAllowed({ action: 'messages.view.pull' });
    const TENANT = this.sessionService.getTenant();
    if (
      IS_PULL_ACTION_ALLOWED &&
      !lodash.isEmpty(TENANT?.pullTenant?.id)
    ) {
      retVal = true;
    }
    return retVal;
  }

  hanldeExportError(error: any) {
    _debugX(RuleMessagesTableV1.getClassName(), `handleExportError`,
      {
        error
      });

    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('rule_messages.table_v1.notification.error.refresh_title'),
      message: this.translateService.instant('rule_messages.table_v1.notification.error.export_message'),
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of({ items: [] });
  }

  handleExport() {
    _debugX(RuleMessagesTableV1.getClassName(), `handleExport`,
      {});
    this.ruleMessagesService.export()
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.hanldeExportError(error)),
        takeUntil(this._destroyed$)
      ).subscribe((data: any) => {
        this.clientSideDownloadService.openSaveFileDialog(data, 'rule-messages-export.xlsx', undefined);

        const NOTIFICATION = {
          type: 'success',
          title: this.translateService.instant('rule_messages.table_v1.notification.error.refresh_title'),
          message: this.translateService.instant('rule_messages.table_v1.notification.success.export_message'),
          target: '.notification-container',
          duration: 10000
        };
        this.notificationService.showNotification(NOTIFICATION);
        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
      });
  }

  emitSearchPlace(event: any) {
    this.onSearchPlace.emit(event);
  }

  emitClearPlace(event: any) {
    this.onClearPlace.emit(event)
  }

  rowSelect(selectedItem: any) {
    const SELECTED_ROW_INDEX = selectedItem?.selectedRowIndex;
    const SELECTED_ROW_DATA = selectedItem?.model?._data?.[SELECTED_ROW_INDEX];
    this.selectedRows.push({
      rowData: SELECTED_ROW_DATA,
      rowIndex: SELECTED_ROW_INDEX
    });
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
    if (!lodash.isEmpty(this.selectedRows)) {
      return false
    } else {
      return true
    }
  }

  emitRemovePlace() {
    const SELECTED_IDS = [];
    const TABLE_ITEMS = this.response?.items;
    for (const selectedItem of this.selectedRows) {
      const SELECTED_INDEX = selectedItem?.rowIndex;
      SELECTED_IDS.push(TABLE_ITEMS[SELECTED_INDEX].id);
    }
    this.onShowRemovePlace.emit(SELECTED_IDS);
  }
}
