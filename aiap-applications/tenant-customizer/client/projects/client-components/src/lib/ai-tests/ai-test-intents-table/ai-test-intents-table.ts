/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  OnDestroy,
  Input
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  TableHeaderItem,
  TableItem,
} from 'carbon-components-angular';

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
  selector: 'aca-ai-test-intents-table',
  templateUrl: './ai-test-intents-table.html',
  styleUrls: ['./ai-test-intents-table.scss'],
  providers: [DecimalPipe]
})
export class AiTestIntentsTable extends BaseTable implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiTestIntentsTable';
  }

  @ViewChild("decimal", { static: true }) decimal: TemplateRef<any>;
  @ViewChild("overflowMenuItemTemplate", { static: true }) overflowMenuItemTemplate: TemplateRef<any>;
  @Input() intentsData;

  testId: any;
  state: any = {
    queryType: DEFAULT_TABLE.TEST_INTENTS.TYPE,
    defaultSort: DEFAULT_TABLE.TEST_INTENTS.SORT,
  };

  constructor(
    private aiTestsService: AiTestsService,
    public timezoneService: TimezoneServiceV1,
    private ActivatedRouteServiceV1: ActivatedRouteServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private dataExportService: DataExportService,
    private decimaPipe: DecimalPipe,
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    this.subscribeToQueryParams();
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  addFilterEventHandler() {
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query) => {
        _debugX(AiTestIntentsTable.getClassName(), `addFilterEventHandler`, { query });
        return this.aiTestsService.findClassReportById(this.testId, query).pipe(
          catchError(() => this.handleFindOneByIdError())
        )
      }),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(AiTestIntentsTable.getClassName(), `addFilterEventHandler`, { response });
      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
    });
  }

  subscribeToQueryParams() {
    this.ActivatedRouteServiceV1.queryParams()
      .subscribe((params: any) => {
        _debugX(AiTestIntentsTable.getClassName(), 'subscribeToQueryParams', { params });
        this.testId = params?.testId;
      });
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
      data: "Intent",
      field: "name"
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Recall",
      field: "recall"
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Precision",
      field: 'precision'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "F-Score",
      field: "fscore"
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      template: this.overflowMenuItemTemplate,
      sortable: false,
      style: { "width": "2%" },
    }));
    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(value) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: value?.name }));
    RET_VAL.push(new TableItem({ data: value?.recall, template: this.decimal }));
    RET_VAL.push(new TableItem({ data: value?.precision, template: this.decimal }));
    RET_VAL.push(new TableItem({ data: value?.fscore, template: this.decimal }));
    RET_VAL.push(new TableItem({ data: '', template: this.overflowMenuItemTemplate }));
    return RET_VAL;
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }

  convertToDecimal(number) {
    return this.decimaPipe.transform(number, '0.1-2')
  }

  downloadTableInExcel(): void {
    let data = this.intentsData;
    const EXCEL_DATA = [];
    const UDT = {
      data: [
        {
          intent: 'intent',
          recall: 'recall',
          precision: 'precision',
          fscore: 'fscore',
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
    data.map(item => {
      UDT.data.push({
        intent: item.name,
        recall: this.convertToDecimal(item.recall),
        precision: this.convertToDecimal(item.precision),
        fscore: this.convertToDecimal(item['f1-score']),
      });
    });
    const FILE_NAME = `Intents_results`;
    const SHEET_NAME = 'Intents_results';
    this.dataExportService.exportJsonToExcel(EXCEL_DATA, FILE_NAME, SHEET_NAME);
  }
}
