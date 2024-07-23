/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef, AfterViewInit, OnDestroy } from '@angular/core';
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
  AI_TRANSLATION_SERVICES_MESSAGES,
} from 'client-utils';


import {
  AiTranslationServicesServiceV1,
} from 'client-services';

import { BaseTableV1 } from 'client-shared-components';

@Component({
  selector: 'aiap-ai-translation-services-table-v1',
  templateUrl: './ai-translation-services-table-v1.html',
  styleUrls: ['./ai-translation-services-table-v1.scss'],
})
export class AiTranslationServicesTableV1 extends BaseTableV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiTranslationServicesTableV1';
  }

  @ViewChild("overflowActionsTemplate", { static: true }) overflowActionsTemplate: TemplateRef<any>;
  @ViewChild("externalTemplate", { static: true }) externalTemplate: TemplateRef<any>;
  @ViewChild("createdTemplate", { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild("updatedTemplate", { static: true }) updatedTemplate: TemplateRef<any>;

  @Output() onShowRowClickPlace = new EventEmitter<any>();

  state: any = {
    queryType: DEFAULT_TABLE.AI_TRANSLATION_SERVICES_V1.TYPE,
    defaultSort: DEFAULT_TABLE.AI_TRANSLATION_SERVICES_V1.SORT,
    search: '',
  };

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;

  constructor(
    protected sessionService: SessionServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    protected queryService: QueryServiceV1,
    public timezoneService: TimezoneServiceV1,
    private aiTranslationServicesService: AiTranslationServicesServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    const QUERY = this.queryService.query(this.state.queryType);
    if (
      QUERY?.filter?.search
    ) {
      this.state.search = QUERY?.filter?.search;
    }
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
        _debugX(AiTranslationServicesTableV1.getClassName(), `addFilterEventHandler`, { query: tmpQuery });
        return this.aiTranslationServicesService.findManyByQuery(tmpQuery).pipe(
          catchError((error) => this.handleFindOneByIdError(error))
        )
      }),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(AiTranslationServicesTableV1.getClassName(), `addFilterEventHandler`, { response });
      this.notificationService.showNotification(AI_TRANSLATION_SERVICES_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY);
      this.deselectAllRows();
      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
    });
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_translation_services_table_v1.col_name.header'),
      field: 'name',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_translation_services_table_v1.col_type.header'),
      field: 'type',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_translation_services_table_v1.col_external.header'),
      field: 'external.url',
      sortable: false,
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_translation_services_table_v1.col_created.header'),
      field: 'created.date',
      style: { 'width': '15%' },
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_translation_services_table_v1.col_updated.header'),
      field: 'updated.date',
      style: { 'width': '15%' },
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_services_table_v1.col_configurations.header'),
      sortable: false,
      // visible: ACTIONS_ALLOWED,
      style: { 'width': '5%' }
    }));

    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(item: any) {
    const RET_VAL = [];

    RET_VAL.push(new TableItem({ data: item?.name }));
    RET_VAL.push(new TableItem({ data: item.type }));
    RET_VAL.push(new TableItem({ data: item, template: this.externalTemplate }));
    RET_VAL.push(new TableItem({ data: item, template: this.createdTemplate }));
    RET_VAL.push(new TableItem({ data: item, template: this.updatedTemplate }));
    RET_VAL.push(new TableItem({ data: item, template: this.overflowActionsTemplate }));

    return RET_VAL;
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'ai-translation-services.view.edit' });
    return RET_VAL;
  }

  emitShowRowClickPlace(event: any) {
    if (!this._isActionsClickAllowed) {
      const TABLE_ITEMS = this.response?.items;
      let selectedAiTranslationModel = TABLE_ITEMS[event];
      this.onShowRowClickPlace.emit(selectedAiTranslationModel);
    }
    this._isActionsClickAllowed = false;
  }

  private handleFindOneByIdError(error: any) {
    this.eventsService.loadingEmit(false);
    _errorX(AiTranslationServicesTableV1.getClassName(), `handleFindOneByIdError`, { error });
    this.notificationService.showNotification(AI_TRANSLATION_SERVICES_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    this.aiTranslationServicesService.exportMany(QUERY_PARAMS);
  }

}
