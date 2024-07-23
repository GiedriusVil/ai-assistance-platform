/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { PercentPipe } from '@angular/common';

import { catchError, takeUntil } from 'rxjs/operators';
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
  ActivatedRouteServiceV1,
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
  selector: 'aca-ai-test-overall-table',
  templateUrl: './ai-test-overall-table.html',
  styleUrls: ['./ai-test-overall-table.scss'],
  providers: [PercentPipe]
})
export class AiTestOverallTable extends BaseTable implements OnInit {

  static getClassName() {
    return 'AiTestOverallTable';
  }

  @ViewChild("incorrectHigh", { static: true }) incorrectHigh: TemplateRef<any>;
  @ViewChild("incorrectLow", { static: true }) incorrectLow: TemplateRef<any>;
  @ViewChild("correctHigh", { static: true }) correctHigh: TemplateRef<any>;
  @ViewChild("correctLow", { static: true }) correctLow: TemplateRef<any>;
  @ViewChild("overflowMenuItemTemplate", { static: true }) overflowMenuItemTemplate: TemplateRef<any>;

  data: any;
  testId: any;
  intents = {
    totalTested: 0,
    passHigh: 0,
    passLow: 0,
    failHigh: 0,
    failLow: 0
  };
  state: any = {
    queryType: DEFAULT_TABLE.TEST_OVERALL.TYPE,
  };

  constructor(
    private aiTestsService: AiTestsService,
    public timezoneService: TimezoneServiceV1,
    private ActivatedRouteServiceV1: ActivatedRouteServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private dataExportService: DataExportService,
    private percentPipe: PercentPipe,
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    this.subscribeToQueryParams();
    super.setQueryType(this.state.queryType);
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  addFilterEventHandler() {
    this.eventsService.loadingEmit(true);
    this.aiTestsService.findOneById(this.testId).pipe(
      catchError((error) => this.handleFindOneByIdError()),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(AiTestOverallTable.getClassName(), `addFilterEventHandler`, { response });
      this.data = response;
      this.countIntents(response);
      this.refreshTableDataRows();
      this.eventsService.loadingEmit(false);
    });
  }

  subscribeToQueryParams() {
    this.ActivatedRouteServiceV1.queryParams()
      .subscribe((params: any) => {
        _debugX(AiTestOverallTable.getClassName(), 'subscribeToQueryParams', { params });
        this.testId = params?.testId;
      });
  }

  refreshTableDataRows() {
    const TABLE_ROWS = [];
    TABLE_ROWS.push(this.transformResponseItemToRow(this.intents));
    this.model.data = TABLE_ROWS;
  }

  private handleFindOneByIdError() {
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: 'Ai Tests',
      subtitle: 'Unable to retrieve test!',
      duration: 10000,
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of({
      items: [],
    });
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Total tested",
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Pass with high confidence",
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Pass with low confidence",
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Fail with high confidence",
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Fail with low confidence",
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      template: this.overflowMenuItemTemplate,
      sortable: false,
      style: { "width": "2%" },
    }));
    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(intent) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: intent?.totalTested }));
    RET_VAL.push(new TableItem({ data: intent?.passHigh, template: this.correctHigh }));
    RET_VAL.push(new TableItem({ data: intent?.passLow, template: this.correctLow }));
    RET_VAL.push(new TableItem({ data: intent?.failHigh, template: this.incorrectHigh }));
    RET_VAL.push(new TableItem({ data: intent?.failLow, template: this.incorrectLow }));
    RET_VAL.push(new TableItem({ data: '' }));
    return RET_VAL;
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }

  countIntents(data) {
    let totalTested = 0;
    const METRICS_KFOLD = ramda.path(['metrics', 'kfold'], data);
    const INCORRECT_MATHES_LOW = ramda.path(['incorrectMatches', 'incorrectWithLowConfidence'], data);
    const INCORRECT_MATCHES_HIGH = ramda.path(['incorrectMatches', 'incorrectWithHighConfidence'], data);
    const CORRECT_MATCHES_LOW = ramda.path(['incorrectMatches', 'correctWithLowConfidence'], data);
    METRICS_KFOLD.map(response => {
      const TOTAL = ramda.path(['totalTested'], response);
      totalTested += TOTAL;
    }
    )
    this.intents.totalTested = totalTested;

    if (INCORRECT_MATHES_LOW) {
      this.intents.failLow = INCORRECT_MATHES_LOW.length;
    }
    if (INCORRECT_MATCHES_HIGH) {
      this.intents.failHigh = INCORRECT_MATCHES_HIGH.length;
    }
    if (CORRECT_MATCHES_LOW) {
      this.intents.passLow = CORRECT_MATCHES_LOW.length;
    }
    this.intents.passHigh = totalTested - (this.intents.failLow + this.intents.failHigh + this.intents.passLow);

  }

  calculatePercent(number) {
    return this.percentPipe.transform(number / this.intents.totalTested, '1.2-2');
  }
  downloadTableInExcel(): void {
    let data = this.data;
    const EXCEL_DATA = [];
    const UDT = {
      data: [
        {
          totalTested: 'totalTested',
          correctHighonf: 'PassWithHighConfidence',
          correctLowConf: 'PassWithLowConfidence',
          incorrHighConf: 'FailWithHighConfidence',
          incorrLowConf: 'FailWithLowConfidence',
        },
      ],
      skipHeader: true
    };
    EXCEL_DATA.push(UDT);
    if (!data) {
      const NOTIFICATION = {
        type: "warning",
        title: "Export answers",
        message: "Nothing to export!",
        target: ".notification-container",
        duration: 3000
      };
      this.notificationService.showNotification(NOTIFICATION);
      return;
    }
    UDT.data.push({
      totalTested: `${this.intents.totalTested}`,
      correctHighonf: `${this.calculatePercent(this.intents.passHigh)}`,
      correctLowConf: `${this.calculatePercent(this.intents.passLow)}`,
      incorrHighConf: `${this.calculatePercent(this.intents.failHigh)}`,
      incorrLowConf: `${this.calculatePercent(this.intents.failLow)}`,
    });
    const FILE_NAME = `Overall_results`;
    const SHEET_NAME = 'Overall_results';
    this.dataExportService.exportJsonToExcel(EXCEL_DATA, FILE_NAME, SHEET_NAME);
  }
}
