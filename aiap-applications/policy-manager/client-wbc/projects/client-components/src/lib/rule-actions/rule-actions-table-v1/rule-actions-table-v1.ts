/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild, EventEmitter, Input, Output, OnDestroy, TemplateRef } from '@angular/core';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import moment from 'moment';

import {
  TableHeaderItem,
  TableItem,
  NotificationService
} from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  UtilsServiceV1,
  QueryServiceV1,
  EventsServiceV1,
  SessionServiceV1,
  TranslateHelperServiceV1
} from 'client-shared-services';

import {
  BaseTableV1,
} from 'client-shared-components';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  ClientSideDownloadServiceV1,
  RULE_ACTIONS_MESSAGES_V1,
  RuleActionsServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-rule-actions-table-v1',
  templateUrl: './rule-actions-table-v1.html',
  styleUrls: ['./rule-actions-table-v1.scss'],
})
export class RuleActionsTableV1 extends BaseTableV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'RuleActionsTableV1';
  }

  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  @Output() onShowImportPlace = new EventEmitter<any>();

  @Input() isImport: boolean = false;
  @Input() showSelectionColumn: boolean = false;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  skeletonState: boolean = false;

  _state: any = {
    search: '',
    query: {
      type: DEFAULT_TABLE.RULE_ACTIONS_V1.TYPE,
      sort: DEFAULT_TABLE.RULE_ACTIONS_V1.SORT,
    }
  };
  state = lodash.cloneDeep(this._state);

  constructor(
    // params-super
    protected eventsService: EventsServiceV1,
    protected queryService: QueryServiceV1,
    protected sessionService: SessionServiceV1,
    // params-shared
    private notificationService: NotificationService,
    private utilsService: UtilsServiceV1,
    // params-native
    private ruleActionsService: RuleActionsServiceV1,
    private clientSideDownloadService: ClientSideDownloadServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state?.query?.type);
    this.queryService.setSort(this.state?.query?.type, this.state?.query?.sort);
    this.state.search = this.queryService.getSearchValue(this.state?.query?.type);
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  protected isShowRowSavePlaceAllowed(): boolean {
    const RET_VAL = true;
    return RET_VAL;
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('rule_actions.table_v1.key_header'),
      field: 'key',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('rule_actions.table_v1.text_header'),
      field: 'text',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('rule_actions.table_v1.created_header'),
      field: 'created.date',
      style: { "width": "15%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('rule_actions.table_v1.updated_header'),
      field: 'updated.date',
      style: { "width": "15%" }
    }));

    this.model.header = TABLE_HEADER
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({
      data: item?.key
    }));
    RET_VAL.push(new TableItem({
      data: item?.text
    }));
    RET_VAL.push(new TableItem({ data: item, template: this.createdTemplate }));
    RET_VAL.push(new TableItem({ data: item, template: this.updatedTemplate }));

    return RET_VAL;
  }

  isShowSavePlaceAllowed() {
    return true;
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state?.query?.type);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query: any) => {
        if (
          query
        ) {
          defaultQuery = query;
        }
        return this.ruleActionsService.findManyByQuery(defaultQuery)
          .pipe(
            catchError((error: any) => this.handleFindManyByQueryError(error))
          );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(RuleActionsTableV1.getClassName(), `addFilterEventHandler`,
        {
          response
        });

      const NOTIFICATION = RULE_ACTIONS_MESSAGES_V1
        .SUCCESS
        .FIND_MANY_BY_QUERY();

      this.notificationService.showNotification(NOTIFICATION);
      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);

    });
  }

  handleSearchChangeEvent(event: any) {
    _debugX(RuleActionsTableV1.getClassName(), `handleSearchChangeEvent`,
      {
        event
      });

    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleSearchClearEvent(event: any) {
    _debugX(RuleActionsTableV1.getClassName(), `handleSearchClearEvent`,
      {
        event
      });

    this.queryService.deleteFilterItems(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  emitShowImportPlace() {
    _debugX(RuleActionsTableV1.getClassName(), `emitShowImportPlace`,
      {});

    this.onShowImportPlace.emit();
  }

  emitRemovePlace() {
    const actionsIds = [];

    const SELECTED: boolean[] = this.model?.rowsSelected;

    const ROWS: number[] = SELECTED
      .map((selected, index) => selected === true ? index : -1)
      .filter(rows => rows !== -1);
    const TABLE_ROWS = this.response?.items;
    for (const rowIndex of ROWS) {
      actionsIds.push(TABLE_ROWS[rowIndex].id);
    }
    super.emitShowDeletePlace(actionsIds);
  }

  exportMany() {
    this.ruleActionsService.exportMany(this.queryService.query(this.state?.query?.type))
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleExportManyError(error)),
        takeUntil(this._destroyed$)
      ).subscribe((data) => {
        this.clientSideDownloadService.openSaveFileDialog(data, `rule-actions.${moment().format('YYYY-MM-DD')}.json`, undefined);
        const NOTIFICATION = RULE_ACTIONS_MESSAGES_V1
          .SUCCESS
          .EXPORT_MANY();

        this.notificationService.showNotification(NOTIFICATION);
        this.eventsService.loadingEmit(false);
      });
  }

  isRemoveDisabled() {
    if (this.model.rowsSelected.includes(true)) {
      return false
    } else {
      return true
    }
  }

  private handleExportManyError(error: any) {
    _debugX(RuleActionsTableV1.getClassName(), 'handleExportManyError',
      {
        error
      });

    const NOTIFICATION = RULE_ACTIONS_MESSAGES_V1
      .ERROR
      .EXPORT_MANY();

    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  private handleFindManyByQueryError(error: any) {
    _debugX(RuleActionsTableV1.getClassName(), 'handleFindManyByQueryError',
      {
        error
      });

    const NOTIFICATION = RULE_ACTIONS_MESSAGES_V1
      .ERROR
      .FIND_MANY_BY_QUERY();

    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  onSelectRow(event: any) {
    _debugX(RuleActionsTableV1.getClassName(), 'onSelectRow',
      {
        event
      });
  }

  onDeselectRow(event: any) {
    _debugX(RuleActionsTableV1.getClassName(), 'onDeselectRow',
      {
        event
      });
  }

  onDeselectAll(event: any) {
    _debugX(RuleActionsTableV1.getClassName(), 'onDeselectAll',
      {
        event
      });
  }

  onSelectAll(event: any) {
    _debugX(RuleActionsTableV1.getClassName(), 'onDeselectAll',
      {
        event
      });
  }

}
