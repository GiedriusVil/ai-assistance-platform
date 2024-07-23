/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash'

import moment from 'moment';

import {
  NotificationService,
  TableHeaderItem,
  TableItem,
} from 'carbon-components-angular';

import {
  _debugW,
  IExcelJsonV1,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  QueryServiceV1,
  TimezoneServiceV1,
  TranslateHelperServiceV1
} from 'client-shared-services';

import {
  BaseTable,
} from 'client-shared-components';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  ValidationEngagementsChangesServiceV1,
  DataExportServiceV1,
} from 'client-services';


import {
  VALIDATION_ENGAGEMENTS_CHANGES_MESSAGES_V1,
} from '../../messages';

@Component({
  selector: 'aiap-wbc-validation-engagements-changes-table-v1',
  templateUrl: './validation-engagements-changes.table.html',
  styleUrls: ['./validation-engagements-changes.table.scss'],
})
export class ValidationEngagementsChangesTableV1 extends BaseTable implements OnInit, AfterViewInit {

  static getClassName() {
    return 'ValidationEngagementsChangesTableV1';
  }

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  skeletonState: boolean = false;

  _state: any = {
    query: {
      type: DEFAULT_TABLE.VALIDATION_ENGAGEMENTS_CHANGES_V1.TYPE,
      sort: DEFAULT_TABLE.VALIDATION_ENGAGEMENTS_CHANGES_V1.SORT,
    }
  }
  state = lodash.cloneDeep(this._state);

  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationService,
    private timezoneService: TimezoneServiceV1,
    private validationEngagementsChangesService: ValidationEngagementsChangesServiceV1,
    private dataExportService: DataExportServiceV1,
    private translateService: TranslateHelperServiceV1,

  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state?.query?.type);
    this.queryService.setSort(this.state?.query?.type, this.state?.query?.sort);
    super.ngOnInit();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state?.query?.type)
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query: any) => {
        if (
          query
        ) {
          defaultQuery = query;
        }
        return this.validationEngagementsChangesService.findManyByQuery(defaultQuery).pipe(
          catchError((error) => this.handleFindManyByQueryError(error))
        );
      }
      ),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugW(ValidationEngagementsChangesTableV1.getClassName(), this.addFilterEventHandler.name, { response });
      this.response = response;
      this.refreshTableModel();
      this.notificationService.showNotification(VALIDATION_ENGAGEMENTS_CHANGES_MESSAGES_V1.SUCCESS.FIND_MANY_BY_QUERY);
      this.eventsService.loadingEmit(false);
    });
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('view_validation_engagements_changes_v1.changes_table_v1.id_header'),
      field: 'id',
      style: { "width": "20%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('view_validation_engagements_changes_v1.changes_table_v1.type_header'),
      field: 'docType',
      style: { "width": "10%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('view_validation_engagements_changes_v1.changes_table_v1.action_header'),
      field: 'action',
      style: { "width": "10%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('view_validation_engagements_changes_v1.changes_table_v1.user_id_header'),
      field: 'created.user.id',
      style: { "width": "20%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('view_validation_engagements_changes_v1.changes_table_v1.validation_engagement_key_header'),
      field: 'engagementKey', style: { "width": "20%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('view_validation_engagements_changes_v1.changes_table_v1.timestamp_header'),
      field: 'created.date',
      style: { "width": "20%" }
    }));

    this.model.header = TABLE_HEADER
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: item?.id }));
    RET_VAL.push(new TableItem({ data: item?.docType }));
    RET_VAL.push(new TableItem({ data: item?.action }));
    RET_VAL.push(new TableItem({ data: item?.created?.user?.id }));
    RET_VAL.push(new TableItem({ data: item?.engagementKey }));
    RET_VAL.push(new TableItem({ data: item, template: this.createdTemplate }));

    return RET_VAL;
  }

  handleFindManyByQueryError(error: any) {
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = VALIDATION_ENGAGEMENTS_CHANGES_MESSAGES_V1.ERROR.FIND_MANY_BY_QUERY;
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }

  export() {
    const QUERY = lodash.cloneDeep(this.queryService.query(this.state?.query?.type));
    QUERY.pagination.size = 999999999;

    this.validationEngagementsChangesService.findManyByQuery(QUERY).pipe(
      catchError((error) => this.handleFindManyByQueryError(error))
    ).subscribe((res: { items: any }) => {
      if (res.items) {
        this.exportAuditsToExcelAdapter(res.items);
      }
    });
  }

  private exportAuditsToExcelAdapter(data): void {
    const EXCEL_DATA: Array<IExcelJsonV1> = [];
    const UDT: IExcelJsonV1 = {
      data: [
        {
          id: 'ID',
          userId: 'User ID',
          engagementKey: 'Engagement Key',
          docType: "Type",
          action: "Action",
          timestamp: 'Timestamp'
        },
      ],
      skipHeader: true
    };
    EXCEL_DATA.push(UDT);

    if (data.length === 0) {
      const NOTIFICATION = VALIDATION_ENGAGEMENTS_CHANGES_MESSAGES_V1.ERROR.EXPORT;
      this.notificationService.showNotification(NOTIFICATION);
      return;
    }

    for (const record of data) {
      UDT.data.push({
        id: record?.id,
        userId: record?.created?.user?.id,
        engagementKey: record?.engagementKey,
        docType: record?.docType,
        action: record?.action,
        timestamp: this.timezoneService.getTimeByUserTimezone(record?.created?.date)
      });
    }

    const FILE_NAME = `validation_engagements_audits_${moment().format()}`;
    const SHEET_NAME = 'Validation Engagements Audits';
    this.dataExportService.exportJsonToExcel(EXCEL_DATA, FILE_NAME, SHEET_NAME);
  }

}
