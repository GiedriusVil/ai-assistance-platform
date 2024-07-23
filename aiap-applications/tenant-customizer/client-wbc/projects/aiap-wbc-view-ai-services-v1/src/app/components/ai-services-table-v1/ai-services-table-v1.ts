/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef, AfterViewInit, OnDestroy } from '@angular/core';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

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
  EventsServiceV1,
  TimezoneServiceV1,
  QueryServiceV1,
  NotificationServiceV2,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
  AI_SERVICES_MESSAGES,
} from 'client-utils';


import {
  AiServicesServiceV1,
} from 'client-services';

import { BaseTable } from 'client-shared-components';

@Component({
  selector: 'aiap-ai-services-table-v1',
  templateUrl: './ai-services-table-v1.html',
  styleUrls: ['./ai-services-table-v1.scss'],
})
export class AiServicesTableV1 extends BaseTable implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiServicesTableV1';
  }

  @ViewChild("overflowActionsTemplate", { static: true }) overflowActionsTemplate: TemplateRef<any>;
  @ViewChild("externalTemplate", { static: true }) externalTemplate: TemplateRef<any>;
  @ViewChild("createdTemplate", { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild("updatedTemplate", { static: true }) updatedTemplate: TemplateRef<any>;

  @Output() onShowAiSkillsPlace = new EventEmitter<any>();

  state: any = {
    queryType: DEFAULT_TABLE.AI_SERVICES.TYPE,
    defaultSort: DEFAULT_TABLE.AI_SERVICES.SORT,
    search: '',
  };

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;

  constructor(
    protected sessionService: SessionServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    protected queryService: QueryServiceV1,
    public timezoneService: TimezoneServiceV1,
    private aiServicesService: AiServicesServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  addFilterEventHandler() {
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query: any) => {
        let tmpQuery: any = query;
        if (
          lodash.isEmpty(tmpQuery)
        ) {
          tmpQuery = this.queryService.query(this.state.queryType);
        }
        if (
          lodash.isEmpty(tmpQuery?.filter)
        ) {
          tmpQuery.filter = {};
        }
        tmpQuery.filter.search = this.state.search;
        _debugX(AiServicesTableV1.getClassName(), `addFilterEventHandler`, { query: tmpQuery });
        return this.aiServicesService.findManyByQuery(tmpQuery).pipe(
          catchError((error) => this.handleFindOneByIdError(error))
        )
      }),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(AiServicesTableV1.getClassName(), `addFilterEventHandler`, { response });
      this.notificationService.showNotification(AI_SERVICES_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY);
      this.deselectAllRows();
      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
    });
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    const AVAILABLE_ACTIONS =
      [
        'ai-services.view.create',
        'ai-services.view.edit',
        'ai-services.view.delete'
      ];

    const ACTIONS_ALLOWED = this.sessionService.areActionsAllowed(AVAILABLE_ACTIONS);

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_services_table_v1.col_name.header'),
      field: 'name',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_services_table_v1.col_assistant.header'),
      field: 'assistantId',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_services_table_v1.col_type.header'),
      field: 'type',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_services_table_v1.col_external.header'),
      field: 'external.id',
      sortable: false,
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_services_table_v1.col_configurations.header'),
      sortable: false,
      visible: ACTIONS_ALLOWED,
      style: {
        width: '5%'
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_services_table_v1.col_created.header'),
      field: 'created.date',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_services_table_v1.col_updated.header'),
      field: 'updated.date',
    }));
    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(item: any) {
    const RET_VAL = [];

    RET_VAL.push(new TableItem({
      data: item?.name,
    }));
    RET_VAL.push(new TableItem({
      data: item.assistantId,
    }));
    RET_VAL.push(new TableItem({
      data: item.type,
    }));
    RET_VAL.push(new TableItem({
      data: item,
      template: this.externalTemplate,
    }));
    RET_VAL.push(new TableItem({
      data: item,
      template: this.overflowActionsTemplate,
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

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'ai-services.view.edit' });
    return RET_VAL;
  }

  emitShowAiSkillsPlace(event: any) {
    if (
      !this._isActionsClickAllowed
    ) {
      const TABLE_ITEMS = this.response?.items;
      const SELECTED_AI_SKILL = TABLE_ITEMS[event];
      this.onShowAiSkillsPlace.emit(SELECTED_AI_SKILL);
    }
    this._isActionsClickAllowed = false;
  }

  handleSynchroniseClickEvent(aiService: any) {
    _debugX(AiServicesTableV1.getClassName(), `handleSynchroniseClickEvent`, { aiService });
    this.eventsService.loadingEmit(true);
    this.aiServicesService.syncOneById(aiService?.id)
      .pipe(
        catchError((error) => this.handleSyncOneByIdError(error))
      ).subscribe((response) => {
        _debugX(AiServicesTableV1.getClassName(), `handleSynchroniseClickEvent`, { response });
        this.eventsService.loadingEmit(false);
        this.notificationService.showNotification(AI_SERVICES_MESSAGES.SUCCESS.SYNC_ONE_BY_ID);
        this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
      });;
  }

  private handleSyncOneByIdError(error: any) {
    this.eventsService.loadingEmit(false);
    _errorX(AiServicesTableV1.getClassName(), `handleSyncOneByIdError`, { error });
    this.notificationService.showNotification(AI_SERVICES_MESSAGES.ERROR.SYNC_ONE_BY_ID);
    return of();
  }

  private handleFindOneByIdError(error: any) {
    this.eventsService.loadingEmit(false);
    _errorX(AiServicesTableV1.getClassName(), `handleFindOneByIdError`, { error });
    this.notificationService.showNotification(AI_SERVICES_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    this.aiServicesService.exportMany(QUERY_PARAMS);
  }

}
