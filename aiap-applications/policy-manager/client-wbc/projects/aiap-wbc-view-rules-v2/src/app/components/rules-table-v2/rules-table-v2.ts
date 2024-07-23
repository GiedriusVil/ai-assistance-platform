/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild, OnDestroy, TemplateRef } from '@angular/core';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

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
  BaseTable,
} from 'client-shared-components';

import {
  EventsServiceV1,
  UtilsServiceV1,
  QueryServiceV1,
  SessionServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  RulesServiceV2,
} from 'client-services';

import {
  RULES_MESSAGES_V2,
} from '../../messages';

@Component({
  selector: 'aiap-rules-table-v2',
  templateUrl: './rules-table-v2.html',
  styleUrls: ['./rules-table-v2.scss'],
})
export class RulesTableV2 extends BaseTable implements OnInit, OnDestroy {

  static getClassName() {
    return 'RulesTableV2';
  }

  @ViewChild("createdTemplate", { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild("updatedTemplate", { static: true }) updatedTemplate: TemplateRef<any>;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  skeletonState: boolean = false;

  state: any = {
    search: '',
    queryType: DEFAULT_TABLE.RULES_V2.TYPE,
    defaultSort: DEFAULT_TABLE.RULES_V2.SORT,
  };

  selectedRows: any[] = [];

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    private notificationService: NotificationService,
    protected eventsService: EventsServiceV1,
    private utilsService: UtilsServiceV1,
    private RulesServiceV2: RulesServiceV2,
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
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(
      new TableHeaderItem({
        data: this.translateService.instant('view_rules_v2.rules_table_v2.key_header'),
        field: 'key',
      })
    );
    TABLE_HEADER.push(
      new TableHeaderItem({
        data: this.translateService.instant('view_rules_v2.rules_table_v2.name_header'),
        field: 'name',
      })
    );
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('view_rules_v2.rules_table_v2.engagement_header'),
      field: 'engagement',
      style: { "width": "12.5%" },
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('view_rules_v2.rules_table_v2.effective_header'),
      field: 'effective',
      style: { "width": "12.5%" },
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('view_rules_v2.rules_table_v2.expires_header'),
      field: 'expires',
      style: { "width": "12.5%" },
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('view_rules_v2.rules_table_v2.created_header'),
      field: 'created.date',
      style: { "width": "12.5%" },
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('view_rules_v2.rules_table_v2.updated_header'),
      field: 'updated.date',
      style: { "width": "12.5%" },
    }));
    this.model.header = TABLE_HEADER
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: item?.key }));
    RET_VAL.push(new TableItem({ data: item?.name }));
    RET_VAL.push(new TableItem({ data: item?.engagement?.key }));
    RET_VAL.push(new TableItem({ data: this.utilsService.transformDateString(item?.effective, false) }));
    RET_VAL.push(new TableItem({ data: this.utilsService.transformDateString(item?.expires, false) }));
    RET_VAL.push(new TableItem({ data: item, template: this.createdTemplate }));
    RET_VAL.push(new TableItem({ data: item, template: this.updatedTemplate }));
    return RET_VAL;
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'rules-v2.view.edit' });
    return RET_VAL;
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);

    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query) => {
        if (query) { defaultQuery = query; }
        return this.RulesServiceV2.findManyByQuery(defaultQuery).pipe(
          catchError(error => this.handleFindManyByQueryError(error))
        );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugW(RulesTableV2.getClassName(), `addFilterEventHandler`, { response });
      this.response = response;
      this.selectedRows = [];
      this.refreshTableModel();
      this.notificationService.showNotification(RULES_MESSAGES_V2.SUCCESS.FIND_MANY_BY_QUERY);
      this.eventsService.loadingEmit(false);
    });
  }

  handleSearchChangeEvent(event: any) {
    _debugW(RulesTableV2.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchClearEvent(event: any) {
    _debugW(RulesTableV2.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  emitShowImportPlace() {
    _debugW(RulesTableV2.getClassName(), `emitShowImportPlace`, {});
    this.onShowImportPlace.emit();
  }

  emitRemovePlace() {
    const REMOVE_RULES = [];
    const TABLE_ITEMS = ramda.path(['items'], this.response);
    for (let selectedItem of this.selectedRows) {
      const SELECTED_RULE_INDEX = ramda.path(['rowIndex'], selectedItem);
      REMOVE_RULES.push(TABLE_ITEMS[SELECTED_RULE_INDEX]);
    };
    _debugW(RulesServiceV2.getClassName(), 'emitRemovePlace', { REMOVE_RULES });
    this.onShowRemovePlace.emit(REMOVE_RULES);
  }

  syncSearchFieldInputWithQuery() {
    const QUERY = this.queryService.query(this.state.queryType);
    if (!lodash.isEmpty(QUERY.filter.search)) {
      this.state.search = QUERY.filter.search;
    }
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    this.RulesServiceV2.exportMany(QUERY_PARAMS);
  }

  handleFindManyByQueryError(error: any) {
    _errorW(RulesTableV2.getClassName(), `handleFindManyByQueryError`, { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(RULES_MESSAGES_V2.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

}
