/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  TemplateRef,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  TableHeaderItem,
  TableItem,
} from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  QueryServiceV1,
  NotificationServiceV2,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
  TEST_EXECUTION_MESSAGES,
} from 'client-utils';

import {
  TestExecutionsService,
} from 'client-services';

import {
  BaseTable,
} from 'client-shared-components';

@Component({
  selector: 'aiap-test-executions-table-v1',
  templateUrl: './test-executions-table-v1.html',
  styleUrls: ['./test-executions-table-v1.scss']
})
export class TestExecutionsTableV1 extends BaseTable implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'TestExecutionsTableV1';
  }

  @ViewChild('overflowMenuItemTemplate', { static: true }) actionsTemplate: TemplateRef<any>;
  @ViewChild('createdAndChangedTime', { static: true }) createdAndChangedTime: TemplateRef<any>;

  @Output() onReExecuteEvent = new EventEmitter<any>();
  @Output() onShowGenerateManyPlace = new EventEmitter<any>();

  @Input() isAuditColumnsVisible: boolean;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;

  skeletonState = false;

  state: any = {
    queryType: DEFAULT_TABLE.TEST_CASE_EXECUTIONS.TYPE,
    defaultSort: DEFAULT_TABLE.TEST_CASE_EXECUTIONS.SORT,
    search: '',
  };

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private testExecutionsService: TestExecutionsService,
    private translationService: TranslateHelperServiceV1,
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

  ngOnChanges(changes: SimpleChanges): void {
    const HEADERS: Array<any> = this.model.header;
    for (const HEADER of HEADERS) {
      if (
        HEADER?.isAuditColumn
      ) {
        HEADER.visible = this.isAuditColumnsVisible;
      }
    }
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translationService.instant('test_executions_table_v1.col_id.header'),
      field: 'id',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translationService.instant('test_executions_table_v1.col_name.header'),
      field: 'testCase.name'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translationService.instant('test_executions_table_v1.col_worker.header'),
      field: 'worker.name'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translationService.instant('test_executions_table_v1.col_status.header'),
      field: 'status'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translationService.instant('test_executions_table_v1.col_executed.header'),
      field: 'executed'
    }));

    TABLE_HEADER.push(new TableHeaderItem({
      isAuditColumn: true,
      data: this.translationService.instant('test_executions_table_v1.col_created_by.header'),
      field: 'createdBy',
      style: {
        width: '10%',
      },
      visible: this.isAuditColumnsVisible,
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      isAuditColumn: true,
      data: this.translationService.instant('test_executions_table_v1.col_created.header'),
      field: 'created',
      style: {
        width: '10%',
      },
      visible: this.isAuditColumnsVisible,
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      isAuditColumn: true,
      data: this.translationService.instant('test_executions_table_v1.col_changed_by.header'),
      field: 'changedBy',
      style: {
        width: '10%',
      },
      visible: this.isAuditColumnsVisible,
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      isAuditColumn: true,
      data: this.translationService.instant('test_executions_table_v1.col_changed.header'),
      field: 'changed',
      style: {
        width: '10%',
      },
      visible: this.isAuditColumnsVisible,
    }));

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translationService.instant('test_executions_table_v1.col_actions.header'),
      sortable: false,
      visible: true,
      style: {
        width: '2%',
      }
    }));

    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(item) {
    _debugX(TestExecutionsTableV1.getClassName(), `transformResponseItemToRow`,
      {
        item,
      });

    const RET_VAL = [];

    RET_VAL.push(new TableItem({ data: item?.id }));
    RET_VAL.push(new TableItem({ data: item?.testCase?.name }));
    RET_VAL.push(new TableItem({ data: item?.worker?.name }));
    RET_VAL.push(new TableItem({ data: item?.status }));
    RET_VAL.push(new TableItem({ data: item?.executed }));

    RET_VAL.push(new TableItem({ data: item?.createdBy }));
    RET_VAL.push(new TableItem({ data: item?.created }));
    RET_VAL.push(new TableItem({ data: item?.changedBy }));
    RET_VAL.push(new TableItem({ data: item?.changed }));

    RET_VAL.push(new TableItem({ data: item, template: this.actionsTemplate }));
    return RET_VAL;
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.skeletonState = true),
      switchMap((query) => {
        if (query) {
          defaultQuery = query;
        }
        return this.testExecutionsService.findManyByQuery(defaultQuery).pipe(
          catchError((error: any) => this.handleFindManyByQueryError(error))
        );
      }),

      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(TestExecutionsTableV1.getClassName(), `addFilterEventHandler`,
        {
          response,
        });

      this.notificationService.showNotification(TEST_EXECUTION_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY);
      this.response = response;
      this.refreshTableModel();
      this.selectedRows = [];
      this.skeletonState = false;
      //this.eventsService.loadingEmit(false);
    });
  }

  handleFindManyByQueryError(error: any) {
    _errorX(TestExecutionsTableV1.getClassName(), `handleFindManyByQueryError`,
      {
        error,
      });

    this.skeletonState = false;
    // this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(TEST_EXECUTION_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    return true;
  }

  emitExecuteEvent(event: any) {
    _debugX(TestExecutionsTableV1.getClassName(), 'emitExecuteEvent',
      {
        event,
      });

    this.onReExecuteEvent.emit(event);
  }

  emitGenerateManyPlace(event: any) {
    _debugX(TestExecutionsTableV1.getClassName(), 'emitGenerateManyPlace',
      {
        event,
      });

    this.onShowGenerateManyPlace.emit(event);
  }

  isRemoveDisabled() {
    if (
      !lodash.isEmpty(this.selectedRows)
    ) {
      return false
    } else {
      return true
    }
  }
}
