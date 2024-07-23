/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy
} from '@angular/core';

import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  TableHeaderItem,
  TableItem,
} from 'carbon-components-angular';

import * as ramda from 'ramda';

import {
  _debugX,
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
  DEFAULT_TABLE,
} from 'client-utils';

import {
  NOTIFICATION_STATUS,
} from 'client-shared-utils';

import {
  AiTestsService
} from 'client-services';

import { BaseTable } from 'client-shared-components';

@Component({
  selector: 'aca-ai-tests-table',
  templateUrl: './ai-tests-table.html',
  styleUrls: ['./ai-tests-table.scss'],
})
export class AiTestsTable extends BaseTable implements OnInit, OnDestroy {

  static getClassName() {
    return 'AiTestsTable';
  }

  @ViewChild('startedTime', { static: true }) startedTime: TemplateRef<any>;
  @ViewChild('endedTime', { static: true }) endedTime: TemplateRef<any>;
  @ViewChild('overflowMenuItemTemplate', { static: true }) overflowMenuItemTemplate: TemplateRef<any>;

  state: any = {
    queryType: DEFAULT_TABLE.TESTS.TYPE,
  };
  constructor(
    private aiTestsService: AiTestsService,
    public timezoneService: TimezoneServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    private translateService: TranslateHelperServiceV1,
    ) {
      super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap(query => {
        _debugX(AiTestsTable.getClassName(), `addFilterEventHandler`, { query });
        if (query) {
          defaultQuery = query;
        }
        return this.aiTestsService.findManyLiteByQuery(defaultQuery).pipe(
          catchError((error) => this.handleFindManyByQueryError())
        );
      }
      ),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(AiTestsTable.getClassName(), 'addFilterEventHandler', { response });
      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
    });

  }

  handleFindManyByQueryError() {
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: NOTIFICATION_STATUS.ERROR,
      title: 'Ai Tests table',
      subtitle: 'Unable to retrieve tests!',
      duration: 10000,
    }
    this.notificationService.showNotification(NOTIFICATION);
    return of({
      items: [],
    })
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_tests_table_v1.col_id.header'),
      field: 'Id',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_tests_table_v1.col_assistant.header'),
      field: 'assistant',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_tests_table_v1.col_skill_id.header'),
      field: 'skillId',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_tests_table_v1.col_test_name.header'),
      field: 'testName',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_tests_table_v1.col_test_type.header'),
      field: 'testType'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      isAcaOptionalMdColumn: true,
      data: this.translateService.instant('ai_tests_table_v1.col_started.header'),
      field: 'started',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      isAcaOptionalMdColumn: false,
      data: this.translateService.instant('ai_tests_table_v1.col_ended.header'),
      field: 'ended',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      isAcaOptionalSmColumn: false,
      data: this.translateService.instant('ai_tests_table_v1.col_duration.header'),
      field: 'duration',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      isAcaOptionalMdColumn: true,
      data: this.translateService.instant('ai_tests_table_v1.col_status.header'),
      field: 'status',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_tests_table_v1.col_actions.header'),
      field: 'actions',
      sortable: false,
    }));

    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: item?.id }));
    RET_VAL.push(new TableItem({ data: item?.assistant }));
    RET_VAL.push(new TableItem({ data: item?.skillId }));
    RET_VAL.push(new TableItem({ data: item?.testName }));
    RET_VAL.push(new TableItem({ data: item?.testType }));
    RET_VAL.push(new TableItem({ data: item?.started, template: this.startedTime }));
    RET_VAL.push(new TableItem({ data: item?.ended, template: this.endedTime }));
    RET_VAL.push(new TableItem({ data: item?.duration }));
    RET_VAL.push(new TableItem({ data: item?.status }));
    RET_VAL.push(new TableItem({ data: item, template: this.overflowMenuItemTemplate }));
    return RET_VAL;
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'test.view.view-test' });
    return RET_VAL;
  }

  showTestResult(value: any) {
    const STATUS = ramda.path(['items', value, 'status'], this.response);
    if (
      STATUS !== 'In progress' &&
      this.isShowRowSavePlaceAllowed()
    ) {
      this.emitShowSavePlace(value);
    }
  }

}
