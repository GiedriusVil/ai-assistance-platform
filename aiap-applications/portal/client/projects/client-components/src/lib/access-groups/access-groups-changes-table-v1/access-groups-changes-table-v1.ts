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
} from '@angular/core';

import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash'

import moment from 'moment';

import {
  NotificationService,
  TableHeaderItem,
  TableItem,
} from 'client-shared-carbon';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  QueryServiceV1,
  TimezoneServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseTable
} from 'client-shared-components';

import {
  DEFAULT_TABLE,
  ExcelJson,
  ACCESS_GROUPS_CHANGES_MESSAGES,
} from 'client-utils';

import {
  AccessGroupsChangesServiceV1,
  DataExportServiceV1,
} from 'client-services';



@Component({
  selector: 'aiap-access-groups-changes-table-v1',
  templateUrl: './access-groups-changes-table-v1.html',
  styleUrls: ['./access-groups-changes-table-v1.scss'],
})
export class AccessGroupsChangesTableV1 extends BaseTable implements OnInit, AfterViewInit {

  static getClassName() {
    return 'AccessGroupsChangesTableV1';
  }

  @Output() onSearchPlace = new EventEmitter<any>();
  @Output() onClearPlace = new EventEmitter<any>();

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  skeletonState = false;

  state: any = {
    queryType: DEFAULT_TABLE.ACCESS_GROUPS_CHANGES.TYPE,
    defaultSort: DEFAULT_TABLE.ACCESS_GROUPS_CHANGES.SORT
  };


  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationService,
    private timezoneService: TimezoneServiceV1,
    private accessGroupsChangesService: AccessGroupsChangesServiceV1,
    private dataExportService: DataExportServiceV1,
    private translateService: TranslateHelperServiceV1,
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
    let defaultQuery = this.queryService.query(this.state.queryType)
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap(query => {
        if (query) {
          defaultQuery = query;
        }
        return this.accessGroupsChangesService.findManyByQuery(defaultQuery).pipe(
          catchError((error) => this.handleFindManyByQueryError(error))
        );
      }
      ),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(AccessGroupsChangesTableV1.getClassName(), `addFilterEventHandler`,
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
      data: this.translateService.instant('access_groups_changes_table_v1.col_id.header'),
      field: 'id',
      style: {
        width: '20%',
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('access_groups_changes_table_v1.col_type.header'),
      field: 'docType',
      style: {
        width: '10%',
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('access_groups_changes_table_v1.col_action.header'),
      field: 'action',
      style: {
        'width': '10%',
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('access_groups_changes_table_v1.col_user_id.header'),
      field: 'created.user.id',
      style: {
        width: '20%',
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('access_groups_changes_table_v1.col_access_group_id.header'),
      field: 'docId', style: {
        width: '20%',
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('access_groups_changes_table_v1.col_timestamp.header'),
      field: 'created.date',
      style: {
        width: '20%',
      }
    }));

    this.model.header = TABLE_HEADER
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({
      data: item?.id,
    }));
    RET_VAL.push(new TableItem({
      data: item?.docType,
    }));
    RET_VAL.push(new TableItem({
      data: item?.action,
    }));
    RET_VAL.push(new TableItem({
      data: item?.created?.user?.id,
    }));
    RET_VAL.push(new TableItem({
      data: item?.docId,
    }));
    RET_VAL.push(new TableItem({
      data: this.timezoneService.getTimeByUserTimezone(item?.created?.date),
    }));

    return RET_VAL;
  }

  handleFindManyByQueryError(error: any) {
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = ACCESS_GROUPS_CHANGES_MESSAGES.ERROR.FIND_MANY_BY_QUERY;
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  emitSearchPlace(event: any) {
    this.onSearchPlace.emit(event);
  }

  emitClearPlace(event: any) {
    this.onClearPlace.emit(event)
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }

  export() {
    const QUERY = lodash.cloneDeep(this.queryService.query(this.state.queryType));
    QUERY.pagination.size = 999999999;

    this.accessGroupsChangesService.findManyByQuery(QUERY).pipe(
      catchError((error) => this.handleFindManyByQueryError(error))
    ).subscribe((res: { items: any }) => {
      if (res.items) {
        this.exportAuditsToExcelAdapter(res.items);
      }
    });
  }

  private exportAuditsToExcelAdapter(data): void {
    const EXCEL_DATA: Array<ExcelJson> = [];
    const UDT: ExcelJson = {
      data: [
        {
          id: 'ID',
          userId: 'User ID',
          externalId: 'External ID',
          type: 'Type',
          action: 'Action',
          timestamp: 'Timestamp'
        },
      ],
      skipHeader: true
    };
    EXCEL_DATA.push(UDT);

    if (data.length === 0) {
      const NOTIFICATION = ACCESS_GROUPS_CHANGES_MESSAGES.ERROR.EXPORT;
      this.notificationService.showNotification(NOTIFICATION);
      return;
    }

    for (const k in data) {
      const element = data[k];
      UDT.data.push({
        id: element.id,
        userId: element.userId,
        externalId: element.externalId,
        type: element.type,
        action: element.action,
        timestamp: element.timestamp
      });
    }

    const FILE_NAME = `audits_${moment().format()}`;
    const SHEET_NAME = 'Audits';
    this.dataExportService.exportJsonToExcel(EXCEL_DATA, FILE_NAME, SHEET_NAME);
  }

}
