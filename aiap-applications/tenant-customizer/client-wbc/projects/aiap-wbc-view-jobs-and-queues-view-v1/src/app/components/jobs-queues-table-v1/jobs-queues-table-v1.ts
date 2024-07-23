/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  TemplateRef,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  TableHeaderItem,
  TableItem
} from 'carbon-components-angular';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  QueryServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  JOBS_QUEUES_MESSAGES
} from '../../messages';

import {
  JobsQueuesServiceV1,
} from 'client-services';

import { BaseTable } from 'client-shared-components';

@Component({
  selector: 'aiap-jobs-queues-table-v1',
  templateUrl: './jobs-queues-table-v1.html',
  styleUrls: ['./jobs-queues-table-v1.scss'],
})
export class JobsQueuesTableV1 extends BaseTable implements OnInit, AfterViewInit, OnDestroy {

  static getClassName() {
    return 'JobsQueuesTableV1';
  }

  @Output() onSearchPlace = new EventEmitter<any>();
  @Output() onClearPlace = new EventEmitter<any>();

  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;

  state: any = {
    queryType: DEFAULT_TABLE.JOBS_QUEUES_V1.TYPE,
    defaultSort: DEFAULT_TABLE.JOBS_QUEUES_V1.SORT,
    search: '',
  };

  selectedRows: Array<any> = [];
  skeletonState: boolean = false;

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private jobsQueuesService: JobsQueuesServiceV1,
  ) {
    super(
      sessionService,
      queryService,
      eventsService,
    );
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    super.ngOnInit();
    this.syncSearchFieldInputWithQuery();
  }


  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap(query => {
        if (query) {
          defaultQuery = query;
        }
        return this.jobsQueuesService.findManyByQuery(defaultQuery).pipe(
          catchError((error) => this.handleFindManyByQueryError(error))
        );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(JobsQueuesTableV1.getClassName(), `addFilterEventHandler`, { response });

      this.notificationService.showNotification(JOBS_QUEUES_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY);
      this.response = response?.items;
      this.refreshTableModel();
      this.selectedRows = [];
      this.eventsService.loadingEmit(false);
    });
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(new TableHeaderItem({ data: "ID", field: 'id' }));
    TABLE_HEADER.push(new TableHeaderItem({ data: "Name", field: 'name', style: { "width": "10%" } }));
    TABLE_HEADER.push(new TableHeaderItem({ data: "Type", field: 'type', style: { "width": "10%" } }));
    TABLE_HEADER.push(new TableHeaderItem({ data: "Redis Client ID", field: 'client', style: { "width": "20%" } }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Updated",
      field: 'updated.date',
      style: { "width": "15%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Created",
      field: 'created.date',
      style: { "width": "15%" }
    }));

    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(item: any) {
    const RET_VAL = [];

    RET_VAL.push(new TableItem({ data: item?.id }));
    RET_VAL.push(new TableItem({ data: item?.name }));
    RET_VAL.push(new TableItem({ data: item?.type }));
    RET_VAL.push(new TableItem({ data: item?.client }));
    RET_VAL.push(new TableItem({ data: item, template: this.updatedTemplate }));
    RET_VAL.push(new TableItem({ data: item, template: this.createdTemplate }));

    return RET_VAL;
  }

  handleFindManyByQueryError(error: any) {
    _errorX(JobsQueuesTableV1.getClassName(), `handleFindManyByQueryError`, { error });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(JOBS_QUEUES_MESSAGES.ERROR.NO_ACCESS_GROUPS);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'jobs-queues.view.edit' });
    return RET_VAL;
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    this.jobsQueuesService.exportMany(QUERY_PARAMS);
  }

  syncSearchFieldInputWithQuery() {
    const QUERY = this.queryService.query(this.state.queryType);
    if (!lodash.isEmpty(QUERY?.filter?.search)) {
      this.state.search = QUERY?.filter?.search;
    }
  }

  emitSearchPlace(event: any) {
    _debugX(JobsQueuesTableV1.getClassName(), 'emitSearchEvent', { event });
    this.onSearchPlace.emit(event);
  }

  emitClearPlace(event: any) {
    _debugX(JobsQueuesTableV1.getClassName(), 'emitClearSearchEvent');
    this.onClearPlace.emit()
  }
}
