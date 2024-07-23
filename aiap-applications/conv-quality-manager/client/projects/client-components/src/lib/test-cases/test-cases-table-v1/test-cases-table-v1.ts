/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges
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
  BaseTable,
} from 'client-shared-components';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  TestCasesService
} from 'client-services';


@Component({
  selector: 'aiap-test-cases-table-v1',
  templateUrl: './test-cases-table-v1.html',
  styleUrls: ['./test-cases-table-v1.scss']
})
export class TestCasesTableV1 extends BaseTable implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'TestCasesTableV1';
  }

  @ViewChild('overflowMenuItemTemplate', { static: true }) actionsTemplate: TemplateRef<any>;

  @Input() isAuditColumnsVisible: boolean;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;

  skeletonState = false;

  state: any = {
    queryType: DEFAULT_TABLE.TEST_CASES.TYPE,
    defaultSort: DEFAULT_TABLE.TEST_CASES.SORT,
    search: '',
  };

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private testCasesService: TestCasesService,
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
      data: this.translationService.instant('test_cases_table_v1.col_key.header'),
      field: 'key',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translationService.instant('test_cases_table_v1.col_name.header'),
      field: 'name',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translationService.instant('test_cases_table_v1.col_worker_id.header'),
      sortable: false,
      field: 'worker.id',
    }));

    TABLE_HEADER.push(new TableHeaderItem({
      isAuditColumn: true,
      data: this.translationService.instant('test_cases_table_v1.col_created_by.header'),
      field: 'createdBy',
      style: {
        width: '10%'
      },
      visible: this.isAuditColumnsVisible,
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      isAuditColumn: true,
      data: this.translationService.instant('test_cases_table_v1.col_created.header'),
      field: 'created',
      style: {
        width: '10%',
      },
      visible: this.isAuditColumnsVisible,
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      isAuditColumn: true,
      data: this.translationService.instant('test_cases_table_v1.col_changed_by.header'),
      field: 'changedBy',
      style: {
        width: '10%',
      },
      visible: this.isAuditColumnsVisible,
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      isAuditColumn: true,
      data: this.translationService.instant('test_cases_table_v1.col_changed.header'),
      field: 'changed',
      style: {
        width: '10%',
      },
      visible: this.isAuditColumnsVisible,
    }));

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translationService.instant('test_cases_table_v1.col_actions.header'),
      sortable: false,
      visible: true,
      style: {
        width: '2%'
      }
    }));
    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];

    RET_VAL.push(new TableItem({ data: item?.key }));
    RET_VAL.push(new TableItem({ data: item?.name }));
    RET_VAL.push(new TableItem({ data: item?.worker?.id }));

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

        return this.testCasesService.findManyByQuery(defaultQuery).pipe(
          catchError((error: any) => this.handleFindManyByQueryError(error))
        );
      }),

      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(TestCasesTableV1.getClassName(), `addFilterEventHandler`,
        {
          response,
        });

      const NOTIFICATION = {
        type: 'success',
        title: 'Test Cases',
        message: 'Have been refreshed!',
        target: '.notification-container',
        duration: 10000
      };

      this.notificationService.showNotification(NOTIFICATION);
      this.response = response;
      this.refreshTableModel();
      this.selectedRows = [];
      this.skeletonState = false;
      // this.eventsService.loadingEmit(false);
    });
  }

  handleFindManyByQueryError(error: any) {
    _errorX(TestCasesTableV1.getClassName(), `handleFindManyByQueryError`,
      {
        error,
      });

    this.skeletonState = false;
    // this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: 'Test Cases',
      message: 'Unable to retrieve!',
      target: '.notification-container',
      duration: 10000
    };

    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }

  isRemoveDisabled() {
    if (!lodash.isEmpty(this.selectedRows)) {
      return false
    } else {
      return true
    }
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    this.testCasesService.exportMany(QUERY_PARAMS);
  }

}
