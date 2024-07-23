/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, EventEmitter, Output, ViewChild, TemplateRef, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  TableModel,
  TableHeaderItem,
  TableItem,
  NotificationService
} from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  QueryServiceV1,
  EventsServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';


import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  TransactionsService,
} from 'client-services';

import {
  BaseTable,
} from 'client-shared-components';

@Component({
  selector: 'aca-metrics-summary-table',
  templateUrl: './aca-metrics-summary.table.html',
  styleUrls: ['./aca-metrics-summary.table.scss'],
})
export class AcaMetricsSummaryTable extends BaseTable implements OnInit, OnDestroy {

  static getClassName() {
    return 'AcaMetricsSummaryTable';
  }

  constructor(
    protected eventsService: EventsServiceV1,
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected transactionsService: TransactionsService,
    private translateService: TranslateHelperServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  isLoading: boolean = false;
  isError: boolean = false;

  state: any = {
    queryType: DEFAULT_TABLE.METRICS_SUMMARY.TYPE,
    defaultSort: DEFAULT_TABLE.METRICS_SUMMARY.SORT,
  };

  ngOnInit(): void {
    super.setQueryType(this.state.queryType);
    this.isLoading = true;
    super.ngOnInit();
  }

  ngAfterViewInit() {
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('aca_metrics_summary_table.buyer_header'),
      field: 'buyer'
    })
    );
    TABLE_HEADER.push(new TableHeaderItem({
      data: "1",
      field: 'range_one_count'
    })
    );

    TABLE_HEADER.push(new TableHeaderItem({
      data: "%",
      field: 'range_one_percentage'
    })
    );

    TABLE_HEADER.push(new TableHeaderItem({
      data: "2-5",
      field: 'range_two_count'
    })
    );

    TABLE_HEADER.push(new TableHeaderItem({
      data: "%",
      field: 'range_two_percentage'
    })
    );

    TABLE_HEADER.push(new TableHeaderItem({
      data: "5-10",
      field: 'range_three_count'
    })
    );

    TABLE_HEADER.push(new TableHeaderItem({
      data: "%",
      field: 'range_three_percentage'
    })
    );

    TABLE_HEADER.push(new TableHeaderItem({
      data: "10+",
      field: 'range_four_count'
    })
    );

    TABLE_HEADER.push(new TableHeaderItem({
      data: "%",
      field: 'range_four_percentage'
    })
    );

    this.model.header = TABLE_HEADER
  }

  transformResponseItemToRow(item) {
    _debugX(AcaMetricsSummaryTable.getClassName(), `transformResponseItemToRow`, { item });
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: item?.buyerName }));

    const RANGE_ONE_COUNT = ramda.pathOr(0, ['one', 'count'], item);
    const RANGE_ONE_PERCENTAGE = ramda.pathOr('-', ['one', 'percentage'], item);
    RET_VAL.push(new TableItem({ data: RANGE_ONE_COUNT }));
    RET_VAL.push(new TableItem({ data: RANGE_ONE_PERCENTAGE }));

    const RANGE_LOW_COUNT = ramda.pathOr(0, ['low', 'count'], item);
    const RANGE_LOW_PERCENTAGE = ramda.pathOr('-', ['low', 'percentage'], item);
    RET_VAL.push(new TableItem({ data: RANGE_LOW_COUNT }));
    RET_VAL.push(new TableItem({ data: RANGE_LOW_PERCENTAGE }));

    const RANGE_MID_COUNT = ramda.pathOr(0, ['mid', 'count'], item);
    const RANGE_MID_PERCENTAGE = ramda.pathOr('-', ['mid', 'percentage'], item);
    RET_VAL.push(new TableItem({ data: RANGE_MID_COUNT }));
    RET_VAL.push(new TableItem({ data: RANGE_MID_PERCENTAGE }));

    const RANGE_INF_COUNT = ramda.pathOr(0, ['inf', 'count'], item);
    const RANGE_INF_PERCENTAGE = ramda.pathOr('-', ['inf', 'percentage'], item);
    RET_VAL.push(new TableItem({ data: RANGE_INF_COUNT }));
    RET_VAL.push(new TableItem({ data: RANGE_INF_PERCENTAGE }));
    return RET_VAL;
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => { this.isLoading = true }),
      switchMap((query) => {
        if (query) {
          defaultQuery = query;
        }
        return this.transactionsService.retriveValidationFrequency(defaultQuery).pipe(
          catchError((error: any) => this.handleValidationFrequencyQueryError(error))
        );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      this.response = response;
      this.isError = false;
      this.isLoading = false;
      this.refreshTableModel();
    });
  }

  handleValidationFrequencyQueryError(error): Observable<any> {
    this.isError = true;
    _debugX(AcaMetricsSummaryTable.getClassName(), `handleValidationFrequencyQueryError`, { error });
    return of();
  }

  isShowRowSavePlaceAllowed() {
    return false;
  }
}
