/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, AfterViewInit, EventEmitter, Output, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

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
  EventsServiceV1,
  QueryServiceV1,
  SessionServiceV1,
  TimezoneServiceV1,
  TranslateHelperServiceV1
} from 'client-shared-services';

import {
  BaseTableV1,
} from 'client-shared-components';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  DataExportServiceV1,
  OrganizationsChangesServiceV1
} from 'client-services';

@Component({
  selector: 'aiap-organizations-changes-table-v1',
  templateUrl: './organizations-changes-table-v1.html',
  styleUrls: ['./organizations-changes-table-v1.scss'],
})
export class OrganizationsChangesTableV1 extends BaseTableV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'OrganizationsChangesTableV1';
  }

  @ViewChild('dateColumnTemplate', { static: true }) dateColumnTemplate: TemplateRef<any>;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  skeletonState: boolean = false;

  state: any = {
    search: '',
    query: {
      type: DEFAULT_TABLE.ORGANIZATIONS_CHANGES_V1.TYPE,
      sort: DEFAULT_TABLE.ORGANIZATIONS_CHANGES_V1.SORT,
    }
  };

  constructor(
    // params-super
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    // params-external
    private notificationService: NotificationService,
    // params-native
    private dataExportService: DataExportServiceV1,
    private organizationsChangesService: OrganizationsChangesServiceV1,
    private translateService: TranslateHelperServiceV1,

  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state?.query?.type);
    this.queryService.setSort(this.state?.query?.type, this.state?.query?.sort);

    const QUERY = this.queryService.query(this.state?.query?.type);
    this.state.search = QUERY?.filter?.search || '';

    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state?.query?.type)
    this.eventsService.filterEmitter
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        switchMap(query => {
          if (
            query
          ) {
            defaultQuery = query;
          }
          const RET_VAL = this.organizationsChangesService.findManyByQuery(defaultQuery)
            .pipe(
              catchError((error) => this.handleFindAnswersByQueryError(error))
            );
          return RET_VAL;
        }),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugW(OrganizationsChangesTableV1.getClassName(), `addFilterEventHandler`,
          {
            response,
          });

        this.response = response;
        this.refreshTableModel();
        this.eventsService.loadingEmit(false);
      });
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('organizations.changes_table_v1.transaction_id_header'),
      field: 'id',
      style: { "width": "25%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('organizations.changes_table_v1.document_id_header'),
      field: 'docExtId',
      style: { "width": "25%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('organizations.changes_table_v1.document_type_header'),
      field: 'docType',
      style: { "width": "15%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('organizations.changes_table_v1.action_header'),
      field: 'action',
      style: { "width": "20%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('organizations.changes_table_v1.changed_header'),
      field: 'timestamp',
      style: { "width": "15%" }
    }));

    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];

    RET_VAL.push(new TableItem({ data: item?.id, raw: item }));
    RET_VAL.push(new TableItem({ data: item?.docId }));
    RET_VAL.push(new TableItem({ data: item?.docType }));
    RET_VAL.push(new TableItem({ data: item?.action }));
    RET_VAL.push(new TableItem({ data: item, template: this.dateColumnTemplate }));


    return RET_VAL;
  }

  handleFindAnswersByQueryError(error: any) {
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: "error",
      title: this.translateService.instant('organizations.changes_table_v1.notification.error.title'),
      target: ".notification-container",
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }

  export() {
    let queryCopy = JSON.parse(JSON.stringify(this.queryService.query(this.state?.query?.type)));
    queryCopy.pagination.size = 999999999;

    this.organizationsChangesService.findManyByQuery(queryCopy)
      .pipe(
        catchError((error) => this.handleFindAnswersByQueryError(error))
      ).subscribe((res: { items: any }) => {
        if (
          res.items
        ) {
          this.exportRulesChangesToExcelAdapter(res.items);
        }
      });
  }

  private exportRulesChangesToExcelAdapter(data): void {
    const EXCEL_DATA: Array<IExcelJsonV1> = [];
    const UDT: IExcelJsonV1 = {
      data: [
        {
          id: 'Transaction ID',
          docExtId: 'Document External ID',
          docType: "Document Type",
          action: "Action",
          initId: "Initiator ID",
          initName: "Initiator Name",
          timestamp: 'Timestamp'
        },
      ],
      skipHeader: true
    };
    EXCEL_DATA.push(UDT);

    if (data.length === 0) {
      const NOTIFICATION = {
        type: "warning",
        title: this.translateService.instant('organizations.changes_table_v1.notification.warning.title'),
        message: this.translateService.instant('organizations.changes_table_v1.notification.warning.message'),
        target: ".notification-container",
        duration: 3000
      };
      this.notificationService.showNotification(NOTIFICATION);
      return;
    }

    for (const row of data) {
      UDT.data.push({
        id: row.id,
        docExtId: row.docId,
        docType: row.docType,
        action: row.action,
        initId: row.context.user.id,
        initName: row.context.user.username,
        timestamp: row.timestamp
      });
    }

    const FILE_NAME = `organizations_changes_${moment().format()}`;
    const SHEET_NAME = 'Organizations Changes';
    this.dataExportService.exportJsonToExcel(EXCEL_DATA, FILE_NAME, SHEET_NAME);
  }
}
