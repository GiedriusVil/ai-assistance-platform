/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges, ViewChild, TemplateRef } from '@angular/core';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  TableHeaderItem,
  TableItem,
} from 'client-shared-carbon';

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import {
  BaseTable,
} from 'client-shared-components';

import {
  QueryServiceV1,
  SessionServiceV1,
  EventsServiceV1,
  TranslateHelperServiceV1
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  RulesConditionsServiceV2,
} from 'client-services';

@Component({
  selector: 'aiap-rules-conditions-table-v2',
  templateUrl: './rules-conditions-table-v2.html',
  styleUrls: ['./rules-conditions-table-v2.scss'],
})
export class RulesConditionsTableV2 extends BaseTable implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'RulesConditionsTableV2';
  }

  @ViewChild("createdTemplate", { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild("updatedTemplate", { static: true }) updatedTemplate: TemplateRef<any>;

  @Input() ruleId: any = undefined;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;

  state: any = {
    search: '',
    queryType: DEFAULT_TABLE.RULES_CONDITIONS_V2.TYPE,
    defaultSort: DEFAULT_TABLE.RULES_CONDITIONS_V2.SORT,
  };

  constructor(
    protected queryService: QueryServiceV1,
    protected sessionService: SessionServiceV1,
    protected eventsService: EventsServiceV1,
    private RulesConditionsServiceV2: RulesConditionsServiceV2,
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

  ngOnChanges(changes: SimpleChanges): void {
    _debugW(RulesConditionsTableV2.getClassName(), 'ngOnChanges',
      {
        changes
      })
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('view_rules_v2.rules_conditions_table.path_header'),
      field: 'path'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('view_rules_v2.rules_conditions_table.condition_header'),
      field: 'condition'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('view_rules_v2.rules_conditions_table.value_header'),
      field: 'value'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('view_rules_v2.rules_conditions_table.created_header'),
      field: 'created.date',
      style: { "width": "15%" },
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('view_rules_v2.rules_conditions_table.updated_header'),
      field: 'updated.date',
      style: { "width": "15%" },
    }));

    this.model.header = TABLE_HEADER
  }

  transformResponseItemToRow(item: any) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({
      data: item?.path?.value
    }));
    RET_VAL.push(new TableItem({
      data: item?.operator?.type
    }));
    RET_VAL.push(new TableItem({
      data: item?.value
    }));
    RET_VAL.push(new TableItem({
      data: item,
      template: this.createdTemplate,
    }));
    RET_VAL.push(new TableItem({
      data: item,
      template: this.updatedTemplate,
    }));
    return RET_VAL;
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'rules-v2.view.edit.conditions.edit' });
    return RET_VAL;
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.modalFilterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query) => {
        if (query) {
          defaultQuery = query;
        }
        if (
          !lodash.isObject(defaultQuery?.filter)
        ) {
          defaultQuery.filter = {};
        }
        defaultQuery.filter.ruleId = this.ruleId;
        _debugW(RulesConditionsTableV2.getClassName(), 'addFilterEventHandler-switchMap', {
          defaultQuery: defaultQuery,
          this_ruleId: this.ruleId,
        })
        return this.RulesConditionsServiceV2.findManyByQuery(defaultQuery).pipe(
          catchError(error => this.handleFindManyByQueryError(error))
        );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugW(RulesConditionsTableV2.getClassName(), `addFilterEventHandler`, { response });
      this.response = response;
      this.deselectAllRows();
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
    });
  }

  resetTable() {
    this.response = [];
    this.deselectAllRows();
    this.refreshTableModel();
  }

  handleFindManyByQueryError(error: any) {
    _errorW(RulesConditionsTableV2.getClassName(), `handleFindManyByQueryError`, { error });
    this.eventsService.loadingEmit(false);
    return of();
  }

  handleSearchChangeEvent(event: any) {
    _debugW(RulesConditionsTableV2.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.modalFilterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchClearEvent(event: any) {
    _debugW(RulesConditionsTableV2.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.modalFilterEmit(this.queryService.query(this.state.queryType));
  }

  public refreshTable() {
    if (this.eventsService && !lodash.isEmpty(this.ruleId)) {
      this.eventsService.modalFilterEmit(this.queryService.query(this.state.queryType));
    } else {
      this.resetTable();
    }
  }

  emitRemovePlace() {
    const REMOVE_CONDITIONS = [];
    const TABLE_ITEMS = ramda.path(['items'], this.response);
    for (let selectedItem of this.selectedRows) {
      const SELECTED_CONDITION_INDEX = ramda.path(['rowIndex'], selectedItem);
      REMOVE_CONDITIONS.push(TABLE_ITEMS[SELECTED_CONDITION_INDEX]);
    };
    _debugW(RulesConditionsTableV2.getClassName(), 'emitRemovePlace', { REMOVE_CONDITIONS });
    this.onShowRemovePlace.emit(REMOVE_CONDITIONS);
  }

  syncSearchFieldInputWithQuery() {
    const QUERY = this.queryService.query(this.state.queryType);
    if (!lodash.isEmpty(QUERY.filter.search)) {
      this.state.search = QUERY.filter.search;
    }
  }
}
