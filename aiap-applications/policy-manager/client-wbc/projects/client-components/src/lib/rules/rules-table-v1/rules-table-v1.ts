/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, EventEmitter, Output, ViewChild, TemplateRef, OnDestroy, Input } from '@angular/core';

import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  NotificationService,
  TableHeaderItem,
  TableItem,
} from 'carbon-components-angular';

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import {
  ActivatedRouteServiceV1, // TODO -> LEGO -> This one might be an issue!!!
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
  RulesImportServiceV1,
  RulesServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-rules-table-v1',
  templateUrl: './rules-table-v1.html',
  styleUrls: ['./rules-table-v1.scss'],
})
export class RulesTableV1 extends BaseTable implements OnInit, OnDestroy {

  static getClassName() {
    return 'RulesTableV1';
  }

  @Output() onShowPullPlace = new EventEmitter<any>();
  @Output() onShowExportPlace = new EventEmitter<any>();
  @Output() onSearchPlace = new EventEmitter<any>();
  @Output() onClearPlace = new EventEmitter<any>();

  @Output() onSaveRule = new EventEmitter();
  @Output() onDeleteRule = new EventEmitter();

  @Input() isImport: boolean = false;

  @ViewChild('warningTemplate', { static: true }) warningTemplate: TemplateRef<any>;
  @ViewChild('checkTemplate', { static: true }) checkTemplate: TemplateRef<any>;
  @ViewChild('pauseTemplate', { static: true }) pauseTemplate: TemplateRef<any>;
  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  skeletonState: boolean = false;

  state: any = {
    queryType: DEFAULT_TABLE.RULES_V1.TYPE,
    defaultSort: DEFAULT_TABLE.RULES_V1.SORT,
    search: '',
  };

  isExportAllowed: boolean;
  isPullAllowed: boolean;

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationService,
    private rulesImportService: RulesImportServiceV1,
    private rulesService: RulesServiceV1,
    private ActivatedRouteServiceV1: ActivatedRouteServiceV1,
    private translateService: TranslateHelperServiceV1,

  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit(): void {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);

    const QUERY = this.queryService.query(this.state.queryType);
    this.state.search = QUERY?.filter?.search || '';

    super.ngOnInit();
    this.checkImmediateEditMode();

