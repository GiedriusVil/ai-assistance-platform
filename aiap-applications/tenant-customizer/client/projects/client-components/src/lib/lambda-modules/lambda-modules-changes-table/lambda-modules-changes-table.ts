/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import moment from 'moment';
import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { TableHeaderItem, TableItem } from 'carbon-components-angular';

import { _debugX, _errorX, StripTextPipe } from 'client-shared-utils';

import { SessionServiceV1, EventsServiceV1, TimezoneServiceV1, QueryServiceV1, NotificationServiceV2, TranslateHelperServiceV1 } from 'client-shared-services';

import { DEFAULT_TABLE, ExcelJson } from 'client-utils';

import { DataExportService, LambdaModulesChangesService } from 'client-services';

import { BaseTable } from 'client-shared-components';

@Component({
  selector: 'aca-lambda-modules-changes-table',
  templateUrl: './lambda-modules-changes-table.html',
  styleUrls: ['./lambda-modules-changes-table.scss'],
})
export class LambdaModulesChangesTable extends BaseTable implements OnInit, AfterViewInit {
  static getClassName() {
    return 'LambdaModulesChangesTable';
  }

  @Output() onSearchChangeEvent = new EventEmitter<any>();
  @Output() onSearchClearEvent = new EventEmitter<any>();

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  skeletonState = false;
  state = {
    queryType: DEFAULT_TABLE.LAMBDA_CHANGES.TYPE,
    defaultSort: DEFAULT_TABLE.LAMBDA_CHANGES.SORT,
    search: '',
  };

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationServiceV2,
    private timezoneService: TimezoneServiceV1,
    private lambdaModulesChangesService: LambdaModulesChangesService,
    private stripText: StripTextPipe,
    private dataExportService: DataExportService,
    private translateService: TranslateHelperServiceV1
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    super.ngOnInit();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        switchMap((query) => {
          if (query) {
            defaultQuery = query;
          }
          return this.lambdaModulesChangesService.findManyByQuery(defaultQuery).pipe(catchError((error) => this.handleFindAnswersByQueryError(error)));
        }),
        takeUntil(this._destroyed$)
      )
      .subscribe((response: any) => {
        _debugX(LambdaModulesChangesTable.getClassName(), `addFilterEventHandler`, { response });
        this.response = response;
        this.refreshTableModel();
        this.eventsService.loadingEmit(false);
      });
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    const AVAILABLE_ACTIONS = ['transactions.view.actions.view'];
    const ACTIONS_ALLOWED = this.sessionService.areActionsAllowed(AVAILABLE_ACTIONS);

    TABLE_HEADER.push(
      new TableHeaderItem({ data: this.translateService.instant('lambda_modules_changes_table_v1.col_transaction_id.header'), field: 'id', style: { width: '20%' } })
    );
    TABLE_HEADER.push(
      new TableHeaderItem({ data: this.translateService.instant('lambda_modules_changes_table_v1.col_document_external_id.header'), field: 'docId', style: { width: '15%' } })
    );
    TABLE_HEADER.push(
      new TableHeaderItem({ data: this.translateService.instant('lambda_modules_changes_table_v1.col_document_type.header'), field: 'docType', style: { width: '10%' } })
    );
    TABLE_HEADER.push(new TableHeaderItem({ data: this.translateService.instant('lambda_modules_changes_table_v1.col_action.header'), field: 'action', style: { width: '10%' } }));
    TABLE_HEADER.push(
      new TableHeaderItem({ data: this.translateService.instant('lambda_modules_changes_table_v1.col_initiator_id.header'), field: 'context', style: { width: '15%' } })
    );
    TABLE_HEADER.push(
      new TableHeaderItem({ data: this.translateService.instant('lambda_modules_changes_table_v1.col_initiator_name.header'), field: 'context', style: { width: '15%' } })
    );
    TABLE_HEADER.push(
      new TableHeaderItem({ data: this.translateService.instant('lambda_modules_changes_table_v1.col_timestamp.header'), field: 'timestamp', style: { width: '15%' } })
    );

    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: item?.id, raw: item }));
    RET_VAL.push(new TableItem({ data: item?.docId }));
    RET_VAL.push(new TableItem({ data: item?.docType }));
    RET_VAL.push(new TableItem({ data: item?.action }));
    RET_VAL.push(new TableItem({ data: item?.context?.user?.id }));
    RET_VAL.push(new TableItem({ data: item?.context?.user?.username }));
    RET_VAL.push(new TableItem({ data: this.timezoneService.getTimeByUserTimezone(item['timestamp']) }));

    return RET_VAL;
  }

  handleFindAnswersByQueryError(error: any) {
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('lambda_modules_changes_table_v1.find_answers_error.title'),
      target: '.notification-container',
      duration: 10000,
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'lambda-modules-changes.view.actions.view' });
    return RET_VAL;
  }

  emitSearchChangeEvent(event: any) {
    this.onSearchChangeEvent.emit(event);
  }

  emitSearchClearEvent() {
    this.onSearchClearEvent.emit();
  }

  private showSkeletonLoading(): void {
    this.skeletonState = true;
  }

  private hideSkeletonLoading(): void {
    this.skeletonState = false;
  }

  export() {
    const queryCopy = JSON.parse(JSON.stringify(this.queryService.query(this.state.queryType)));
    queryCopy.pagination.size = 999999999;

    this.lambdaModulesChangesService
      .findManyByQuery(queryCopy)
      .pipe(catchError((error) => this.handleFindAnswersByQueryError(error)))
      .subscribe((res: { items: any }) => {
        if (res.items) {
          this.exportLambdaModulesChangesToExcelAdapter(res.items);
        }
      });
  }

  private exportLambdaModulesChangesToExcelAdapter(data): void {
    const EXCEL_DATA: Array<ExcelJson> = [];
    const UDT: ExcelJson = {
      data: [
        {
          id: 'Transaction ID',
          docExtId: 'Document External ID',
          docType: 'Document Type',
          action: 'Action',
          initId: 'Initiator ID',
          initName: 'Initiator Name',
          timestamp: 'Timestamp',
        },
      ],
      skipHeader: true,
    };
    EXCEL_DATA.push(UDT);

    if (data.length === 0) {
      const NOTIFICATION = {
        type: 'warning',
        title: this.translateService.instant('lambda_modules_changes_table_v1.export_lambda_modules_error.title'),
        message: this.translateService.instant('lambda_modules_changes_table_v1.export_lambda_modules_error.message'),
        target: '.notification-container',
        duration: 3000,
      };
      this.notificationService.showNotification(NOTIFICATION);
      return;
    }

    for (const k in data) {
      const element = data[k];
      UDT.data.push({
        id: element.id,
        docExtId: element.docId,
        docType: element.docType,
        action: element.action,
        initId: element.context.user.id,
        initName: element.context.user.username,
        timestamp: element.timestamp,
      });
    }

    const FILE_NAME = `lambda_modules_changes_${moment().format()}`;
    const SHEET_NAME = 'Lambda modules Changes';
    this.dataExportService.exportJsonToExcel(EXCEL_DATA, FILE_NAME, SHEET_NAME);
  }
}
