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
import { of, map } from 'rxjs';

import * as lodash from 'lodash';

import {
  TableHeaderItem,
  TableItem,
} from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
  TABLE_SORT_DIRECTION,
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
  AiSearchAndAnalysisDocumentsServiceV1,
} from 'client-services';

import {
  AI_SEARCH_AND_ANALYSIS_DOCUMENTS_MESSAGES,
} from '../../messages';

@Component({
  selector: 'aiap-ai-search-and-analysis-documents-table-v1',
  templateUrl: './ai-search-and-analysis-documents-table-v1.html',
  styleUrls: ['./ai-search-and-analysis-documents-table-v1.scss'],
})
export class AiSearchAndAnalysisDocumentsTableV1 extends BaseTable implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiSearchAndAnalysisDocumentsTableV1';
  }

  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  @Input() aiSearchAndAnalysisServiceId: string;
  @Input() aiSearchAndAnalysisProjectId: string;
  @Input() aiSearchAndAnalysisCollectionId: string;

  @Output() onShowRowClickPlace = new EventEmitter<any>();

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  state = {
    queryType: DEFAULT_TABLE.AI_SEARCH_AND_ANALYSIS_DOCUMENTS_V1.TYPE,
    defaultSort: DEFAULT_TABLE.AI_SEARCH_AND_ANALYSIS_DOCUMENTS_V1.SORT,
    search: '',
  };

  private isSortEvent = false;
  private isSelectPageEvent = false;

  private rawResponse: any = {
    items: [],
    total: 0,
  };

  constructor(
    protected sessionService: SessionServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    protected queryService: QueryServiceV1,
    public timezoneService: TimezoneServiceV1,
    private aiSearchAndAnalysisDocumentsService: AiSearchAndAnalysisDocumentsServiceV1,
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
    //
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
        tmpQuery.filter.aiSearchAndAnalysisCollectionId = this.aiSearchAndAnalysisCollectionId;
        _debugX(AiSearchAndAnalysisDocumentsTableV1.getClassName(), `addFilterEventHandler`,
          {
            query: tmpQuery,
          });

        return this.handleFetchData(tmpQuery);
      }),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(AiSearchAndAnalysisDocumentsTableV1.getClassName(), `addFilterEventHandler`,
        {
          response,
        });

      this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_DOCUMENTS_MESSAGES.SUCCESS.LIST_MANY_BY_QUERY);
      this.deselectAllRows();
      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
    });
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_search_and_analysis_documents_table_v1.col_name.header'),
      field: 'name',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_search_and_analysis_documents_table_v1.col_type.header'),
      field: 'type',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_search_and_analysis_documents_table_v1.col_created.header'),
      field: 'created.date',
      style: {
        width: '15%',
      },
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_search_and_analysis_documents_table_v1.col_updated.header'),
      field: 'updated.date',
      style: {
        width: '15%',
      },
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
      template: this.createdTemplate,
    }));
    RET_VAL.push(new TableItem({
      data: item,
      template: this.updatedTemplate,
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
      const SELECTED_AI_SEARCH_AND_ANALYSIS_DOCUMENT = TABLE_ITEMS[event];
      this.onShowRowClickPlace.emit(SELECTED_AI_SEARCH_AND_ANALYSIS_DOCUMENT);
    }
    this._isActionsClickAllowed = false;
  }

  private handleFindManyByQuery(error: any) {
    this.eventsService.loadingEmit(false);
    _errorX(AiSearchAndAnalysisDocumentsTableV1.getClassName(), `handleFindManyByQuery`,
      {
        error,
      });

    this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_DOCUMENTS_MESSAGES.ERROR.LIST_MANY_BY_QUERY);
    return of();
  }

  public handleSortEvent(index: any) {
    this.isSortEvent = true;
    super.handleSortEvent(index);
  }

  public handleSelectPageEvent(page: any) {
    this.isSelectPageEvent = true;
    super.handleSelectPageEvent(page);
  }

  private handleFetchData(query) {
    if (lodash.isEmpty(query?.filter?.search)) {
      return of({
        items: [],
        total: 0,
      });
    }

    if (this.isSortEvent) {
      this.isSortEvent = false;
      const SORTED_DATA = this.sortData(this.rawResponse, query);
      const PAGINATED_DATA = this.selectPage(SORTED_DATA, query);
      return of(PAGINATED_DATA);
    }

    if (this.isSelectPageEvent) {
      this.isSelectPageEvent = false;
      const SORTED_DATA = this.sortData(this.rawResponse, query);
      const PAGINATED_DATA = this.selectPage(SORTED_DATA, query);
      return of(PAGINATED_DATA);
    }

    return this.aiSearchAndAnalysisDocumentsService.listManyByQuery(query).pipe(
      catchError((error) => this.handleFindManyByQuery(error)),
      map((response) => {
        if (lodash.isEmpty(response)) {
          return of();
        }

        this.rawResponse = response;

        const SORTED_DATA = this.sortData(this.rawResponse, query);
        const PAGINATED_DATA = this.selectPage(SORTED_DATA, query);
        return PAGINATED_DATA;
      })
    );
  }

  private sortData(data: any, query: any) {
    let field = query?.sort?.field;
    let direction = query?.sort?.direction;
    if (
      lodash.isEmpty(field)
    ) {
      field = DEFAULT_TABLE.AI_SEARCH_AND_ANALYSIS_DOCUMENTS_V1.SORT.field;
    }
    if (
      lodash.isEmpty(direction)
    ) {
      direction = DEFAULT_TABLE.AI_SEARCH_AND_ANALYSIS_DOCUMENTS_V1.SORT.direction;
    }
    _debugX(AiSearchAndAnalysisDocumentsTableV1.getClassName(), `sortData`,
      {
        field,
        direction,
      });

    const RET_VAL = lodash.cloneDeep(data);
    if (
      direction === TABLE_SORT_DIRECTION.ASC
    ) {
      RET_VAL.items.sort((a: any, b: any) => {
        if (a[field] < b[field]) {
          return -1;
        } else if (a[field] > b[field]) {
          return 1;
        } else {
          return 0;
        }
      });
    } else if (
      direction === TABLE_SORT_DIRECTION.DESC
    ) {
      RET_VAL.items.sort((a: any, b: any) => {
        if (a[field] < b[field]) {
          return 1;
        } else if (a[field] > b[field]) {
          return -1;
        } else {
          return 0;
        }
      });
    }

    return RET_VAL;
  }

  private selectPage(data: any, query: any) {
    let page = query?.pagination?.page;
    const SIZE = query?.pagination?.size;
    if (
      !lodash.isNumber(page)
    ) {
      _errorX(AiSearchAndAnalysisDocumentsTableV1.getClassName(), `selectPage. Pagination page parameter is not a number`);
      throw new Error('Pagination page parameter is not a number');
    }
    if (
      !lodash.isNumber(SIZE)
    ) {
      _errorX(AiSearchAndAnalysisDocumentsTableV1.getClassName(), `selectPage. Pagination pagination size parameter is not a number`);
      throw new Error('Pagination page parameter is not a number');
    }
    const RET_VAL = lodash.cloneDeep(data);
    page = page - 1;
    const START = page * SIZE;
    const END = page * SIZE + SIZE;
    RET_VAL.items = RET_VAL.items.slice(START, END);
    return RET_VAL;
  }

  public emitRemovePlace() {
    const SELECTED_ITEMS = [];
    const TABLE_ITEMS = this.response?.items;
    for (const selectedRow of this.selectedRows) {
      const SELECTED_APP_INDEX = selectedRow?.rowIndex;
      SELECTED_ITEMS.push(TABLE_ITEMS[SELECTED_APP_INDEX]);
    }
    _debugX(BaseTable.getClassName(), `emitRemovePlace`,
      {
        SELECTED_ITEMS,
      });
    this.onShowRemovePlace.emit(SELECTED_ITEMS);
  }


}
