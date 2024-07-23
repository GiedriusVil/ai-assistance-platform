/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef,
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  TableHeaderItem,
  TableItem,
} from 'carbon-components-angular';

import {
  _debugX,
  StripTextPipe,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  TimezoneServiceV1,
  QueryServiceV1,
  NotificationServiceV2,
  TranslateHelperServiceV1,
  AiServicesChangeRequestServiceV1
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
  AI_SERVICES_CHANGES_MESSAGES,
} from 'client-utils';

import { BaseTableV1 } from 'client-shared-components';

@Component({
  selector: 'aiap-ai-services-changes-request-table-v1',
  templateUrl: './ai-services-changes-request-table-v1.html',
  styleUrls: ['./ai-services-changes-request-table-v1.scss'],
})
export class AiServicesChangesReqeustTableV1 extends BaseTableV1 implements OnInit, AfterViewInit {

  static getClassName() {
    return 'AiServicesChangesReqeustTableV1';
  }

  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  @Output() onSearchChangeEvent = new EventEmitter<any>();
  @Output() onSearchClearEvent = new EventEmitter<any>();

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  skeletonState = false;
  state = {
    queryType: DEFAULT_TABLE.AI_SERVICES_CHANGE_REQUEST_V1.TYPE,
    defaultSort: DEFAULT_TABLE.AI_SERVICES_CHANGE_REQUEST_V1.SORT,
    search: ''
  };
  selectedRows: Array<any> = [];

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationServiceV2,
    private timezoneService: TimezoneServiceV1,
    private aiServicesChangeRequestServiceV1: AiServicesChangeRequestServiceV1,
    private stripText: StripTextPipe,
    private translateService: TranslateHelperServiceV1
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
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
        return this.aiServicesChangeRequestServiceV1.findManyByQuery(defaultQuery).pipe(
          catchError((error) => this.handleFindManyByQueryError(error))
        );
      }
      ),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(AiServicesChangesReqeustTableV1.getClassName(), `addFilterEventHandler`,
        {
          response,
        });

      this.notificationService.showNotification(AI_SERVICES_CHANGES_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY);
      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
    });
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    const AVAILABLE_ACTIONS = ['ai-services-changes.view.actions.view'];
    const ACTIONS_ALLOWED = this.sessionService.areActionsAllowed(AVAILABLE_ACTIONS);

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_services_changes_request_table_v1.col_request_id.header'),
      field: 'id',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_services_changes_request_table_v1.col_status.header'),
      field: 'status',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_services_changes_request_table_v1.col_ai_service_name.header'),
      field: 'aiServiceName',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_services_changes_request_table_v1.col_skill_name.header'),
      field: 'skillName',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_services_changes_request_table_v1.col_updated.header'),
      field: 'updated.date',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_services_changes_request_table_v1.col_created.header'),
      field: 'created.date',
    }));

    this.model.header = TABLE_HEADER
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({
      data: item?.id,
      raw: item,
    }));
    RET_VAL.push(new TableItem({
      data: '',
    }));
    RET_VAL.push(new TableItem({
      data: item?.aiService?.name,
    }));
    RET_VAL.push(new TableItem({
      data: item?.aiService?.aiSkill?.name,
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

  handleFindManyByQueryError(error: any) {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AI_SERVICES_CHANGES_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }

  rowSelect(selected) {
    const SELECTED_ROW_INDEX = selected.selectedRowIndex;
    const SELECTED_ROW_DATA = selected?.model?._data?.[SELECTED_ROW_INDEX];
    this.selectedRows.push({
      rowData: SELECTED_ROW_DATA,
      rowIndex: SELECTED_ROW_INDEX
    });
  }

  rowDeselect(deselected) {
    const filteredArray = this.selectedRows.filter(deselectedRow => { return deselectedRow.rowIndex !== deselected.deselectedRowIndex });
    this.selectedRows = filteredArray;
  }

  selectAllRows(allRows) {
    const ROWS_DATA = allRows?._data;
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

  emitSearchChangeEvent(event: any) {
    this.onSearchChangeEvent.emit(event);
  }

  emitSearchClearEvent() {
    this.onSearchClearEvent.emit();
  }

}
