/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, EventEmitter, Output, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import {
  TableHeaderItem,
  TableItem,
  NotificationService,
} from 'client-shared-carbon';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  QueryServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import { DEFAULT_TABLE } from 'client-utils';

import {
  TenantsServiceV1,
} from 'client-services';

import {
  BaseTable,
} from 'client-shared-components';

@Component({
  selector: 'aiap-tenants-table-v1',
  templateUrl: './tenants-table-v1.html',
  styleUrls: ['./tenants-table-v1.scss'],
})
export class TenantsTableV1 extends BaseTable implements OnInit, AfterViewInit {

  static getClassName() {
    return 'TenantsTableV1';
  }

  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() open = new EventEmitter<any>();
  @Output() addNew = new EventEmitter<any>();

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;

  state: any = {
    queryType: DEFAULT_TABLE.TENANTS.TYPE,
    defaultSort: DEFAULT_TABLE.TENANTS.SORT,
    search: '',
  };

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private tenantsService: TenantsServiceV1,
    private notificationService: NotificationService,
    private translationService: TranslateHelperServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    this.state.search = this.queryService.getSearchValue(this.state.queryType);
    super.ngOnInit();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap(query => {
        if (query) {
          defaultQuery = query;
        }
        return this.tenantsService.findManyByQuery(defaultQuery).pipe(
          catchError((error) => this.handleFindManyByQueryError(error))
        );
      }
      ),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      this.response = response;
      this.refreshTableModel();
      this.selectedRows = [];
      this.eventsService.loadingEmit(false);
    });

  }

  handleFindManyByQueryError(error) {
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: 'Unable retrieve tenants!',
      target: '.notification-container',
      duration: 10000
    }
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    const AVAILABLE_ACTIONS = ['tenants.view.edit', 'tenants.view.delete'];
    const ACTIONS_ALLOWED = this.sessionService.areActionsAllowed(AVAILABLE_ACTIONS);

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translationService.instant('tenants_table_v1.col_name.header'),
      field: 'name',
      style: {
        width: '25%',
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translationService.instant('tenants_table_v1.col_environment.header'),
      field: 'environment.id',
      style: {
        width: '5%',
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translationService.instant('tenants_table_v1.col_description.header'),
      field: 'description',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translationService.instant('tenants_table_v1.col_created.header'),
      field: 'created.date',
      style: {
        width: '15%',
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translationService.instant('tenants_table_v1.col_updated.header'),
      field: 'updated.date',
      style: {
        'width': '15%',
      }
    }));

    this.model.header = TABLE_HEADER
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({
      data: item?.name,
    }));
    RET_VAL.push(new TableItem({
      data: item?.environment?.id,
    }));
    RET_VAL.push(new TableItem({
      data: item?.description,
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

  handleEventSearchChange(event: any) {
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
    _debugX(TenantsTableV1.getClassName(), `handleEventSearchChange`,
      {
        event,
      });
  }

  handleEventSearchClear(event: any) {
    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
    _debugX(TenantsTableV1.getClassName(), `handleEventSearchClear`,
      {
        event,
      });
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'tenants.view.edit' });
    return RET_VAL;
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    const SELECTED_IDS = this.retrieveSelectedRowsIds();
    this.tenantsService.exportMany(QUERY_PARAMS, SELECTED_IDS);
  }
}
