/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild, EventEmitter, Input, Output, OnDestroy, TemplateRef } from '@angular/core';
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
  BaseTable,
  BaseModal,
  DEFAULT_TABLE,
  BUY_RULES_SUPPLIERS_MESSAGES,
} from 'client-utils';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  QueryServiceV1,
  EventsServiceV1,
  BuyRulesSuppliersService,
} from 'client-services';

import {
  TranslateHelperServiceV1,
} from 'client-shared-services';

@Component({
  selector: 'aca-buy-rules-suppliers-table',
  templateUrl: './buy-rules-suppliers-table.comp.html',
  styleUrls: ['./buy-rules-suppliers-table.comp.scss'],
})
export class BuyRulesSuppliersTable extends BaseTable implements OnInit, OnDestroy {

  static getClassName() {
    return 'BuyRulesSuppliersTable';
  }

  @ViewChild('baseModalRemove') baseModalRemove: BaseModal;

  @Output() onShowImportPlace = new EventEmitter<any>();

  @Input() showSelectionColumn: boolean = false;

  @Input() set ruleId(ruleId: string) {
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.RULE_ID, ruleId);
    this._ruleId = ruleId;
    if (
      this.model
    ) {
      this.model.data = [];
    }
    this.eventsService.buyRuleSuppliersEmit(this.queryService.query(this.state.queryType));
  }

  _ruleId: string = undefined;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  skeletonState: boolean = false;

  state: any = {
    search: '',
    queryType: DEFAULT_TABLE.BUY_RULES_SUPPLIERS.TYPE,
    defaultSort: DEFAULT_TABLE.BUY_RULES_SUPPLIERS.SORT,
  };

  constructor(
    protected queryService: QueryServiceV1,
    private notificationService: NotificationService,
    protected eventsService: EventsServiceV1,
    private buyRulesSuppliers: BuyRulesSuppliersService,
    private translateService: TranslateHelperServiceV1,
  ) {
    super(queryService, eventsService);
  }

  get ruleId() {
    return this._ruleId;
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    this.state.search = this.queryService.getSearchValue(this.state.queryType);
    super.ngOnInit();
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit() {
    this.eventsService.buyRuleSuppliersEmit(this.queryService.query(this.state.queryType));
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('form_purchase_rule_outcome_v1.buy_rules_suppliers_table.id_header'),
      field: 'external.id'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('form_purchase_rule_outcome_v1.buy_rules_suppliers_table.name_header'),
      field: 'external.name'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('form_purchase_rule_outcome_v1.buy_rules_suppliers_table.priority_header'),
      field: 'priority'
    }));

    this.model.header = TABLE_HEADER
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: item?.external?.id }));
    RET_VAL.push(new TableItem({ data: item?.external?.name }));
    RET_VAL.push(new TableItem({ data: item?.priority }));

    return RET_VAL;
  }

  isShowSavePlaceAllowed() {
    return true;
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.buyRuleSuppliersFilterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query) => {
        if (query) {
          defaultQuery = query;
        }
        return this.buyRulesSuppliers.findManyByQuery(defaultQuery).pipe(
          catchError(error => this.handleFindManyByQueryError(error))
        );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(BuyRulesSuppliersTable.getClassName(), `addFilterEventHandler`, { response });
      const NOTIFICATION = BUY_RULES_SUPPLIERS_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY;
      this.notificationService.showNotification(NOTIFICATION);
      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
    });
  }

  handleSearchChangeEvent(event: any) {
    _debugX(BuyRulesSuppliersTable.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.buyRuleSuppliersEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchClearEvent(event: any) {
    _debugX(BuyRulesSuppliersTable.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.buyRuleSuppliersEmit(this.queryService.query(this.state.queryType));
  }

  handleRefreshClickEvent(event: any) {
    _debugX(BuyRulesSuppliersTable.getClassName(), 'handleRefreshClickEvent', { event });
    this.eventsService.buyRuleSuppliersEmit(this.queryService.query(this.state.queryType))
  }

  emitShowImportPlace() {
    _debugX(BuyRulesSuppliersTable.getClassName(), `emitShowImportPlace`, {});
    this.onShowImportPlace.emit();
  }

  emitRemovePlace() {
    const actionsIds = [];
    const SELECTED: boolean[] = ramda.path(['rowsSelected'], this.model);
    const ROWS: number[] = SELECTED
      .map((selected, index) => selected === true ? index : -1)
      .filter(rows => rows !== -1);
    const TABLE_ROWS = ramda.path(['items'], this.response);
    for (const rowIndex of ROWS) {
      actionsIds.push(TABLE_ROWS[rowIndex].id);
    }

    super.emitShowDeletePlace(actionsIds);
  }

  handleSelectPageEvent(page: any) {
    _debugX(BuyRulesSuppliersTable.getClassName(), 'handleSelectPageEvent', { page });
    this.queryService.handlePageChangeEvent(this.state.queryType, this.model, page, (v) => this.eventsService.buyRuleSuppliersEmit(v));
  }

  handleSortEvent(index: any) {
    _debugX(BuyRulesSuppliersTable.getClassName(), 'handleSortEvent', { index });
    this.queryService.handleSortByHeader(this.state.queryType, this.model, index, (v) => this.eventsService.buyRuleSuppliersEmit(v));
  }

  isRemoveDisabled() {
    if (this.model.rowsSelected.includes(true)) {
      return false
    } else {
      return true
    }
  }

  private handleFindManyByQueryError(error: any) {
    _debugX(BuyRulesSuppliersTable.getClassName(), 'handleSortEvent', { error });
    const NOTIFICATION = BUY_RULES_SUPPLIERS_MESSAGES.ERROR.FIND_MANY_BY_QUERY;
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }
}
