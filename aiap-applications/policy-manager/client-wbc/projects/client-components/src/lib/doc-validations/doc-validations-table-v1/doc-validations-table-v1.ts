/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';

import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

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
  SessionServiceV1,
  QueryServiceV1,
  TimezoneServiceV1,
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
  DOC_VALIDATIONS_MESSAGES_V1,
  DocValidationsServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-doc-validations-table-v1',
  templateUrl: './doc-validations-table-v1.html',
  styleUrls: ['./doc-validations-table-v1.scss'],
})
export class DocValidationsTableV1 extends BaseTableV1 implements OnInit, AfterViewInit {

  static getClassName() {
    return 'DocValidationsTableV1';
  }

  @ViewChild("createdAndChangedTime", { static: true }) createdAndChangedTime: TemplateRef<any>;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;

  state: any = {
    search: '',
    query: {
      type: DEFAULT_TABLE.DOC_VALIDATIONS_V1.TYPE,
      sort: DEFAULT_TABLE.DOC_VALIDATIONS_V1.SORT,
    }
  };


  constructor(
    // params-super
    protected eventsService: EventsServiceV1,
    protected queryService: QueryServiceV1,
    protected sessionService: SessionServiceV1,
    // params-shared
    private notificationService: NotificationService,
    private timezoneService: TimezoneServiceV1,
    // params-native
    private clientSideDownloadService: ClientSideDownloadServiceV1,
    private docValidationsService: DocValidationsServiceV1,
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

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('doc_validations.table_v1.document_external_id_header'),
      field: 'docExtId',
      style: { "width": "25%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('doc_validations.table_v1.document_external_number_header'),
      field: 'docNumber',
      style: { "width": "10%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('doc_validations.table_v1.action_header'),
      field: 'action',
      style: { "width": "10%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('doc_validations.table_v1.document_type_header'),
      field: 'docType',
      style: { "width": "15%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('doc_validations.table_v1.organization_header'),
      field: 'context.user.session.organization.name',
      style: { "width": "20%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('doc_validations.table_v1.created_header'),
      field: 'created.date',
      style: { "width": "20%" }
    }));

    this.model.header = TABLE_HEADER
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: item?.docExtId }));
    RET_VAL.push(new TableItem({ data: item?.docNumber }));
    RET_VAL.push(new TableItem({ data: item?.action }));
    RET_VAL.push(new TableItem({ data: item?.docType }));
    RET_VAL.push(new TableItem({ data: item?.context?.user?.session?.organization?.name }));
    RET_VAL.push(new TableItem({
      data: {
        user: item?.created?.user?.name,
        date: item?.created?.date || item?.timestamp
      },
      template: this.createdAndChangedTime
    }));
    return RET_VAL;
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state?.query?.type);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap(query => {
        if (query) {
          defaultQuery = query;
        }
        return this.docValidationsService.findManyByQuery(defaultQuery)
          .pipe(
            catchError((error) => this.handleFindManyByQueryError(error))
          );
      }
      ),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(DocValidationsTableV1.getClassName(), `addFilterEventHandler`,
        {
          response
        });

      const NOTIFICATION = DOC_VALIDATIONS_MESSAGES_V1
        .SUCCESS
        .FIND_MANY_BY_QUERY();

      this.notificationService.showNotification(NOTIFICATION);
      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
    });
  }

  handleSearchChangeEvent(event: any) {
    _debugX(DocValidationsTableV1.getClassName(), `handleSearchChangeEvent`,
      {
        event
      });

    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleSearchClearEvent(event: any) {
    _debugX(DocValidationsTableV1.getClassName(), `handleSearchClearEvent`,
      {
        event
      });

    this.queryService.deleteFilterItems(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  isShowRowSavePlaceAllowed() {
    return true;
  }

  generateReport() {
    this.docValidationsService.report(this.queryService.query(this.state?.query?.type))
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleGenerateReportError(error)),
        takeUntil(this._destroyed$)
      ).subscribe((data) => {
        this.clientSideDownloadService.openSaveFileDialog(data, 'doc-validation-transactions_' + new Date() + '.xlsx', undefined);
        const NOTIFICATION = DOC_VALIDATIONS_MESSAGES_V1
          .SUCCESS
          .EXPORT_MANY();

        this.notificationService.showNotification(NOTIFICATION);
        this.eventsService.loadingEmit(false);
      });
  }

  private handleFindManyByQueryError(error: any) {
    _debugX(DocValidationsTableV1.getClassName(), `handleFindManyByQueryError`,
      {
        error
      });

    const NOTIFICATION = DOC_VALIDATIONS_MESSAGES_V1
      .ERROR
      .FIND_MANY_BY_QUERY();

    this.notificationService.showNotification(NOTIFICATION);
    this.eventsService.loadingEmit(false);
    return of();
  }

  private handleGenerateReportError(error: any) {
    _debugX(DocValidationsTableV1.getClassName(), `handleGenerateReportError`,
      {
        error
      });

    const NOTIFICATION = DOC_VALIDATIONS_MESSAGES_V1
      .ERROR
      .GENERATE_REPORT();

    this.notificationService.showNotification(NOTIFICATION);
    this.eventsService.loadingEmit(false);
    return of();
  }
}
