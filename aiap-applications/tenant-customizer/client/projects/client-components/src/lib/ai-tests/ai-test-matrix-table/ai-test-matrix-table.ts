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
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';

import {
  TableHeaderItem,
  TableItem,
} from 'carbon-components-angular';

import {
  _debugX,
  _errorX
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
  selector: 'aca-ai-test-matrix-table',
  templateUrl: './ai-test-matrix-table.html',
  styleUrls: ['./ai-test-matrix-table.scss'],
})
export class AiTestMatrixTable extends BaseTable implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiTestMatrixTable';
  }

  @ViewChild("overflowMenuItemTemplate", { static: true }) overflowMenuItemTemplate: TemplateRef<any>;

  @Input() matrixData;

  testId: any;
  state: any = {
    queryType: DEFAULT_TABLE.TEST_MATRIX.TYPE,
    defaultSort: DEFAULT_TABLE.TEST_MATRIX.SORT
  };

  constructor(
    private aiTestsService: AiTestsService,
    public timezoneService: TimezoneServiceV1,
    private ActivatedRouteServiceV1: ActivatedRouteServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    protected sessionService: SessionServiceV1,
    private dataExportService: DataExportService,
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

  subscribeToQueryParams() {
    this.ActivatedRouteServiceV1.queryParams()
      .subscribe((params: any) => {
        _debugX(AiTestMatrixTable.getClassName(), 'subscribeToQueryParams', { params });
        this.testId = params?.testId;
      });
  }

  addFilterEventHandler() {
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query) => {
        _debugX(AiTestMatrixTable.getClassName(), `addFilterEventHandler`, { query });
        return this.aiTestsService.findIncorrectIntentsById(this.testId, query).pipe(
          catchError(() => this.handleFindOneByIdError())
        )
      }),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(AiTestMatrixTable.getClassName(), `addFilterEventHandler`, { response });
      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
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
      data: "Actual intent",
      field: 'actualIntent'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Predicted intent",
      field: 'predictedIntent'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Number of confusions",
      field: 'value'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      template: this.overflowMenuItemTemplate,
      sortable: false,
      style: { "width": "2%" },
    }));

    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: item?.actualIntent }));
    RET_VAL.push(new TableItem({ data: item?.predictedIntent, }));
    RET_VAL.push(new TableItem({ data: item?.value, }));
    RET_VAL.push(new TableItem({ data: '' }));
    return RET_VAL;
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }

  downloadTableInExcel(): void {
    let data = this.matrixData;
    const EXCEL_DATA = [];
    const labels = data.labels;
    let labelsObj = {};
    for (let i = 0; i < labels.length; i++) {
      let newobj = Object.assign(labelsObj, { [labels[i]]: `${labels[i]}` });
    }
    const UDT = {
      data: [
        { blank: '', ...labelsObj },
      ],
      skipHeader: true
    };
    EXCEL_DATA.push(UDT);
    if (!data.data.length) {
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
    data.data.forEach((array, idx) => {
      let retVal = { blank: '' };
      retVal['blank'] = labels[idx];
      labels.forEach((label, index) => {
        retVal[label] = array[index];
      });
      UDT.data.push(retVal)
    });
    const FILE_NAME = `Confusion_matrix`;
    const SHEET_NAME = 'Confusion_matrix';
    this.dataExportService.exportJsonToExcel(EXCEL_DATA, FILE_NAME, SHEET_NAME);
  }
}
