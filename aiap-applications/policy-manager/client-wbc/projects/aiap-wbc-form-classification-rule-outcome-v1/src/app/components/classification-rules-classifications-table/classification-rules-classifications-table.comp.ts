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
  CLASSIFICATION_RULES_CLASSIFICATIONS_MESSAGES,
} from 'client-utils';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  QueryServiceV1,
  EventsServiceV1,
  ClassificationRulesClassificationsService
} from 'client-services';

import {
  TranslateHelperServiceV1,
} from 'client-shared-services';

@Component({
  selector: 'aca-classification-rules-classifications-table',
  templateUrl: './classification-rules-classifications-table.comp.html',
  styleUrls: ['./classification-rules-classifications-table.comp.scss'],
})
export class ClassificationRulesClassificationsTable extends BaseTable implements OnInit, OnDestroy {

  static getClassName() {
    return 'ClassificationRulesClassificationsTable';
  }

  @ViewChild('baseModalRemove') baseModalRemove: BaseModal;
  @ViewChild("classificationColumn", { static: true }) classificationColumn: TemplateRef<any>;

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
    this.eventsService.classificationRuleClassificationsEmit(this.queryService.query(this.state.queryType));
  }

  _ruleId: string = undefined;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  skeletonState: boolean = false;

  state: any = {
    search: '',
    queryType: DEFAULT_TABLE.CLASSIFICATION_RULE_CLASSIFICATIONS.TYPE,
    defaultSort: DEFAULT_TABLE.CLASSIFICATION_RULE_CLASSIFICATIONS.SORT,
  };

  constructor(
    protected queryService: QueryServiceV1,
    private notificationService: NotificationService,
    protected eventsService: EventsServiceV1,
    private classificationRulesClassificationsService: ClassificationRulesClassificationsService,
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
    this.eventsService.classificationRuleClassificationsEmit(this.queryService.query(this.state.queryType));
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('classification_rules.classification_table.segment_header'),
      field: 'external.segment'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('classification_rules.classification_table.family_header'),
      field: 'external.family'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('classification_rules.classification_table.class_header'),
      field: 'external.class'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('classification_rules.classification_table.commodity_header'),
      field: 'external.commodity'
    }));


    this.model.header = TABLE_HEADER
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({
      data: item?.external?.segment,
      template: this.classificationColumn
    }));
    RET_VAL.push(new TableItem({
      data: item?.external?.family,
      template: this.classificationColumn
    }));
    RET_VAL.push(new TableItem({
      data: item?.external?.class,
      template: this.classificationColumn
    }));
    RET_VAL.push(new TableItem({
      data: item?.external?.commodity,
      template: this.classificationColumn
    }));

    return RET_VAL;
  }

  isShowSavePlaceAllowed() {
    return true;
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.classificationRuleClassificationsFilterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query) => {
        if (query) {
          defaultQuery = query;
        }
        return this.classificationRulesClassificationsService.findManyByQuery(defaultQuery).pipe(
          catchError(error => this.handleFindManyByQueryError(error))
        );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(ClassificationRulesClassificationsTable.getClassName(), `addFilterEventHandler`, { response });
      const NOTIFICATION = CLASSIFICATION_RULES_CLASSIFICATIONS_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY;
      this.notificationService.showNotification(NOTIFICATION);
      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
    });
  }

  handleSearchChangeEvent(event: any) {
    _debugX(ClassificationRulesClassificationsTable.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.classificationRuleClassificationsEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchClearEvent(event: any) {
    _debugX(ClassificationRulesClassificationsTable.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.classificationRuleClassificationsEmit(this.queryService.query(this.state.queryType));
  }

  handleRefreshClickEvent(event: any) {
    _debugX(ClassificationRulesClassificationsTable.getClassName(), 'handleRefreshClickEvent', { event });
    this.eventsService.classificationRuleClassificationsEmit(this.queryService.query(this.state.queryType))
  }

  emitShowImportPlace() {
    _debugX(ClassificationRulesClassificationsTable.getClassName(), `emitShowImportPlace`, {});
    this.onShowImportPlace.emit();
  }

  emitRemovePlace() {
    const classificationIds = [];
    const SELECTED: boolean[] = ramda.path(['rowsSelected'], this.model);
    const ROWS: number[] = SELECTED
      .map((selected, index) => selected === true ? index : -1)
      .filter(rows => rows !== -1);
    const TABLE_ROWS = ramda.path(['items'], this.response);
    for (const rowIndex of ROWS) {
      classificationIds.push(TABLE_ROWS[rowIndex].id);
    }

    super.emitShowDeletePlace(classificationIds);
  }

  handleSelectPageEvent(page: any) {
    _debugX(ClassificationRulesClassificationsTable.getClassName(), 'handleSelectPageEvent', { page });
    this.queryService.handlePageChangeEvent(this.state.queryType, this.model, page, (v) => this.eventsService.classificationRuleClassificationsEmit(v));
  }

  handleSortEvent(index: any) {
    _debugX(ClassificationRulesClassificationsTable.getClassName(), 'handleSortEvent', { index });
    this.queryService.handleSortByHeader(this.state.queryType, this.model, index, (v) => this.eventsService.classificationRuleClassificationsEmit(v));
  }

  isRemoveDisabled() {
    if (this.model.rowsSelected.includes(true)) {
      return false
    } else {
      return true
    }
  }

  private handleFindManyByQueryError(error: any) {
    _debugX(ClassificationRulesClassificationsTable.getClassName(), 'handleFindManyByQueryError', { error });
    const NOTIFICATION = CLASSIFICATION_RULES_CLASSIFICATIONS_MESSAGES.ERROR.FIND_MANY_BY_QUERY;
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

}
