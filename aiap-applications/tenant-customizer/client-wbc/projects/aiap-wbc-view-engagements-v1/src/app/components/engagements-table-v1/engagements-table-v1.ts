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
} from '@angular/core';

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
  BrowserServiceV1,
  EventsServiceV1,
  QueryServiceV1,
  NotificationServiceV2,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
  ENGAGEMENTS_MESSAGES,
} from 'client-utils';

import {
  EngagementsServiceV1,
} from 'client-services';

import { BaseTable } from 'client-shared-components';

@Component({
  selector: 'aiap-engagements-table-v1',
  templateUrl: './engagements-table-v1.html',
  styleUrls: ['./engagements-table-v1.scss'],
})
export class EngagementsTableV1 extends BaseTable implements OnInit, OnDestroy {

  static getClassName() {
    return 'EngagementsTableV1';
  }

  @Output() onShowRemovePlace = new EventEmitter<any>();
  @Output() onSearchPlace = new EventEmitter<any>();
  @Output() onClearPlace = new EventEmitter<any>();

  @ViewChild('testEngagementTemplate', { static: true }) testEngagementTemplate: TemplateRef<any>;
  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;

  skeletonState = false;

  state: any = {
    queryType: DEFAULT_TABLE.ENGAGEMENTS_V1.TYPE,
    defaultSort: DEFAULT_TABLE.ENGAGEMENTS_V1.SORT,
    search: '',
  };

  selectedRows: Array<any> = [];

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private browserService: BrowserServiceV1,
    private notificationService: NotificationServiceV2,
    private engagementsService: EngagementsServiceV1,
    private translateService: TranslateHelperServiceV1
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    const QUERY = this.queryService.query(this.state.queryType);
    this.state.search = QUERY?.filter?.search;
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('engagements_table_v1.col_id.header'),
      field: 'id'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('engagements_table_v1.col_name.header'),
      field: 'name'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('engagements_table_v1.col_assistant.header'),
      field: 'assistant'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('engagements_table_v1.col_test.header'),
      field: 'id', sortable: false
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('engagements_table_v1.col_updated.header'),
      field: 'updated.date',
      style: { width: '15%' }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('engagements_table_v1.col_created.header'),
      field: 'created.date',
      style: { width: '15%' }
    }));
    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];

    RET_VAL.push(new TableItem({
      data: item?.id
    }));
    RET_VAL.push(new TableItem({
      data: item?.name
    }));
    RET_VAL.push(new TableItem({
      data: item?.assistant.id
    }));
    RET_VAL.push(new TableItem({
      data: {
        engagementId: item?.id,
        assistantId: item?.assistant?.id,
      }, template: this.testEngagementTemplate
    }));

    RET_VAL.push(new TableItem({
      data: item,
      template: this.updatedTemplate,
    }));
    RET_VAL.push(new TableItem({
      data: item,
      template: this.createdTemplate,
    }));

    return RET_VAL;
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query) => {
        if (query) {
          defaultQuery = query;
        }
        return this.engagementsService.findManyByQuery(defaultQuery).pipe(
          catchError((error: any) => this.handleFindManyByQueryError(error))
        );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(EngagementsTableV1.getClassName(), `addFilterEventHandler`, { response });
      this.notificationService.showNotification(ENGAGEMENTS_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY);
      this.response = response;
      this.refreshTableModel();
      this.selectedRows = [];
      this.eventsService.loadingEmit(false);
    });
  }

  handleFindManyByQueryError(error: any) {
    _errorX(EngagementsTableV1.getClassName(), `handleFindManyByQueryError`, { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(ENGAGEMENTS_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'engagements.view.edit' });
    return RET_VAL;
  }

  rowSelect(selectedApplication) {
    const SELECTED_ROW_INDEX = selectedApplication.selectedRowIndex;
    const SELECTED_ROW_DATA = ramda.path(['model', '_data', SELECTED_ROW_INDEX], selectedApplication);
    this.selectedRows.push({
      rowData: SELECTED_ROW_DATA,
      rowIndex: SELECTED_ROW_INDEX
    });
  }

  rowDeselect(deselectedApplication) {
    let filteredArray = this.selectedRows.filter(deselectedRow => { return deselectedRow.rowIndex !== deselectedApplication.deselectedRowIndex });
    this.selectedRows = filteredArray;
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    this.engagementsService.exportMany(QUERY_PARAMS);
  }

  emitRemovePlace() {
    let selectedApplicationsIds = [];
    const TABLE_ITEMS = ramda.path(['items'], this.response);
    for (const selectedItem of this.selectedRows) {
      const SELECTED_APP_INDEX = ramda.path(['rowIndex'], selectedItem);
      selectedApplicationsIds.push(TABLE_ITEMS[SELECTED_APP_INDEX].id);
    };
    this.onShowRemovePlace.emit(selectedApplicationsIds);
  }

  emitSearchPlace(event) {
    this.onSearchPlace.emit(event);
  }

  emitClearPlace(event) {
    this.onClearPlace.emit(event);
  }

  selectAllRows(allRows) {
    const ROWS_DATA = ramda.path(['_data'], allRows);
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

  deselectAllRows() {
    this.selectedRows = [];
  }

  isRemoveDisabled() {
    if (!lodash.isEmpty(this.selectedRows)) {
      return false;
    } else {
      return true;
    }
  }

  handleOpenEngagementChatInNewTab(data: any = undefined) {
    _debugX(EngagementsTableV1.getClassName(), 'handleOpenEngagementChatInNewTab', { data });
    const TENANT = this.sessionService.getTenant();
    const TENANT_ID = TENANT?.id;
    const TENANT_CHAT_BASE_URL = TENANT?.chatAppBaseUrl;
    if (
      !lodash.isEmpty(TENANT_CHAT_BASE_URL)
    ) {
      const ROUTE = `${TENANT_CHAT_BASE_URL}/chat-app-full-screen`;
      const QUERY_PARAMS = {
        tenantId: TENANT_ID,
        assistantId: data?.assistantId,
        engagementId: data?.engagementId,
      };
      this.browserService.openInNewTabWithParams(ROUTE, QUERY_PARAMS);
    }
  }
}
