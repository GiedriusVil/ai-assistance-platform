/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnInit, ViewChild, TemplateRef, OnChanges, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  TableHeaderItem,
  TableItem,
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
  TOPIC_MODELING_MESSAGES,
} from 'client-utils';

import {
  TopicModelingService,
} from 'client-services';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services'

import {
  BaseTable,
} from 'client-shared-components';

import {
  JOB_STATUS
} from './topic-modeling-table.utils';


@Component({
  selector: 'aiap-topic-modeling-table-v1',
  templateUrl: './topic-modeling-table-v1.html',
  styleUrls: ['./topic-modeling-table-v1.scss'],
})
export class TopicModelingTableV1 extends BaseTable implements OnInit, OnChanges, AfterViewInit {

  static getClassName() {
    return 'TopicModelingTableV1';
  }

  @Input() config;

  @ViewChild('actionsTemplate', { static: true }) actionsTemplate: TemplateRef<any>;
  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;
  @ViewChild('jobDateTemplate', { static: true }) jobDateTemplate: TemplateRef<any>;

  @Output() onShowExecutePlace = new EventEmitter<any>();
  @Output() onShowResultPlace = new EventEmitter<any>();


  isActionsClickAllowed = false;
  state: any = {
    queryType: DEFAULT_TABLE.TOPIC_MODELING.TYPE,
    defaultSort: DEFAULT_TABLE.TOPIC_MODELING.SORT,
    search: '',
  };

  constructor(
    private notificationService: NotificationService,
    private topicModelingService: TopicModelingService,
    private translateService: TranslateHelperServiceV1,
    protected eventsService: EventsServiceV1,
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.setSearch();
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    super.ngOnInit();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  ngOnChanges() { }

  _isEmpty(data) {
    return lodash.isEmpty(data);
  }

  setSearch() {
    const QUERY = this.queryService.query(this.state.queryType);
    this.state.search = QUERY?.filter?.search || '';
  }
  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query) => {
        _debugX(TopicModelingTableV1.getClassName(), `addFilterEventHandler`, { query });
        if (query) {
          defaultQuery = query;
        }
        return this.topicModelingService.findManyByQuery(defaultQuery).pipe(
          catchError((error: any) => this.handleFindManyByQueryError(error))
        )
      }),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(TopicModelingTableV1.getClassName(), `addFilterEventHandler`, { response });
      this.eventsService.loadingEmit(false);
      this.response = response;
      this.deselectAllRows();
      this.refreshTableModel();
      this.notificationService.showNotification(TOPIC_MODELING_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY);
    });
  }

  handleFindManyByQueryError(error: any) {
    _errorX(TopicModelingTableV1.getClassName(), 'handleFindManyByQueryError', { error })
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(TOPIC_MODELING_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('topic_modeling_table_v1.col_id.header'),
      field: 'id'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('topic_modeling_table_v1.col_name.header'),
      field: 'name'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('topic_modeling_table_v1.col_status.header'),
      field: 'status'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('topic_modeling_table_v1.col_duration.header'),
      field: 'duration'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('topic_modeling_table_v1.col_started.header'),
      field: 'started'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('topic_modeling_table_v1.col_ended.header'),
      field: 'ended'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('topic_modeling_table_v1.col_created.header'),
      field: 'created'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('topic_modeling_table_v1.col_updated.header'),
      field: 'updated'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('topic_modeling_table_v1.col_actions.header'),
      field: 'actions', sortable: false
    }));

    this.model.header = TABLE_HEADER;
  }

  formatTimestamp(timestamp: string) {
    let retVal = '';
    if (
      lodash.isString(timestamp) &&
      !lodash.isEmpty(timestamp)
    ) {
      const DATE_AND_TIME = timestamp.split('T');
      if (DATE_AND_TIME.length > 0) {
        const DATE = ramda.pathOr('', [0], DATE_AND_TIME);
        const TIME = ramda.path([1], DATE_AND_TIME);
        retVal = `${retVal}${DATE}`;
        if (TIME.length >= 8) {
          const TIME_WITH_SECONDS = TIME.substring(0, 8);
          retVal = `${retVal} ${TIME_WITH_SECONDS}`;
        }
      }
    }
    return retVal;
  }

  _sanitizeJobStatus(item) {
    const ITEM_JOB_STATUS = item?.jobStatus?.status;
    const ITEM_JOB_STATUS_MESSAGE = item?.jobStatus?.statusMessage;
    if (ITEM_JOB_STATUS === JOB_STATUS.IN_PROGRESS) {
      return ITEM_JOB_STATUS_MESSAGE
    }
    return ITEM_JOB_STATUS
  }

  transformResponseItemToRow(params) {
    const ITEM = params?.item;
    const ITEM_JOB_STATUS = this._sanitizeJobStatus(ITEM);
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: ITEM?.jobId }));
    RET_VAL.push(new TableItem({ data: ITEM?.name }));
    RET_VAL.push(new TableItem({ data: ITEM_JOB_STATUS }));
    RET_VAL.push(new TableItem({ data: ITEM?.jobStatus?.duration }));
    RET_VAL.push(new TableItem({ data: ITEM?.jobStatus?.started, template: this.jobDateTemplate }));
    RET_VAL.push(new TableItem({ data: ITEM?.jobStatus?.ended, template: this.jobDateTemplate }));
    RET_VAL.push(new TableItem({ data: ITEM, template: this.createdTemplate }));
    RET_VAL.push(new TableItem({ data: ITEM, template: this.updatedTemplate }));
    RET_VAL.push(new TableItem({ data: ITEM, template: this.actionsTemplate }));
    return RET_VAL;
  }

  public refreshTableDataRows() {
    const TABLE_ROWS = [];
    if (
      !lodash.isEmpty(this.response.items) &&
      lodash.isArray(this.response.items)
    ) {
      for (let index = 0; index < this.response.items.length; index++) {
        const ITEM = this.response?.items?.[index];
        TABLE_ROWS.push(this.transformResponseItemToRow({
          item: ITEM
        }));
      }
    }
    this.model.data = TABLE_ROWS;
  }

  isShowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }

  isJobCompleted(data) {
    let retVal = false;
    if (data?.jobStatus?.status === JOB_STATUS.COMPLETED) {
      retVal = true;
    }
    return retVal;
  }

  emitSearchEvent(event: any) {
    this.onSearchPlace.emit(event);
  }

  emitSearchClearEvent() {
    this.onClearPlace.emit();
  }

  emitShowExecutePlace(event: any, data) {
    event.stopPropagation();
    _debugX(TopicModelingTableV1.getClassName(), 'emitShowExecutePlace', { data });
    this.onShowExecutePlace.emit(data);
  }

  emitShowResultPlace(event: any, data) {
    event.stopPropagation();
    _debugX(TopicModelingTableV1.getClassName(), 'emitShowExecutePlace', { data });

    const JOB_DATA = {
      jobId: data?.jobId,
      jobName: data?.name
    };
    this.onShowResultPlace.emit(JOB_DATA);
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }
}
