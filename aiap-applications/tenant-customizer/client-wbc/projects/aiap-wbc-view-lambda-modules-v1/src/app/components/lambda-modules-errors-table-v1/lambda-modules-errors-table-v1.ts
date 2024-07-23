/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild, TemplateRef, OnDestroy, Input } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import {
  TableHeaderItem,
  TableItem,
} from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
  _info,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  LocalQueryServiceV1,
  QueryServiceV1,
  NotificationServiceV2,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  LambdaModulesErrorsServiceV1,
} from 'client-services';

import { BaseTableV1 } from 'client-shared-components';

@Component({
  selector: 'aiap-lambda-modules-errors-table-v1',
  templateUrl: './lambda-modules-errors-table-v1.html',
  styleUrls: ['./lambda-modules-errors-table-v1.scss'],
})
export class LambdaModulesErrorsTableV1 extends BaseTableV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'LambdaModulesErrorsTableV1';
  }

  @ViewChild('moduleErrorView', { static: true }) moduleErrorView: TemplateRef<any>;

  @Input() config;
  @Input() moduleId;

  state: any = {
    queryType: DEFAULT_TABLE.LAMBDA_ERRORS.TYPE,
    defaultSort: DEFAULT_TABLE.LAMBDA_ERRORS.SORT,
    pagination: {
      page: 1,
      size: 5,
    },
  };

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private lambdaModulesErrorsService: LambdaModulesErrorsServiceV1,
    private translateService: TranslateHelperServiceV1,
    protected localQueryService: LocalQueryServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    this.localQueryService.setSort(this.state.queryType, this.state.defaultSort);
    this.localQueryService.setPagination(this.state.queryType, this.state.pagination);
    super.ngOnInit();
    this.loadTableData();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    //
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({ data: this.translateService.instant('lambda_modules_errors_table_v1.col_timestamp.header'), field: 'timestamp' }));
    TABLE_HEADER.push(new TableHeaderItem({ data: this.translateService.instant('lambda_modules_errors_table_v1.col_action.header'), field: 'action', sortable: false }));
    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: item?.timestamp, expandedData: item?.error, expandedTemplate: this.moduleErrorView }));
    RET_VAL.push(new TableItem({ data: item?.action }));
    return RET_VAL;
  }

  handleSelectPageEvent(page: any) {
    this.localQueryService.handlePageChangeEvent(this.state.queryType, this.model, page);
    this.loadTableData();
  }

  handleSortEvent(index: any) {
    this.localQueryService.handleSortByHeader(this.state.queryType, this.model, index);
    this.loadTableData();
  }

  refreshTableModel() {
    this.refreshTableDataRows();
    this.model.totalDataLength = this.response?.total;
    const PAGINATION = this.localQueryService.pagination(this.state.queryType);
    this.model.pageLength = PAGINATION.size;
    this.model.currentPage = PAGINATION.page;
  }

  addFilterEventHandler() {
    //
  }

  loadTableData() {
    const QUERY = this.localQueryService.query(this.state.queryType);
    const MODULE_ERRORS_QUERY_PARAMS = {
      moduleId: this.moduleId,
      ...QUERY,
    };
    this.lambdaModulesErrorsService.findManyByQuery(MODULE_ERRORS_QUERY_PARAMS)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleFindManyByQueryError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(LambdaModulesErrorsTableV1.getClassName(), 'retrieveModuleErrorsData', { response });
        this.response = response;
        this.refreshTableModel();
        this.eventsService.loadingEmit(false);
      });
  }

  handleFindManyByQueryError(error) {
    _errorX(LambdaModulesErrorsTableV1.getClassName(), `handleFindManyByQueryError`, { error });
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('lambda_modules_errors_table_v1.error_notification.title'),
      subtitle: this.translateService.instant('lambda_modules_errors_table_v1.error_notification.subTitle'),
      target: '.notification-container',
      duration: 10000,
    }
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = false;
    return RET_VAL;
  }

}
