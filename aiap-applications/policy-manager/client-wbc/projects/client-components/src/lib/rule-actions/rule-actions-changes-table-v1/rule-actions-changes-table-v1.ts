/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';

import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import moment from 'moment';

import {
  NotificationService,
  TableHeaderItem,
  TableItem,
} from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
  SessionServiceV1,
  UtilsServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseTableV1,
} from 'client-shared-components';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  ClientSideDownloadServiceV1,
  RULE_ACTIONS_CHANGES_MESSAGES_V1,
  RuleActionsChangesServiceV1
} from 'client-services';


@Component({
  selector: 'aiap-rule-actions-changes-table-v1',
  templateUrl: './rule-actions-changes-table-v1.html',
  styleUrls: ['./rule-actions-changes-table-v1.scss'],
})
export class RuleActionsChangesTableV1 extends BaseTableV1 implements OnInit, AfterViewInit {

  static getClassName() {
    return 'RuleActionsChangesTableV1';
  }

  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;

  _state: any = {
    search: '',
    query: {
      type: DEFAULT_TABLE.RULE_ACTIONS_CHANGES_V1.TYPE,
      sort: DEFAULT_TABLE.RULE_ACTIONS_CHANGES_V1.SORT,
    }
  };
  state = lodash.cloneDeep(this._state);

  constructor(
    // params-supper
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    protected sessionService: SessionServiceV1,
    // params
    private notificationService: NotificationService,
    private utilsService: UtilsServiceV1,
    private clientSideDownloadService: ClientSideDownloadServiceV1,
    private ruleActionsChangesService: RuleActionsChangesServiceV1,
    private translateService: TranslateHelperServiceV1,

  ) {
    super(sessionService, queryService, eventsService)
  }

  ngOnInit() {
    super.setQueryType(this.state?.query?.type);
    this.queryService.setSort(this.state?.query?.type, this.state?.query?.sort);
    this.state.search = this.queryService.getSearchValue(this.state?.query?.type);
    super.ngOnInit();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('rule_actions.actions_changes_table_v1.action_id_header'),
      field: 'actionId'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('rule_actions.actions_changes_table_v1.action_header'),
      field: 'action'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('rule_actions.actions_changes_table_v1.document_id_header'),
      field: 'docExtId',
      style: { "width": "15%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('rule_actions.actions_changes_table_v1.document_type_header'),
      field: 'docType',
      style: { "width": "10%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('rule_actions.actions_changes_table_v1.changed_header'),
      field: 'created.date',
      style: { "width": "20%" }
    }));

    this.model.header = TABLE_HEADER
  }

  protected isShowRowSavePlaceAllowed(): boolean {
    const RET_VAL = false;
    return RET_VAL;
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: item?.actionId, raw: item }));
    RET_VAL.push(new TableItem({ data: item?.action }));
    RET_VAL.push(new TableItem({ data: item?.doc?.id }));
    RET_VAL.push(new TableItem({ data: item?.docType }));

    RET_VAL.push(new TableItem({ data: item, template: this.createdTemplate }));

    return RET_VAL;
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state?.query?.type);
    this.eventsService.filterEmitter
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        switchMap((query: any) => {
          if (query) {
            defaultQuery = query;
          }
          const RET_VAL = this.ruleActionsChangesService.findManyByQuery(defaultQuery).pipe(
            catchError((error) => this.handleFindManyByQueryError(error))
          );
          return RET_VAL;
        }
        ),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugX(RuleActionsChangesTableV1.getClassName(), `addFilterEventHandler`,
          {
            response
          });

        this.response = response;
        this.refreshTableModel();
        this.eventsService.loadingEmit(false);
      });
  }

  handleSearchChangeEvent(event: any) {
    _debugX(RuleActionsChangesTableV1.getClassName(), `handleSearchChangeEvent`,
      {
        event
      });

    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleSearchClearEvent(event: any) {
    _debugX(RuleActionsChangesTableV1.getClassName(), `handleSearchClearEvent`,
      {
        event
      });

    this.queryService.deleteFilterItems(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  isShowSavePlaceAllowed() {
    return true;
  }

  exportMany() {
    this.ruleActionsChangesService.exportMany(this.queryService.query(this.state?.query?.type))
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleExportManyError(error)),
        takeUntil(this._destroyed$)
      ).subscribe((data) => {
        this.clientSideDownloadService.openSaveFileDialog(data, `rule-actions-changes.${moment().format('YYYY-MM-DD')}.json`, undefined);
        const NOTIFICATION = RULE_ACTIONS_CHANGES_MESSAGES_V1
          .SUCCESS
          .EXPORT_MANY();

        this.notificationService.showNotification(NOTIFICATION);
        this.eventsService.loadingEmit(false);
      });
  }

  private handleFindManyByQueryError(error: any) {
    _debugX(RuleActionsChangesTableV1.getClassName(), `handleFindManyByQueryError`,
      {
        error
      });

    const NOTIFICATION = RULE_ACTIONS_CHANGES_MESSAGES_V1
      .ERROR
      .FIND_MANY_BY_QUERY();

    this.notificationService.showNotification(NOTIFICATION);
    this.eventsService.loadingEmit(false);
    return of();
  }

  private handleExportManyError(error: any) {
    _debugX(RuleActionsChangesTableV1.getClassName(), `handleExportManyError`,
      {
        error
      });

    const NOTIFICATION = RULE_ACTIONS_CHANGES_MESSAGES_V1
      .ERROR
      .EXPORT_MANY();

    this.notificationService.showNotification(NOTIFICATION);
    this.eventsService.loadingEmit(false);
    return of();
  }
}
