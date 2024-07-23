/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, EventEmitter, Output, ViewChild, TemplateRef, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
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
  TEST_WORKER_MESSAGES,
} from 'client-utils';

import {
  TestWorkersService,
} from 'client-services';

import {
  BaseTable,
} from 'client-shared-components';

@Component({
  selector: 'aiap-test-workers-table-v1',
  templateUrl: './test-workers-table-v1.html',
  styleUrls: ['./test-workers-table-v1.scss']
})
export class TestWorkersTableV1 extends BaseTable implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'TestWorkersTableV1';
  }

  @ViewChild('overflowMenuItemTemplate', { static: true }) actionsTemplate: TemplateRef<any>;
  @ViewChild('createdAndChangedTime', { static: true }) createdAndChangedTime: TemplateRef<any>;
  @ViewChild('rowExpandTemplate', { static: true }) rowExpandTemplate: TemplateRef<any>;

  @Input() isAuditColumnsVisible: boolean;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;

  skeletonState = false;

  state: any = {
    queryType: DEFAULT_TABLE.TEST_CASE_CONFIGURATIONS.TYPE,
    defaultSort: DEFAULT_TABLE.TEST_CASE_CONFIGURATIONS.SORT,
    search: '',
  };

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private testWorkersService: TestWorkersService,
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
      data: this.translationService.instant('test_workers_table_v1.col_name.header'),
      sortable: true,
      field: 'name',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translationService.instant('test_workers_table_v1.col_instances.header'),
      sortable: false,
      field: 'instances',
      style: {
        width: '5%',
      }
    }));

    TABLE_HEADER.push(new TableHeaderItem({
      isAuditColumn: true,
      data: this.translationService.instant('test_workers_table_v1.col_created_by.header'),
      field: 'createdBy',
      style: {
        width: '10%',
      },
      visible: this.isAuditColumnsVisible,
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      isAuditColumn: true,
      data: this.translationService.instant('test_workers_table_v1.col_created.header'),
      field: 'created',
      style: {
        width: '10%',
      },
      visible: this.isAuditColumnsVisible,
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      isAuditColumn: true,
      data: this.translationService.instant('test_workers_table_v1.col_changed_by.header'),
      field: 'changedBy',
      style: {
        width: '10%'
      },
      visible: this.isAuditColumnsVisible,
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      isAuditColumn: true,
      data: this.translationService.instant('test_workers_table_v1.col_changed.header'),
      field: 'changed',
      style: {
        width: '10%',
      },
      visible: this.isAuditColumnsVisible,
    }));

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translationService.instant('test_workers_table_v1.col_actions.header'),
      sortable: false,
      visible: true,
      style: {
        width: '2%',
      }
    }));

    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];

    RET_VAL.push(new TableItem({
      data: item?.name,
    }));
    RET_VAL.push(new TableItem({
      data: item?.instances?.length,
    }));
    RET_VAL.push(new TableItem({
      data: item?.createdBy,
    }));
    RET_VAL.push(new TableItem({
      data: item?.created,
    }));
    RET_VAL.push(new TableItem({
      data: item?.changedBy,
    }));
    RET_VAL.push(new TableItem({
      data: item?.changed,
    }));
    RET_VAL.push(new TableItem({
      data: item,
      template: this.actionsTemplate,
      expandedData: item?.instances,
      expandedTemplate: this.rowExpandTemplate,
    }));
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

        return this.testWorkersService.findManyByQuery(defaultQuery).pipe(
          catchError((error: any) => this.handleFindManyByQueryError(error))
        );
      }),

      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(TestWorkersTableV1.getClassName(), `addFilterEventHandler`,
        {
          response,
        });

      this.notificationService.showNotification(TEST_WORKER_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY);
      this.response = response;
      this.refreshTableModel();
      this.selectedRows = [];
      // this.eventsService.loadingEmit(false);
      this.skeletonState = false;
    });
  }

  handleFindManyByQueryError(error: any) {
    _errorX(TestWorkersTableV1.getClassName(), `handleFindManyByQueryError`,
      {
        error,
      });

    this.skeletonState = false;
    // this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(TEST_WORKER_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    return true;
  }

  jsonToString(data: any) {
    const RET_VAL = JSON.stringify(data, null, 2);
    return RET_VAL;
  }

  workerInstanceStatus(data: any) {
    let retVal = 'red';
    if (
      data?.worker?.status === 'READY'
    ) {
      retVal = 'green';
    } else if (
      data?.worker?.status === 'BUSY'
    ) {
      retVal = 'blue';
    }
    return retVal;
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
