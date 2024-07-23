/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef, AfterViewInit, OnDestroy, Input } from '@angular/core';
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
  BaseTable,
} from 'client-shared-components';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  AiSearchAndAnalysisProjectsServiceV1,
} from 'client-services';

import {
  AI_SEARCH_AND_ANALYSIS_PROJECTS_MESSAGES,
} from '../../messages';

@Component({
  selector: 'aiap-ai-search-and-analysis-projects-table-v1',
  templateUrl: './ai-search-and-analysis-projects-table-v1.html',
  styleUrls: ['./ai-search-and-analysis-projects-table-v1.scss'],
})
export class AiSearchAndAnalysisProjectsTableV1 extends BaseTable implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiSearchAndAnalysisProjectsTableV1';
  }

  @ViewChild('overflowActionsTemplate', { static: true }) overflowActionsTemplate: TemplateRef<any>;
  @ViewChild('externalTemplate', { static: true }) externalTemplate: TemplateRef<any>;
  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  @Input() aiSearchAndAnalysisServiceId: string;

  @Output() onShowRowClickPlace = new EventEmitter<any>();

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  state: any = {
    queryType: DEFAULT_TABLE.AI_SEARCH_AND_ANALYSIS_PROJECTS_V1.TYPE,
    defaultSort: DEFAULT_TABLE.AI_SEARCH_AND_ANALYSIS_PROJECTS_V1.SORT,
    search: '',
  };

  constructor(
    protected sessionService: SessionServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    protected queryService: QueryServiceV1,
    public timezoneService: TimezoneServiceV1,
    private aiSearchAndAnalysisProjectsService: AiSearchAndAnalysisProjectsServiceV1,
    private translateService: TranslateHelperServiceV1
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
        tmpQuery.filter.aiSearchAndAnalysisServiceId = this.aiSearchAndAnalysisServiceId;
        _debugX(AiSearchAndAnalysisProjectsTableV1.getClassName(), `addFilterEventHandler`,
          {
            query: tmpQuery,
          });

        return this.aiSearchAndAnalysisProjectsService.findManyByQuery(tmpQuery).pipe(
          catchError((error) => this.handleFindOneByIdError(error))
        )
      }),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(AiSearchAndAnalysisProjectsTableV1.getClassName(), `addFilterEventHandler`,
        {
          response,
        });

      this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_PROJECTS_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY);
      this.deselectAllRows();
      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
    });
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_search_and_analysis_projects_table_v1.col_name.header'),
      field: 'name',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_search_and_analysis_projects_table_v1.col_type.header'),
      field: 'type',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_search_and_analysis_projects_table_v1.col_external.header'),
      field: 'external.url',
      sortable: false,
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_search_and_analysis_projects_table_v1.col_created.header'),
      field: 'created.date',
      style: {
        width: '15%',
      },
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_search_and_analysis_projects_table_v1.col_updated.header'),
      field: 'updated.date',
      style: {
        width: '15%',
      },
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_search_and_analysis_projects_table_v1.col_configurations.header'),
      sortable: false,
      style: {
        width: '5%',
      }
    }));

    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(item: any) {
    const RET_VAL = [];

    RET_VAL.push(new TableItem({
      data: item?.name,
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
      template: this.createdTemplate,
    }));
    RET_VAL.push(new TableItem({
      data: item,
      template: this.updatedTemplate,
    }));
    RET_VAL.push(new TableItem({
      data: item,
      template: this.overflowActionsTemplate,
    }));

    return RET_VAL;
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }

  emitShowRowClickPlace(event: any) {
    if (
      !this._isActionsClickAllowed
    ) {
      const TABLE_ITEMS = this.response?.items;
      const SELECTED_AI_SEARCH_AND_ANALYSIS_PROJECT = TABLE_ITEMS[event];
      this.onShowRowClickPlace.emit(SELECTED_AI_SEARCH_AND_ANALYSIS_PROJECT);
    }
    this._isActionsClickAllowed = false;
  }

  emitShowSearchAndAnalysisProjectsSavePlace(event: Event, value?: any): void {
    event.stopPropagation();
    _debugX(AiSearchAndAnalysisProjectsTableV1.getClassName(), `selectedAiSearchAndAnalysisProject`,
      {
        value,
      });

    this.onShowSavePlace.emit(value);
  }

  private handleFindOneByIdError(error: any) {
    this.eventsService.loadingEmit(false);
    _errorX(AiSearchAndAnalysisProjectsTableV1.getClassName(), `handleFindOneByIdError`,
      {
        error,
      });

    this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_PROJECTS_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    this.aiSearchAndAnalysisProjectsService.exportMany(QUERY_PARAMS);
  }

  synchronizeManyByQuery() {
    this.eventsService.loadingEmit(true);
    this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_PROJECTS_MESSAGES.INFO.SYNCHRONIZE_MANY_BY_QUERY);
    const QUERY = this.queryService.query(this.state.queryType);
    if (
      lodash.isEmpty(QUERY?.filter)
    ) {
      QUERY.filter = {};
    }
    QUERY.filter.aiSearchAndAnalysisServiceId = this.aiSearchAndAnalysisServiceId;
    _debugX(AiSearchAndAnalysisProjectsTableV1.getClassName(), `synchronizeManyAiSearchAndAnalysisProjects`,
      {
        query: QUERY,
      });

    this.aiSearchAndAnalysisProjectsService.synchronizeManyByQuery(QUERY).pipe(
      catchError((error) => this.handleSynchronizeManyByQueryError(error)),
    ).subscribe((response: any) => {
      _debugX(AiSearchAndAnalysisProjectsTableV1.getClassName(), `synchronizeManyAiSearchAndAnalysisProjectsResponse`,
        {
          response,
        });

      this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_PROJECTS_MESSAGES.SUCCESS.SYNCHRONIZE_MANY_BY_QUERY);
      this.deselectAllRows();
      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
    });
  }

  private handleSynchronizeManyByQueryError(error: any) {
    this.eventsService.loadingEmit(false);
    _errorX(AiSearchAndAnalysisProjectsTableV1.getClassName(), `handleSynchronizeManyByQueryError`,
      {
        error,
      });

    this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_PROJECTS_MESSAGES.ERROR.SYNCHRONIZE_MANY_BY_QUERY);
    return of();
  }
}
