/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, AfterViewInit, EventEmitter, Output, ViewChild, TemplateRef } from '@angular/core';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  NotificationService,
  TableHeaderItem,
  TableItem,
} from 'carbon-components-angular';

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  QueryServiceV1,
  EventsServiceV1,
  TimezoneServiceV1,
} from 'client-shared-services';

import {
  BaseTableV1,
} from 'client-shared-components';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  RuleMessagesChangesServiceV1,
} from 'client-services';

import {
  TranslateHelperServiceV1,
} from 'client-shared-services';

@Component({
  selector: 'aiap-rule-messages-changes-table-v1',
  templateUrl: './rule-messages-changes-table-v1.html',
  styleUrls: ['./rule-messages-changes-table-v1.scss'],
})
export class RuleMessagesChangesTableV1 extends BaseTableV1 implements OnInit, AfterViewInit {

  static getClassName() {
    return 'RuleMessagesChangesTableV1';
  }

  @ViewChild('dateColumnTemplate', { static: true }) dateColumnTemplate: TemplateRef<any>;

  @Output() onShowExportPlace = new EventEmitter<any>();
  @Output() onSearchPlace = new EventEmitter<any>();
  @Output() onClearPlace = new EventEmitter<any>();

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  skeletonState: boolean = false;

  _state: any = {
    search: '',
    query: {
      type: DEFAULT_TABLE.RULE_MESSAGES_CHANGES_V1.TYPE,
      sort: DEFAULT_TABLE.RULE_MESSAGES_CHANGES_V1.SORT,
    }
  }
  state = lodash.cloneDeep(this._state);

  constructor(
    // params-super
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    // params-native
    private notificationService: NotificationService,
    private timezoneService: TimezoneServiceV1,
    private ruleMessagesChangesService: RuleMessagesChangesServiceV1,
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

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state?.query?.type);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap(query => {
        if (query) {
          defaultQuery = query;
        }
        return this.ruleMessagesChangesService.findManyByQuery(defaultQuery).pipe(
          catchError((error) => this.handleFindAnswersByQueryError(error))
        );
      }
      ),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugW(RuleMessagesChangesTableV1.getClassName(), `addFilterEventHandler`,
        {
          response
        });

      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
    });
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('view_rule_messages_changes_v1.changes_table_v1.transaction_id_header'),
      field: 'id', style: { "width": "25%" }
    })
    );
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('view_rule_messages_changes_v1.changes_table_v1.document_id_header'),
      field: 'docExtId', style: { "width": "25%" }
    })
    );
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('view_rule_messages_changes_v1.changes_table_v1.document_type_header'),
      field: 'docType', style: { "width": "15%" }
    })
    );
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('view_rule_messages_changes_v1.changes_table_v1.action_header'),
      field: 'action', style: { "width": "20%" }
    })
    );
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('view_rule_messages_changes_v1.changes_table_v1.changed_header'),
      field: 'timestamp', style: { "width": "15%" }
    })
    );

    this.model.header = TABLE_HEADER
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
      title: this.translateService.instant('rule_messages_changes_v1.table_v1.notification.error.title'),
      target: ".notification-container",
      duration: 10000
    }
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }

  emitSearchPlace(event) {
    this.onSearchPlace.emit(event);
  }

  emitClearPlace(event) {
    this.onClearPlace.emit(event)
  }

  emitShowExportPlace() {
    this.onShowExportPlace.emit({});
  }

}
