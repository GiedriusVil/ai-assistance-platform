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
  NotificationService
} from 'carbon-components-angular';

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  QueryServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseTable
} from 'client-shared-components';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  VALIDATION_ENGAGEMENTS_MESSAGES_V1,
  ValidationEngagementsServiceV1,
} from 'client-services';


@Component({
  selector: 'aiap-wbc-validation-engagements-table-v1',
  templateUrl: './validation-engagements-table-v1.html',
  styleUrls: ['./validation-engagements-table-v1.scss'],
})
export class ValidationEngagementsTableV1 extends BaseTable implements OnInit, OnDestroy {

  static getClassName() {
    return 'ValidationEngagementsTableV1';
  }

  @Output() onShowRemovePlace = new EventEmitter<any>();
  @Output() onSearchEvent = new EventEmitter<any>();
  @Output() onSearchClearEvent = new EventEmitter<any>();

  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  state: any = {
    queryType: DEFAULT_TABLE.VALIDATION_ENGAGEMENTS_V1.TYPE,
    defaultSort: DEFAULT_TABLE.VALIDATION_ENGAGEMENTS_V1.SORT,
    search: '',
  };

  selectedRows: Array<any> = [];

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationService,
    private validationEngagementsService: ValidationEngagementsServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    this.syncSearchFieldInputWithQuery();
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    const NOTIFICATIONS = this.notificationService.notificationRefs;
    _debugW(ValidationEngagementsTableV1.getClassName(), 'ngOnDestroy', { NOTIFICATIONS });
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('view_validation_engagements_v1.table.key_header'),
      field: '_id',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('view_validation_engagements_v1.table.updated_header'),
      field: 'updated.date',
      style: { "width": "15%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('view_validation_engagements_v1.table.created_header'),
      field: 'created.date',
      style: { "width": "15%" }
    }));
    this.model.header = TABLE_HEADER
  }

  transformResponseItemToRow(item: any) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: item?.key }));
    RET_VAL.push(new TableItem({ data: item, template: this.updatedTemplate }));
    RET_VAL.push(new TableItem({ data: item, template: this.createdTemplate }));
    return RET_VAL;
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query: any) => {
        if (query) { defaultQuery = query; }
        _debugW(ValidationEngagementsTableV1.getClassName(), `addFilterEventHandler`, { this_query: defaultQuery });
        return this.validationEngagementsService.findManyByQuery(defaultQuery).pipe(
          catchError((error) => this.handleFindManyByQueryError(error))
        );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugW(ValidationEngagementsTableV1.getClassName(), `addFilterEventHandler`, { response });
      this.response = response;
      this.refreshTableModel();
      this.selectedRows = [];
      this.notificationService.showNotification(VALIDATION_ENGAGEMENTS_MESSAGES_V1.SUCCESS.FIND_MANY_BY_QUERY());
      this.eventsService.loadingEmit(false);
    });
  }

  handleFindManyByQueryError(error: any) {
    _errorW(ValidationEngagementsTableV1.getClassName(), `handleFindManyByQueryError`, { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(VALIDATION_ENGAGEMENTS_MESSAGES_V1.ERROR.FIND_MANY_BY_QUERY());
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'validation-engagements.view.edit' });
    return RET_VAL;
  }

  syncSearchFieldInputWithQuery() {
    const QUERY = this.queryService.query(this.state.queryType);
    if (!lodash.isEmpty(QUERY.filter.search)) {
      this.state.search = QUERY.filter.search;
    }
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    this.validationEngagementsService.exportMany(QUERY_PARAMS);
  }

  emitRemovePlace() {
    const REMOVE_CONFIG_KEYS = [];
    const TABLE_ITEMS = ramda.path(['items'], this.response);
    for (const selectedItem of this.selectedRows) {
      const SELECTED_CONFIG_INDEX = ramda.path(['rowIndex'], selectedItem);
      REMOVE_CONFIG_KEYS.push(TABLE_ITEMS[SELECTED_CONFIG_INDEX].key);
    };
    _debugW(ValidationEngagementsTableV1.getClassName(), 'emitRemovePlace', { REMOVE_CONFIG_KEYS });
    this.onShowRemovePlace.emit(REMOVE_CONFIG_KEYS);
  }

  emitSearchEvent(event: any) {
    this.onSearchEvent.emit(event);
  }

  emitSearchClearEvent() {
    this.onSearchClearEvent.emit();
  }

}
