/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';

import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';
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
  DOC_VALIDATIONS_MESSAGES_V2,
  DocValidationsServiceV2,
} from 'client-services';


@Component({
  selector: 'aiap-doc-validations-table-v2',
  templateUrl: './doc-validations-table-v2.html',
  styleUrls: ['./doc-validations-table-v2.scss'],
})
export class DocValidationsTableV2 extends BaseTableV1 implements OnInit, AfterViewInit {

  static getClassName() {
    return 'DocValidationsTableV2';
  }

  @ViewChild("createdAndChangedTime", { static: true }) createdAndChangedTime: TemplateRef<any>;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;

  state: any = {
    search: '',
    query: {
      type: DEFAULT_TABLE.DOC_VALIDATIONS_V2.TYPE,
      sort: DEFAULT_TABLE.DOC_VALIDATIONS_V2.SORT,
    }
  };


  constructor(
    // params-super
    protected eventsService: EventsServiceV1,
    protected queryService: QueryServiceV1,
    protected sessionService: SessionServiceV1,
    // params-native-external
    private notificationService: NotificationService,
    // params-native
    private clientSideDownloadService: ClientSideDownloadServiceV1,
    private docValidationsService: DocValidationsServiceV2,
    private utilsService: UtilsServiceV1,
    private translateService: TranslateHelperServiceV1,

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

  protected isShowRowSavePlaceAllowed(): boolean {
    const RET_VAL = true;
    return RET_VAL;
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('doc_validations.table_v2.action_id_header'),
      field: 'id'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('doc_validations.table_v2.action_header'),
      field: 'action'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('doc_validations.table_v2.document_id_header'),
      field: 'docExtId',
      style: { "width": "15%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('doc_validations.table_v2.document_type_header'),
      field: 'docType',
      style: { "width": "10%" }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('doc_validations.table_v2.created_header'),
      field: 'created.date',
      style: { "width": "20%" }
    }));
    this.model.header = TABLE_HEADER
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: item?.id, raw: item }));
    RET_VAL.push(new TableItem({ data: item?.action }));
    RET_VAL.push(new TableItem({ data: item?.docExtId }));
    RET_VAL.push(new TableItem({ data: item?.docType }));
    RET_VAL.push(new TableItem({
      data: {
        user: item?.created?.user?.name,
        date: this.utilsService.transformDateString(item?.created?.date)
      },
      template: this.createdAndChangedTime
    }));
    return RET_VAL;
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap(query => {
        if (query) {
          defaultQuery = query;
        }
        return this.docValidationsService.findManyByQuery(defaultQuery).pipe(
          catchError((error) => this.handleFindManyByQueryError(error))
        );
      }
      ),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(DocValidationsTableV2.getClassName(), `addFilterEventHandler`, { response });
      const NOTIFICATION = DOC_VALIDATIONS_MESSAGES_V2.SUCCESS.FIND_MANY_BY_QUERY();
      this.notificationService.showNotification(NOTIFICATION);
      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
    });
  }

  handleSearchChangeEvent(event: any) {
    _debugX(DocValidationsTableV2.getClassName(), `handleSearchChangeEvent`,
      {
        event
      });

    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchClearEvent(event: any) {
    _debugX(DocValidationsTableV2.getClassName(), `handleSearchClearEvent`,
      {
        event
      });

    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  isShowSavePlaceAllowed() {
    return true;
  }

  exportMany() {
    this.docValidationsService.exportMany(this.queryService.query(this.state.queryType))
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleExportManyError(error)),
        takeUntil(this._destroyed$)
      ).subscribe((data) => {
        this.clientSideDownloadService.openSaveFileDialog(data, `transactions.${moment().format('YYYY-MM-DD')}.json`, undefined);

        const NOTIFICATION = DOC_VALIDATIONS_MESSAGES_V2.SUCCESS.EXPORT_MANY();
        this.notificationService.showNotification(NOTIFICATION);
        this.eventsService.loadingEmit(false);
      });
  }

  private handleFindManyByQueryError(error: any) {
    _debugX(DocValidationsTableV2.getClassName(), `handleFindManyByQueryError`,
      {
        error
      });

    const NOTIFICATION = DOC_VALIDATIONS_MESSAGES_V2.ERROR.FIND_MANY_BY_QUERY();
    this.notificationService.showNotification(NOTIFICATION);
    this.eventsService.loadingEmit(false);
    return of();
  }

  private handleExportManyError(error: any) {
    _debugX(DocValidationsTableV2.getClassName(), `handleExportManyError`,
      {
        error
      });

    const NOTIFICATION = DOC_VALIDATIONS_MESSAGES_V2.ERROR.EXPORT_MANY();
    this.notificationService.showNotification(NOTIFICATION);
    this.eventsService.loadingEmit(false);
    return of();
  }
}
