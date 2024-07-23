/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, EventEmitter, Output, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  TableHeaderItem,
  TableItem,
  OverflowMenu
} from 'carbon-components-angular';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  QueryServiceV1,
  NotificationServiceV2,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE
} from 'client-utils';

import {
  ClassificationCatalogsServiceV1,
} from 'client-services';

import {
  CLASSIFICATION_CATALOG_MESSAGES,
} from '../../messages';

import { BaseTableV1 } from 'client-shared-components';

@Component({
  selector: 'aiap-classification-catalogs-table-v1',
  templateUrl: './classification-catalogs-table-v1.html',
  styleUrls: ['./classification-catalogs-table-v1.scss'],
})
export class ClassificationCatalogsTableV1 extends BaseTableV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'ClassificationCatalogsTable';
  }

  @ViewChild('overflowMenuItemTemplate', { static: true }) actionsTemplate: TemplateRef<OverflowMenu>;
  @ViewChild('status', { static: true }) status: TemplateRef<any>;
  @ViewChild('updated', { static: true }) updated: TemplateRef<any>;

  @Output() onSearchPlace = new EventEmitter<any>();
  @Output() onClearPlace = new EventEmitter<any>();
  @Output() onShowCategories = new EventEmitter<any>();
  @Output() onShowRemovePlace = new EventEmitter<any>();

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  skeletonState = false;

  state: any = {
    queryType: DEFAULT_TABLE.CLASSIFICATION_CATALOGS_V1.TYPE,
    defaultSort: DEFAULT_TABLE.CLASSIFICATION_CATALOGS_V1.SORT,
    search: '',
  };

  selectedRows: Array<any> = [];

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private classificationCatalogService: ClassificationCatalogsServiceV1,
    private translateService: TranslateHelperServiceV1
  ) {
    super(
      sessionService,
      queryService,
      eventsService,
    );
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    super.ngOnInit();
    this.syncSearchFieldInputWithQuery();
  }

  addFilterEventHandler() {
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap(query => {
        return this.classificationCatalogService.findAllByQuery(query).pipe(
          catchError((error) => this.handleFindManyByQueryError(error))
        );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(ClassificationCatalogsTableV1.getClassName(), `addFilterEventHandler`, { response });
      const NOTIFICATION = CLASSIFICATION_CATALOG_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY;
      this.notificationService.showNotification(NOTIFICATION);
      this.response = response;
      this.refreshTableModel();
      this.selectedRows = [];
      this.eventsService.loadingEmit(false);
    });
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('classification_catalogs_table_v1.col_id.header'),
      field: 'id',
      style: {
        width: '15%'
      }
    }));

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('classification_catalogs_table_v1.col_name.header'),
      field: 'name',
      style: {
        width: '15%'
      }
    }));

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('classification_catalogs_table_v1.col_segments.header'),
      field: 'segmentsUpdated',
      style: {
        'width': '15%'
      }
    }));

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('classification_catalogs_table_v1.col_families.header'),
      field: 'familiesUpdated',
      style: {
        'width': '15%'
      }
    }));

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('classification_catalogs_table_v1.col_classes.header'),
      field: 'classesUpdated',
      style: {
        'width': '15%'
      }
    }));

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('classification_catalogs_table_v1.col_subclasses.header'),
      field: 'subClassesUpdated',
      style: {
        'width': '15%'
      }
    }));

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('classification_catalogs_table_v1.col_updated.header'),
      field: 'updated',
      style: {
        'width': '15%'
      }
    }));

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('classification_catalogs_table_v1.col_updated_by.header'),
      field: 'updatedBy',
      style: {
        'width': '10%'
      }
    }));

    const AVAILABLE_ACTIONS = [
      'classification-catalogs.view.edit',
      'classification-catalogs.view.delete'
    ];

    const ACTIONS_ALLOWED = this.sessionService.areActionsAllowed(AVAILABLE_ACTIONS);
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('classification_catalogs_table_v1.col_actions.header'),
      field: 'actions',
      sortable: false,
      visible: ACTIONS_ALLOWED,
      style: {
        'width': '10%'
      }
    }));
    this.model.header = TABLE_HEADER
  }

  formatTimestamp(timestamp: string) {
    if (!lodash.isNil(timestamp)) {
      const DATE_AND_TIME = timestamp.split('T');
      if (DATE_AND_TIME.length > 0) {
        const DATE = ramda.pathOr('', [0], DATE_AND_TIME);
        const TIME = ramda.path([1], DATE_AND_TIME);
        if (TIME.length >= 8) {
          const TIME_WITH_SECONDS = TIME.substring(0, 8);
          return `${DATE} ${TIME_WITH_SECONDS}`;
        }
      }
    }
    return '';
  }

  transformResponseItemToRow(item: any) {
    const ROW = [];

    ROW.push(new TableItem({ data: item?.id }));
    ROW.push(new TableItem({ data: item?.name }));

    ROW.push(new TableItem({
      data: {
        status: item?.indexStatus.find(status => status?.level === 'segmentIndex')?.status || '',
        timestamp: this.formatTimestamp(item?.indexStatus.find(status => status?.level === 'segmentIndex')?.timestamp),
      },
      template: this.status,
    }));

    ROW.push(new TableItem({
      data: {
        status: item?.indexStatus.find(status => status?.level === 'familyIndex')?.status,
        timestamp: this.formatTimestamp(item?.indexStatus.find(status => status?.level === 'familyIndex')?.timestamp),
      },
      template: this.status,
    }));
    ROW.push(new TableItem({
      data: {
        status: item?.indexStatus.find(status => status?.level === 'classIndex')?.status,
        timestamp: this.formatTimestamp(item?.indexStatus.find(status => status?.level === 'classIndex')?.timestamp),
      },
      template: this.status,
    }));
    ROW.push(new TableItem({
      data: {
        status: item?.indexStatus.find(status => status?.level === 'subClassIndex')?.status,
        timestamp: this.formatTimestamp(item?.indexStatus.find(status => status?.level === 'subClassIndex')?.timestamp),
      },
      template: this.status,
    }));
    ROW.push(new TableItem({ data: this.formatTimestamp(item?.updated), template: this.updated, }));
    ROW.push(new TableItem({ data: item?.updatedBy }));
    ROW.push(new TableItem({ data: item, template: this.actionsTemplate }));

    return ROW;
  }

  handleFindManyByQueryError(error: any) {
    _errorX(ClassificationCatalogsTableV1.getClassName(), `handleFindManyByQueryError`, { error });
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = CLASSIFICATION_CATALOG_MESSAGES.ERROR.FIND_MANY_BY_QUERY;
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'classification-catalogs.view.edit' });
    return RET_VAL;
  }

  rowSelect(selectedApplication) {
    const SELECTED_ROW_INDEX = selectedApplication.selectedRowIndex;
    const SELECTED_ROW_DATA = ramda.path(['model', '_data', SELECTED_ROW_INDEX], selectedApplication);
    this.selectedRows.push({
      rowData: SELECTED_ROW_DATA,
      rowIndex: SELECTED_ROW_INDEX
    });
  }

  rowDeselect(deselectedApplication) {
    const filteredArray = this.selectedRows.filter(deselectedRow => { return deselectedRow.rowIndex !== deselectedApplication.deselectedRowIndex });
    this.selectedRows = filteredArray;
  }

  emitCatalogsRemoveEvent(event: any) {
    const selectedApplicationsIds = [];
    const TABLE_ITEMS = ramda.path(['items'], this.response);
    for (const selectedItem of this.selectedRows) {
      const SELECTED_APP_INDEX = ramda.path(['rowIndex'], selectedItem);
      selectedApplicationsIds.push(TABLE_ITEMS[SELECTED_APP_INDEX].id);
    }
    this.onShowRemovePlace.emit(selectedApplicationsIds);
  }

  syncSearchFieldInputWithQuery() {
    const QUERY = this.queryService.query(this.state.queryType);
    if (!lodash.isEmpty(QUERY?.filter?.search)) {
      this.state.search = QUERY?.filter?.search;
    }
  }

  emitSearchEvent(event: any) {
    _debugX(ClassificationCatalogsTableV1.getClassName(), 'emitSearchEvent', { event });
    this.onSearchPlace.emit(event);
  }

  emitClearSearchEvent(event: any) {
    _debugX(ClassificationCatalogsTableV1.getClassName(), 'emitClearSearchEvent', { event });
    this.onClearPlace.emit(event)
  }

  emitCategoriesViewEvent(event: any) {
    if (this._isActionsClickAllowed) {
      this._isActionsClickAllowed = false;
      return;
    }
    _debugX(ClassificationCatalogsTableV1.getClassName(), 'emitCategoriesViewEvent', { event });
    if (lodash.isNumber(event)) {
      const CATALOG = this.response?.items?.[event];
      const EVENT = CATALOG?.id;
      this.onShowCategories.emit(EVENT);
    } else {
      const EVENT = event?.id;
      this.onShowCategories.emit(EVENT);
    }
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    this.classificationCatalogService.exportMany(QUERY_PARAMS);
  }

  selectAllRows(allRows) {
    const ROWS_DATA = ramda.path(['_data'], allRows);
    ROWS_DATA.forEach((rowData, index) => {
      if (lodash.isEmpty(rowData)) {
        return
      }
      this.selectedRows.push({
        rowData: rowData,
        rowIndex: index
      });
    });
  }

  deselectAllRows() {
    this.selectedRows = [];
  }

  isRemoveDisabled() {
    if (!lodash.isEmpty(this.selectedRows)) {
      return false
    } else {
      return true
    }
  }
}
