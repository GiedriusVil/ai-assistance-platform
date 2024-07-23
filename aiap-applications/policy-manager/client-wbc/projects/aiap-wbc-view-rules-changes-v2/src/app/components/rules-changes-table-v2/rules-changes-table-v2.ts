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
  _errorW,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  QueryServiceV1,
  TimezoneServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseTable,
} from 'client-shared-components';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  DataExportServiceV1,
  RulesChangesServiceV2,
} from 'client-services';

import {
  RULES_CHANGES_MESSAGES_V2,
} from '../../messages';

@Component({
  selector: 'aiap-wbc-rules-changes-table-v2',
  templateUrl: './rules-changes-table-v2.html',
  styleUrls: ['./rules-changes-table-v2.scss'],
})
export class RulesChangesTableV2 extends BaseTable implements OnInit, AfterViewInit {

  static getClassName() {
    return 'RulesChangesTableV2';
  }

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  skeletonState: boolean = false;

  state: any = {
    queryType: DEFAULT_TABLE.RULES_CHANGES_V2.TYPE,
    defaultSort: DEFAULT_TABLE.RULES_CHANGES_V2.SORT,
  };

  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationService,
    private timezoneService: TimezoneServiceV1,
    private RulesChangesServiceV2: RulesChangesServiceV2,
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
        return this.RulesChangesServiceV2.findManyByQuery(defaultQuery).pipe(
          catchError((error) => this.handleFindManyByQueryError(error))
        );
      }
      ),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugW(RulesChangesTableV2.getClassName(), this.addFilterEventHandler.name, { response });
      this.response = response;
      this.refreshTableModel();
      this.notificationService.showNotification(RULES_CHANGES_MESSAGES_V2.SUCCESS.FIND_MANY_BY_QUERY);
      this.eventsService.loadingEmit(false);
    });
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(
      new TableHeaderItem({
        data: this.translateService.instant('view_rules_changes_v2.table_v2.id_header'),
        field: 'id',
        style: {
          width: "20%",
        },
      })
    );

    TABLE_HEADER.push(
      new TableHeaderItem({
        data: this.translateService.instant('view_rules_changes_v2.table_v2.type_header'),
        field: 'docType',
        style: {
          width: "10%",
        },
      })
    );

    TABLE_HEADER.push(
      new TableHeaderItem({
        data: this.translateService.instant('view_rules_changes_v2.table_v2.action_header'),
        field: 'action',
        style: {
          width: "10%",
        },
      })
    );

    TABLE_HEADER.push(
      new TableHeaderItem({
        data: this.translateService.instant('view_rules_changes_v2.table_v2.user_id_header'),
        field: 'created.user.id',
        style: {
          width: "20%",
        },
      })
    );

    TABLE_HEADER.push(
      new TableHeaderItem({
        data: this.translateService.instant('view_rules_changes_v2.table_v2.rule_v2_key_header'),
        field: 'ruleKey',
        style: {
          width: "20%",
        },
      })
    );

    TABLE_HEADER.push(
      new TableHeaderItem({
        data: this.translateService.instant('view_rules_changes_v2.table_v2.timestamp_header'),
        field: 'created.date',
        style: {
          width: "20%",
        },
      })
    );

    this.model.header = TABLE_HEADER
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: item?.id }));
    RET_VAL.push(new TableItem({ data: item?.docType }));
    RET_VAL.push(new TableItem({ data: item?.action }));
    RET_VAL.push(new TableItem({ data: item?.created?.user?.id }));
    RET_VAL.push(new TableItem({ data: item?.ruleKey }));
    RET_VAL.push(new TableItem({ data: item, template: this.createdTemplate }));

    return RET_VAL;
  }

  handleFindManyByQueryError(error: any) {
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = RULES_CHANGES_MESSAGES_V2.ERROR.FIND_MANY_BY_QUERY;
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }

  export() {
    const QUERY = lodash.cloneDeep(this.queryService.query(this.state.queryType));
    QUERY.pagination.size = 999999999;

    this.RulesChangesServiceV2.findManyByQuery(QUERY).pipe(
      catchError((error) => this.handleFindManyByQueryError(error))
    ).subscribe((res: { items: any }) => {
      if (res.items) {
        this.exportAuditsToExcelAdapter(res.items);
      }
    });
  }

  private exportAuditsToExcelAdapter(data: any): void {
    const EXCEL_DATA: Array<IExcelJsonV1> = [];
    const UDT: IExcelJsonV1 = {
      data: [
        {
          id: 'ID',
          userId: 'User ID',
          ruleKey: 'Rule V2 Key',
          docType: "Type",
          action: "Action",
          timestamp: 'Timestamp'
        },
      ],
      skipHeader: true
    };
    EXCEL_DATA.push(UDT);

    if (
      data.length === 0
    ) {
      _errorW(RulesChangesTableV2.getClassName(), 'exportAuditsToExcelAdapter', { data })
      const NOTIFICATION = RULES_CHANGES_MESSAGES_V2.ERROR.EXPORT;
      this.notificationService.showNotification(NOTIFICATION);
      return;
    }

    for (const record of data) {
      UDT.data.push({
        id: record?.id,
        userId: record?.created?.user?.id,
        ruleKey: record?.ruleKey,
        docType: record?.docType,
        action: record?.action,
        timestamp: this.timezoneService.getTimeByUserTimezone(record?.created?.date)
      });
    }

    const FILE_NAME = `rules_v2_audits_${moment().format()}`;
    const SHEET_NAME = 'Rules V2 Audits';
    this.dataExportService.exportJsonToExcel(EXCEL_DATA, FILE_NAME, SHEET_NAME);
  }

}
