/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, EventEmitter, Output, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import {
  TableItem,
  TableHeaderItem,
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  TimezoneServiceV1,
  QueryServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  SurveyService,
} from 'client-services';

import {
  BaseTable,
} from 'client-shared-components';

import {
  DEFAULT_TABLE,
  SURVEYS_MESSAGES,
} from 'client-utils';

@Component({
  selector: 'aiap-surveys-table-v1',
  templateUrl: './surveys-table-v1.html',
  styleUrls: ['./surveys-table-v1.scss'],
})
export class SurveysTableV1 extends BaseTable implements OnInit, AfterViewInit {

  static getClassName() {
    return 'SurveysTableV1';
  }

  @ViewChild('timestamp', { static: true }) timestamp: TemplateRef<any>;

  @Output() showTranscript = new EventEmitter<any>();
  @Output() onSearchEvent = new EventEmitter<any>();
  @Output() onSearchClearEvent = new EventEmitter<any>();

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  isOpen = false;

  loading = false;
  state: any = {
    queryType: DEFAULT_TABLE.SURVEYS.TYPE,
    defaultSort: DEFAULT_TABLE.SURVEYS.SORT,
    search: '',
  };

  constructor(
    private notificationService: NotificationService,
    private surveyService: SurveyService,
    private translateService: TranslateHelperServiceV1,
    protected eventsService: EventsServiceV1,
    protected timezoneService: TimezoneServiceV1,
    protected queryService: QueryServiceV1,
    protected sessionService: SessionServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    this.setSearch();
    super.ngOnInit();
  }

  ngAfterViewInit() { }

  setSearch() {
    const QUERY = this.queryService.query(this.state.queryType);
    this.state.search = QUERY?.filter?.search || '';
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => {
        this.eventsService.loadingEmit(true);
        this.loading = true;
      }),
      switchMap(query => {
        _debugX(SurveysTableV1.getClassName(), `addFilterEventHandler`, { query });
        if (query) {
          defaultQuery = query;
        }

        return this.surveyService.findManyByQuery(defaultQuery).pipe(
          catchError((error) => this.handleSurveysError(error))
        );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(SurveysTableV1.getClassName(), `addFilterEventHandler`, { response });
      this.response = response;
      this.loading = false;
      this.eventsService.loadingEmit(false);
      this.refreshTableModel();
    });
  }

  handleSurveysError(error) {
    this.eventsService.loadingEmit(false);
    this.loading = false;
    this.notificationService.showNotification(SURVEYS_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of()
  }


  constructTableHeader() {
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('surveys_table_v1.col_timestamp.header'),
      field: 'created'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('surveys_table_v1.col_assistant_id.header'),
      field: 'assistantId'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('surveys_table_v1.col_conversation_id.header'),
      field: 'conversationId'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('surveys_table_v1.col_score.header'),
      field: 'score'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('surveys_table_v1.col_status.header'),
      field: 'status'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('surveys_table_v1.col_comment.header'),
      field: 'comment'
    }));
    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: item?.created, template: this.timestamp }));
    RET_VAL.push(new TableItem({ data: item?.assistantId }));
    RET_VAL.push(new TableItem({ data: item?.conversationId }));
    RET_VAL.push(new TableItem({ data: item?.score }));
    RET_VAL.push(new TableItem({ data: '' }));
    RET_VAL.push(new TableItem({ data: item?.comment }));
    return RET_VAL;
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'conversations.view.view-transcript' });
    return RET_VAL;
  }

  emitSearchEvent(event: any) {
    this.onSearchEvent.emit(event);
  }

  emitSearchClearEvent() {
    this.onSearchClearEvent.emit();
  }
}
