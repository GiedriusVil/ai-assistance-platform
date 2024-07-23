/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnInit, ViewChild, TemplateRef, OnChanges, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { of } from 'rxjs';

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
  TOPIC_MODELING_MESSAGES,
} from 'client-utils';


import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services'

import {
  BaseTable,
} from 'client-shared-components';

import {
  TopicModelingService,
} from 'client-services';


@Component({
  selector: 'aiap-topic-modeling-topic-table-v1',
  templateUrl: './topic-modeling-topic-table-v1.html',
  styleUrls: ['./topic-modeling-topic-table-v1.scss'],
})
export class TopicModelingTopicsTableV1 extends BaseTable implements OnInit, OnChanges, AfterViewInit {

  static getClassName() {
    return 'TopicModelingTopicsTableV1';
  }

  @Input() response;
  @Input() jobId;

  @Output() onShowExecutePlace = new EventEmitter<any>();
  @Output() onShowResultPlace = new EventEmitter<any>();

  @ViewChild('clusterTags', { static: true }) clusterTags: TemplateRef<any>;


  isActionsClickAllowed = false;

  _state = {
    search: ''
  }
  state = lodash.cloneDeep(this._state);
  selectedRows: Array<any> = [];


  constructor(
    private notificationService: NotificationService,
    private translateService: TranslateHelperServiceV1,
    private topicModelingService: TopicModelingService,
    protected eventsService: EventsServiceV1,
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() { }

  ngAfterViewInit() { }

  ngOnChanges() {
    super.ngOnInit();
    this.refreshTableDataRows();
  }

  addFilterEventHandler() { }


  handleFindManyByQueryError(error: any) {
    _errorX(TopicModelingTopicsTableV1.getClassName(), 'handleFindManyByQueryError', { error })
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(TOPIC_MODELING_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('topic_modeling_view_v1.topic_table_v1.col_cluster_id.header'),
      field: 'clusterId',
      style: {
        width: '10%'
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('topic_modeling_view_v1.topic_table_v1.col_tags.header'),
      field: 'tags'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('topic_modeling_view_v1.topic_table_v1.col_samples_count.header'),
      field: 'samplesCount',
      style: {
        width: '15%'
      }
    }));

    this.model.header = TABLE_HEADER;
  }


  transformResponseItemToRow(item) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: item?.cluster }));
    RET_VAL.push(new TableItem({ data: item?.cluster_tag, template: this.clusterTags }));
    RET_VAL.push(new TableItem({ data: item?.samples_count }));
    return RET_VAL;
  }

  refreshTableDataRows() {
    const TABLE_ROWS = [];
    if (
      !lodash.isEmpty(this.response.items) &&
      lodash.isArray(this.response.items)
    ) {
      for (let item of this.response.items) {
        TABLE_ROWS.push(this.transformResponseItemToRow(item));
      }
    }
    this.model.data = TABLE_ROWS;
  }

  isShowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }


  emitSearchPlaceEvent(event: any) {
    this.onSearchPlace.emit(event);
  }

  emitClearPlaceEvent(event) {
    this.onClearPlace.emit(event);
  }

  retrieveSelectedRowsIds() {
    const RET_VAL = [];
    const TABLE_ITEMS = this.response?.items;
    for (const selectedRow of this.selectedRows) {
      const SELECTED_APP_INDEX = selectedRow?.rowIndex;
      RET_VAL.push(TABLE_ITEMS[SELECTED_APP_INDEX].cluster);
    };
    return RET_VAL;
  }

  rowDeselect(deselectedRow) {
    let filteredArray = this.selectedRows.filter(selectedRow => { return selectedRow.rowIndex !== deselectedRow.deselectedRowIndex });
    this.selectedRows = filteredArray;
  }

  rowSelect(row: any) {
    const SELECTED_ROW_INDEX = row.selectedRowIndex;
    const SELECTED_ROW_DATA = ramda.path(['model', '_data', SELECTED_ROW_INDEX], row);
    this.selectedRows.push({
      rowData: SELECTED_ROW_DATA,
      rowIndex: SELECTED_ROW_INDEX
    });
  }

  isExportDisabled() {
    if (!lodash.isEmpty(this.selectedRows)) {
      return false;
    } else {
      return true;
    }
  }


  deselectAllRows() {
    this.selectedRows = [];
  }

  selectAllRows(allRows) {
    const ROWS_DATA = allRows?._data
    ROWS_DATA.forEach((rowData, index) => {
      if (lodash.isEmpty(rowData)) {
        return
      }
      this.selectedRows.push({
        rowData: rowData,
        rowIndex: index
      });
    });
  }


  exportMany() {
    const SELECTED_IDS = this.retrieveSelectedRowsIds();
    const PARAMS = {
      ids: SELECTED_IDS,
      jobId: this.jobId
    }
    this.topicModelingService.exportMany(PARAMS);
  }

  emitShowExecutePlace(event: any, data) {
    event.stopPropagation();
    _debugX(TopicModelingTopicsTableV1.getClassName(), 'emitShowExecutePlace', { data });
    this.onShowExecutePlace.emit(data);
  }

  emitShowResultPlace(event: any, data) {
    event.stopPropagation();
    _debugX(TopicModelingTopicsTableV1.getClassName(), 'emitShowExecutePlace', { data });

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