    this.isExportAllowed = this.isExportActionEnabled() && !this.isImport;
    this.isPullAllowed = this.isPullActionEnabled() && !this.isImport;
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('rules.rules_table_v1.id_header'),
      field: 'id'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
        data: this.translateService.instant('rules.rules_table_v1.buyer_id_header'),
        field: 'buyer.id'
      }));
    TABLE_HEADER.push(new TableHeaderItem({
        data: this.translateService.instant('rules.rules_table_v1.buyer_name_header'),
        field: 'buyer.name'
      }));
    TABLE_HEADER.push(new TableHeaderItem({
        data: this.translateService.instant('rules.rules_table_v1.status_header'),
        field: 'status'
      }));
    TABLE_HEADER.push(new TableHeaderItem({
        data: this.translateService.instant('rules.rules_table_v1.name_header'),
        field: 'name'
      }));
    TABLE_HEADER.push(new TableHeaderItem({
        data: this.translateService.instant('rules.rules_table_v1.type_header'),
        field: 'type'
      }));
    TABLE_HEADER.push(new TableHeaderItem({
        data: this.translateService.instant('rules.rules_table_v1.created_header'),
        field: 'created.date',
        style: { 'width': '10%' }
      }));
    TABLE_HEADER.push(new TableHeaderItem({
        data: this.translateService.instant('rules.rules_table_v1.updated_header'),
        field: 'updated.date',
        style: { 'width': '10%' }
      }));

    this.model.header = TABLE_HEADER;
  }

  checkImmediateEditMode() {
    this.ActivatedRouteServiceV1.queryParams()
      .subscribe(params => {
      const ID = params?.id;
      if (
        !lodash.isEmpty(ID)
      ) {
        this.rulesService.findOneById(ID).subscribe(rule => {
          if (!lodash.isEmpty(rule)) {
            this.emitShowSavePlace(rule);
          }
        });
      }
    });
  }

  transformResponseItemToRow(item: any) {
    const RET_VAL = [];
    if (item) {
      RET_VAL.push(new TableItem({ data: item?.id }));
      RET_VAL.push(new TableItem({ data: item?.buyer?.id }));
      RET_VAL.push(new TableItem({ data: item?.buyer?.name }));
      RET_VAL.push(new TableItem({ data: item, template: this.getStatusTemplate(item) }));
      RET_VAL.push(new TableItem({ data: item?.name }));
      RET_VAL.push(new TableItem({ data: item?.type }));
      RET_VAL.push(new TableItem({ data: item, template: this.createdTemplate }));
      RET_VAL.push(new TableItem({ data: item, template: this.updatedTemplate }));
    }
    return RET_VAL;
  }

  getStatusTemplate(item: any) {
    if (!lodash.isEmpty(item)) {
      const MESSAGE_EXISTS = item?.status?.selectedMessageExists;
      const BUYER_EXISTS = item?.status?.selectedBuyerExists;
      const BUYER_ID = item?.buyer?.id;
      const IS_RULE_ENABLED = item?.status?.enabled;

      if (!MESSAGE_EXISTS || !BUYER_EXISTS || lodash.isNil(BUYER_ID)) {
        return this.warningTemplate;
      } 
      else if (!IS_RULE_ENABLED) {
        return this.pauseTemplate;
      } 
      else if (MESSAGE_EXISTS) {
        return this.checkTemplate;
      }
    }
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    let service = this.isImport ? this.rulesImportService : this.rulesService;
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
        _debugW(RulesTableV1.getClassName(), `addFilterEventHandler`, { response });

        const NOTIFICATION = {
          type: 'success',
          title: this.translateService.instant('rules_table_v1.notification.rules_refreshed_title'),
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
    _errorW(RulesTableV1.getClassName(), `handleFindManyByQueryError`, { error });

    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('rules_table_v1.notification.error.rules_refreshed_title'),
      message: this.translateService.instant('rules_table_v1.notification.error.rules_refreshed_message'),
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'rules.view.edit' });
    return RET_VAL;
  }

  emitShowPullPlace() {
    _debugW(RulesTableV1.getClassName(), `emitShowPullPlace`, {});

    this.onShowPullPlace.emit({});
  }


  isPullActionEnabled() {
    let retVal = false;
    let IS_PULL_ACTION_ALLOWED = this.sessionService.isActionAllowed({ action: 'rules.view.pull' });
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
    let IS_EXPORT_ACTION_ALLOWED = this.sessionService.isActionAllowed({ action: 'rules.view.export' });
    if (IS_EXPORT_ACTION_ALLOWED) {
      retVal = true;
    }
    return retVal;
  }

  emitShowExportPlace() {
    _debugW(RulesTableV1.getClassName(), `emitShowExportPlace`, {});

    this.onShowExportPlace.emit({});
  }

  emitSearchPlace(event: any) {
    this.onSearchPlace.emit(event);
  }

  emitClearPlace(event: any) {
    this.onClearPlace.emit(event);
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    this.rulesService.export(QUERY_PARAMS);
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

  isEnableMultipleDisabled() {
    let enabledSelected = false;
    let disabledSelected = false;

    const TABLE_ITEMS = this.response?.items;
    for (const selectedItem of this.selectedRows) {
      const SELECTED_INDEX = selectedItem?.rowIndex;
      const IS_RULE_ENABLED = TABLE_ITEMS[SELECTED_INDEX]?.status?.enabled;
      if (IS_RULE_ENABLED) {
        enabledSelected = true;
      } else {
        disabledSelected = true;
      }
    }

    if (enabledSelected && disabledSelected || lodash.isEmpty(this.selectedRows)) {
      return true;
    } else return false;
  }

  isEnableOrDisable() {
    let enabledSelected = false;
    let disabledSelected = false;

    const TABLE_ITEMS = this.response?.items;
    for (const selectedItem of this.selectedRows) {
      const SELECTED_INDEX = selectedItem?.rowIndex;
      const IS_RULE_ENABLED = TABLE_ITEMS[SELECTED_INDEX]?.status?.enabled;
      if (IS_RULE_ENABLED) {
        enabledSelected = true;
      } else {
        disabledSelected = true;
      }
    }

    if (enabledSelected && !disabledSelected) {
      return false;
    } else if (!enabledSelected && disabledSelected) {
      return true;
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

  emitEnablePlace() {
    let selectedIds = [];
    const TABLE_ITEMS = this.response?.items;
    for (const selectedItem of this.selectedRows) {
      const SELECTED_INDEX = selectedItem?.rowIndex;
      selectedIds.push(TABLE_ITEMS[SELECTED_INDEX].id);
    };
    this.onShowEnablePlace.emit(selectedIds);
  }
}
