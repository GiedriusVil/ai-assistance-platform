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
import { ActivatedRoute } from '@angular/router';
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
  DEFAULT_TABLE,
} from 'client-utils';

import {
  AiTestsService,
  DataExportService
} from 'client-services';

import { BaseTable } from 'client-shared-components';

@Component({
  selector: 'aca-ai-test-result-table',
  templateUrl: './ai-test-result-table.html',
  styleUrls: ['./ai-test-result-table.scss'],
})
export class AiTestResulTable extends BaseTable implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiTestResulTable';
  }

  @ViewChild("overflowMenuItemTemplate", { static: true }) overflowMenuItemTemplate: TemplateRef<any>;
  @ViewChild("decimal", { static: true }) decimal: TemplateRef<any>;

  @Input() testResultData;

  testId: any;
  state: any = {
    queryType: DEFAULT_TABLE.TEST_RESULTS.TYPE,
    defaultSort: DEFAULT_TABLE.TEST_RESULTS.SORT
  };

  constructor(
    private aiTestsService: AiTestsService,
    public timezoneService: TimezoneServiceV1,
    private activatedRoute: ActivatedRoute,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected dataExportService: DataExportService,
    private ActivatedRouteServiceV1: ActivatedRouteServiceV1,
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
        _debugX(AiTestResulTable.getClassName(), 'subscribeToQueryParams', { params });
        this.testId = params.testId;
      });
  }

  addFilterEventHandler() {
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query) => {
        _debugX(AiTestResulTable.getClassName(), `addFilterEventHandler`, { query });
        return this.aiTestsService.findTestResultsById(this.testId, query).pipe(
          catchError(() => this.handleFindOneByIdError())
        )
      }),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(AiTestResulTable.getClassName(), `addFilterEventHandler`, { response });
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
      data: "Utterance",
      field: 'utterance'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Actual intent",
      field: 'actualIntent'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Predicted intent",
      field: 'predictedIntent'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Confidence",
      field: 'confidence'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Entities",
      field: 'entities'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Does intents match",
      field: "intentsMatch"
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Fold",
      field: "fold"
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
    RET_VAL.push(new TableItem({ data: item?.utterance }));
    RET_VAL.push(new TableItem({ data: item?.actualIntent, }));
    RET_VAL.push(new TableItem({ data: item?.predictedIntent, }));
    RET_VAL.push(new TableItem({ data: item?.confidence, template: this.decimal }));
    RET_VAL.push(new TableItem({ data: this.getEntitiesFromResponse(item?.entities) }));
    RET_VAL.push(new TableItem({ data: item?.intentsMatch }));
    RET_VAL.push(new TableItem({ data: item?.fold }));
    RET_VAL.push(new TableItem({ data: '' }));
    return RET_VAL;
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }

  getEntitiesFromResponse(entities) {
    let retVal = [];
    entities.forEach(entityItem => {
      retVal.push(entityItem.entity);
    })
    return retVal;
  }

  downloadTableInExcel(): void {
    let data = this.testResultData;
    const EXCEL_DATA = [];
    const UDT = {
      data: [
        {
          uttenrance: 'utterance',
          actualIntent: 'actualIntent',
          predictedIntent: 'predictedIntent',
          confidence: 'confidence',
          entities: 'entities',
          intentsMatch: 'intentsMatch',
          foldNumber: 'foldNumber'
        },
      ],
      skipHeader: true
    };
    EXCEL_DATA.push(UDT);
    if (!data.length) {
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
        uttenrance: item.originalText,
        actualIntent: item.actualIntent1,
        predictedIntent: item.predictedIntent,
        confidence: item.actualConfidence1,
        entities: `${this.getEntitiesFromResponse(item.entities)}`,
        intentsMatch: item.intentsMatch,
        foldNumber: item.foldNumber
      });
    });
    const FILE_NAME = `Test_results`;
    const SHEET_NAME = 'Test_results';
    this.dataExportService.exportJsonToExcel(EXCEL_DATA, FILE_NAME, SHEET_NAME);
  }
}
