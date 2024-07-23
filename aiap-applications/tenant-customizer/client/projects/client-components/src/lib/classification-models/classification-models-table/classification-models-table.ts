/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, EventEmitter, Output, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

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
  EventsServiceV1,
  QueryServiceV1,
  NotificationServiceV2,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
  CLASSIFIER_MESSAGES,
} from 'client-utils';

import {
  ClassifierServiceV1,
} from 'client-services';

import { BaseTable } from 'client-shared-components';

@Component({
  selector: 'aca-classification-models-table',
  templateUrl: './classification-models-table.html',
  styleUrls: ['./classification-models-table.scss'],
})
export class ClassificationModelsTable extends BaseTable implements OnInit, OnDestroy {

  static getClassName() {
    return 'ClassificationModelsTable';
  }

  @ViewChild('modelTemplate', { static: true }) modelTemplate: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate: TemplateRef<any>;
  @ViewChild('urlList', { static: true }) urlList: TemplateRef<any>;

  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  @ViewChild('actionsTemplate', { static: true }) actionsTemplate: TemplateRef<any>;

  @Output() onSearchPlace = new EventEmitter<any>();
  @Output() onClearPlace = new EventEmitter<any>();
  @Output() onShowRemovePlace = new EventEmitter<any>();

  @Output() onShowTestPlace = new EventEmitter<any>();
  @Output() onShowTrainPlace = new EventEmitter<any>();

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;

  state: any = {
    queryType: DEFAULT_TABLE.CLASSIFIER.TYPE,
    defaultSort: DEFAULT_TABLE.CLASSIFIER.SORT,
    search: '',
  };

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private classifierService: ClassifierServiceV1,
    private translateService: TranslateHelperServiceV1
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
        return this.classifierService.findManyByQuery(defaultQuery).pipe(
          catchError((error) => this.handleFindManyByQueryError(error))
        );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(ClassificationModelsTable.getClassName(), `addFilterEventHandler`, { response });

      this.notificationService.showNotification(CLASSIFIER_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY);
      this.response = response;
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
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('classifications_models_table_v1.col_model.header'),
      field: 'name',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('classifications_models_table_v1.col_urls.header'),
      field: 'urls',
      sortable: false,
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('classifications_models_table_v1.col_status.header'),
      field: 'status',
      sortable: false
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('classifications_models_table_v1.col_updated.header'),
      field: 'updated.date'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('classifications_models_table_v1.col_created.header'),
      field: 'created.date'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('classifications_models_table_v1.col_actions.header'),
      field: 'actions',
      sortable: false,
      style: { 'width': '5%' }
    }));
    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(item: any) {
    const RET_VAL = [];

    RET_VAL.push(new TableItem({ data: item, template: this.modelTemplate }));
    RET_VAL.push(new TableItem({ data: item, template: this.urlList }));
    RET_VAL.push(new TableItem({ data: item, template: this.statusTemplate }));
    RET_VAL.push(new TableItem({ data: item, template: this.updatedTemplate }));
    RET_VAL.push(new TableItem({ data: item, template: this.createdTemplate }));
    RET_VAL.push(new TableItem({ data: item, template: this.actionsTemplate }));

    return RET_VAL;
  }

  handleFindManyByQueryError(error: any) {
    _errorX(ClassificationModelsTable.getClassName(), `handleFindManyByQueryError`, { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(CLASSIFIER_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'classifier-models.view.edit' });
    return RET_VAL;
  }

  syncSearchFieldInputWithQuery() {
    const QUERY = this.queryService.query(this.state.queryType);
    if (!lodash.isEmpty(QUERY?.filter?.search)) {
      this.state.search = QUERY?.filter?.search;
    }
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    this.classifierService.exportMany(QUERY_PARAMS);
  }

  emitShowTrainPlace(event: any) {
    _debugX(ClassificationModelsTable.getClassName(), 'emitShowTrainPlace', { event });
    this.onShowTrainPlace.emit(event);
  }

  emitShowTestPlace(event: any) {
    _debugX(ClassificationModelsTable.getClassName(), 'emitShowTestPlace', { event });
    this.onShowTestPlace.emit(event);
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

}
