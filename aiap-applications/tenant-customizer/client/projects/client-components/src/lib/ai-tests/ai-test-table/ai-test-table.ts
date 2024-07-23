/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

import {
  TableHeaderItem,
  TableItem,
} from 'carbon-components-angular';

import {
  _debugX,
} from 'client-shared-utils';

import {
  ActivatedRouteServiceV1,
  SessionServiceV1,
  EventsServiceV1,
  TimezoneServiceV1,
  QueryServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  DEFAULT_TABLE
} from 'client-utils';

import {
  AiTestsService,
  DataExportService
} from 'client-services';

import { BaseTable } from 'client-shared-components';

@Component({
  selector: 'aca-ai-test-table',
  templateUrl: './ai-test-table.html',
  styleUrls: ['./ai-test-table.scss'],
})
export class AiTestTable extends BaseTable implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiTestTable';
  }

  response = {
    items: [
      { tableName: 'overall' },
      { tableName: 'intents' },
      { tableName: 'confusion-matrix' },
      { tableName: 'test-results' }
    ]
  };

  state: any = {
    queryType: DEFAULT_TABLE.TEST_TABLE.TYPE,
  };

  testId: any;

  constructor(
    private aiTestsService: AiTestsService,
    public timezoneService: TimezoneServiceV1,
    private ActivatedRouteServiceV1: ActivatedRouteServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected dataExportService: DataExportService
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    this.subscribeToQueryParams();
    super.setQueryType(this.state.queryType);
    super.ngOnInit();
    this.refreshTableModel();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  addFilterEventHandler() {

  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Table Name",
      sortable: false
    }));
    this.model.header = TABLE_HEADER;
  }

  subscribeToQueryParams() {
    this.ActivatedRouteServiceV1.queryParams()
      .subscribe((params: any) => {
        _debugX(AiTestTable.getClassName(), 'subscribeToQueryParams', { params });
        this.testId = params.testId;
      });
  }


  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'test.view.view-test' });
    return RET_VAL;
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: item?.tableName }));
    return RET_VAL;
  }
}
