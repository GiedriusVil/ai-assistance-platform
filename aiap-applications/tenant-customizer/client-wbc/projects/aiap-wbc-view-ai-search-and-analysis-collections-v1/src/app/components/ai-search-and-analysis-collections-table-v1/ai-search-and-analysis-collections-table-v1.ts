/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  OnDestroy,
  Input,
} from '@angular/core';

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
  AiSearchAndAnalysisCollectionsServiceV1,
} from 'client-services';

import {
  AI_SEARCH_AND_ANALYSIS_COLLECTIONS_MESSAGES,
} from '../../messages';

@Component({
  selector: 'aiap-ai-search-and-analysis-collections-table-v1',
  templateUrl: './ai-search-and-analysis-collections-table-v1.html',
  styleUrls: ['./ai-search-and-analysis-collections-table-v1.scss'],
})
export class AiSearchAndAnalysisCollectionsTableV1 extends BaseTable implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiSearchAndAnalysisCollectionsTableV1';
  }

  @ViewChild('overflowActionsTemplate', { static: true }) overflowActionsTemplate: TemplateRef<any>;
  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  @Input() aiSearchAndAnalysisServiceId: string;
  @Input() aiSearchAndAnalysisProjectId: string;

  @Output() onShowRowClickPlace = new EventEmitter<any>();
  @Output() onQueryManyPlace = new EventEmitter<any>();

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  state = {
    queryType: DEFAULT_TABLE.AI_SEARCH_AND_ANALYSIS_COLLECTIONS_V1.TYPE,
    defaultSort: DEFAULT_TABLE.AI_SEARCH_AND_ANALYSIS_COLLECTIONS_V1.SORT,
    search: '',
  };

  constructor(
    protected sessionService: SessionServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    protected queryService: QueryServiceV1,
    public timezoneService: TimezoneServiceV1,
    private aiSearchAndAnalysisCollectionsService: AiSearchAndAnalysisCollectionsServiceV1,
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
        tmpQuery.filter.aiSearchAndAnalysisProjectId = this.aiSearchAndAnalysisProjectId;
        _debugX(AiSearchAndAnalysisCollectionsTableV1.getClassName(), `addFilterEventHandler`,
          {
            query: tmpQuery,
          });

        return this.aiSearchAndAnalysisCollectionsService.findManyByQuery(tmpQuery).pipe(
          catchError((error) => this.handleFindOneByIdError(error))
        )
      }),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(AiSearchAndAnalysisCollectionsTableV1.getClassName(), `addFilterEventHandler`,
        {
          response,
        });

      this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_COLLECTIONS_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY);
      this.deselectAllRows();
      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
    });
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_search_and_analysis_collections_table_v1.col_name.header'),
      field: 'name',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_search_and_analysis_collections_table_v1.col_language.header'),
      field: 'language',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_search_and_analysis_collections_table_v1.col_description.header'),
      field: 'description',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_search_and_analysis_collections_table_v1.col_created.header'),
      field: 'created.date',
      style: {
        width: '15%',
      },
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_search_and_analysis_collections_table_v1.col_updated.header'),
      field: 'updated.date',
      style: {
        width: '15%',
      },
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_search_and_analysis_collections_table_v1.col_configuration.header'),
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
      data: item?.name
    }));
    RET_VAL.push(new TableItem({
      data: item.language
    }));
    RET_VAL.push(new TableItem({
      data: item?.description
    }));
    RET_VAL.push(new TableItem({
      data: item, template: this.createdTemplate
    }));
    RET_VAL.push(new TableItem({
      data: item, template: this.updatedTemplate
    }));
    RET_VAL.push(new TableItem({
      data: item, template: this.overflowActionsTemplate
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
      const SELECTED_AI_SEARCH_AND_ANALYSIS_COLLECTION = TABLE_ITEMS[event];
      this.onShowRowClickPlace.emit(SELECTED_AI_SEARCH_AND_ANALYSIS_COLLECTION);
    }
    this._isActionsClickAllowed = false;
  }

  emitShowSearchAndAnalysisCollectionSavePlace(event: Event, value?: any): void {
    event.stopPropagation();
    _debugX(AiSearchAndAnalysisCollectionsTableV1.getClassName(), `selectedAiSearchAndAnalysisCollection`,
      {
        value,
      });

    this.onShowSavePlace.emit(value);
  }

  private handleFindOneByIdError(error: any) {
    this.eventsService.loadingEmit(false);
    _errorX(AiSearchAndAnalysisCollectionsTableV1.getClassName(), `handleFindOneByIdError`,
      {
        error,
      });

    this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_COLLECTIONS_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    this.aiSearchAndAnalysisCollectionsService.exportMany(QUERY_PARAMS);
  }

  synchronizeManyByQuery() {
    this.eventsService.loadingEmit(true);
    this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_COLLECTIONS_MESSAGES.INFO.SYNCHRONIZE_MANY_BY_QUERY);
    const QUERY = this.queryService.query(this.state.queryType);
    if (
      lodash.isEmpty(QUERY?.filter)
    ) {
      QUERY.filter = {};
    }
    QUERY.filter.aiSearchAndAnalysisServiceId = this.aiSearchAndAnalysisServiceId;
    QUERY.filter.aiSearchAndAnalysisProjectId = this.aiSearchAndAnalysisProjectId;
    _debugX(AiSearchAndAnalysisCollectionsTableV1.getClassName(), `synchronizeManyAiSearchAndAnalysisCollections`,
      {
        query: QUERY,
      });

    this.aiSearchAndAnalysisCollectionsService.synchronizeManyByQuery(QUERY).pipe(
      catchError((error) => this.handleSynchronizeManyByQueryError(error)),
    ).subscribe((response: any) => {
      _debugX(AiSearchAndAnalysisCollectionsTableV1.getClassName(), `synchronizeManyAiSearchAndAnalysisCollectionsResponse`,
        {
          response,
        });

      this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_COLLECTIONS_MESSAGES.SUCCESS.SYNCHRONIZE_MANY_BY_QUERY);
      this.deselectAllRows();
      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
    });
  }

  private handleSynchronizeManyByQueryError(error: any) {
    this.eventsService.loadingEmit(false);
    _errorX(AiSearchAndAnalysisCollectionsTableV1.getClassName(), `handleSynchronizeManyByQueryError`,
      {
        error,
      });

    this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_COLLECTIONS_MESSAGES.ERROR.SYNCHRONIZE_MANY_BY_QUERY);
    return of();
  }

  emitQueryManyPlace() {
    const SELECTED_IDS = this.retrieveSelectedRowsIds();
    _debugX(AiSearchAndAnalysisCollectionsTableV1.getClassName(), `emitQueryManyPlace`,
      {
        SELECTED_IDS,
      });

    this.onQueryManyPlace.emit(SELECTED_IDS);
  }
}
