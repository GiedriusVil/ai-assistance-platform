/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, EventEmitter, Output, Input, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';
import moment from 'moment';

import {
  TableHeaderItem,
  TableItem,
  TableModel
} from 'carbon-components-angular';

import {
  _debugX
} from 'client-shared-utils';

import {
  ActivatedRouteServiceV1,
  SessionServiceV1,
  BrowserServiceV1,
  EventsServiceV1,
  QueryServiceV1,
  NotificationServiceV2,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  ExcelJson,
  DEFAULT_TABLE,
  ExcellExportMappedData,
} from 'client-utils';

import {
  AnswersServiceV1,
  DataExportServiceV1,
} from 'client-services';

import { BaseTableV1 } from 'client-shared-components';

import { ANSWERS_MESSAGES } from '../../messages';

@Component({
  selector: 'aiap-answers-table-v1',
  templateUrl: './answers-table-v1.html',
  styleUrls: ['./answers-table-v1.scss'],
})
export class AnswersTableV1 extends BaseTableV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'AnswersTableV1';
  }

  @Input() config;

  @Output() onShowAnswerPlace = new EventEmitter<any>();
  @Output() onShowRollbackPlace = new EventEmitter<any>();
  @Output() onFilterPanelOpenEvent = new EventEmitter<any>();

  @ViewChild('languagesTemplate', { static: true }) languagesTemplate: TemplateRef<any>;
  @ViewChild('skillsTemplate', { static: true }) skillsTemplate: TemplateRef<any>;
  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  filterIcon: string;

  model: TableModel;

  answerStoreId = undefined;

  response: any = {
    items: [],
    total: 0,
  };

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  skeletonState = false;

  state: any = {
    queryType: DEFAULT_TABLE.ANSWERS.TYPE,
    defaultSort: DEFAULT_TABLE.ANSWERS.SORT,
    search: '',
  };
  selectedRows: Array<any> = [];

  private isActionsClickAllowed = false;
  isExportAllowed = false;

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private browserService: BrowserServiceV1,
    private notificationService: NotificationServiceV2,
    private answersService: AnswersServiceV1,
    private dataExportService: DataExportServiceV1,
    private activatedRoute: ActivatedRoute,
    private activatedRouteService: ActivatedRouteServiceV1,
    private translateService: TranslateHelperServiceV1
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    this.syncSearchFieldInputWithQuery();
    this.filterIcon = this.config?.filterIcon;
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  constructTableHeader() {
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    this.subscribeToQueryParams();
    const EXPORT_ACTIONS_ALLOWED = ['answers.view.export.xlsx', 'answers.view.export.json'];
    this.isExportAllowed = this.sessionService.areActionsAllowed(EXPORT_ACTIONS_ALLOWED);
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('answers_table_v1.col_key.header'),
      field: 'key'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('answers_table_v1.col_language.header'),
      field: 'values',
      style: {
        width: '20%',
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('answers_table_v1.col_updated.header'),
      field: 'updated.date',
      style: {
        width: '15%',
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('answers_table_v1.col_created.header'),
      field: 'created.date',
      style: {
        width: '15%',
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('answers_table_v1.col_skills.header'),
      field: 'skills',
      style: {
        width: '10%',
      },
      sortable: false
    }));
    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [
      new TableItem({
        data: item.key,
      }),
      new TableItem({
        data: item,
        template: this.languagesTemplate,
      }),
      new TableItem({
        data: item,
        template: this.updatedTemplate,
      }),
      new TableItem({
        data: item,
        template: this.createdTemplate,
      }),
      new TableItem({
        data: item.skills,
        template: this.skillsTemplate,
      }),
    ];
    return RET_VAL;
  }

  subscribeToQueryParams() {
    this.activatedRouteService.queryParams()
      .subscribe((params: any) => {
        _debugX(AnswersTableV1.getClassName(), 'subscribeToQueryParams', { params });
        this.answerStoreId = params.answerStoreId;
      });
  }

  _allowActionsClick(event: any) {
    this.isActionsClickAllowed = true;
  }

  _getQueryType() {
    const ANSWER_STORE_ID = ramda.pathOr('', ['queryParams', 'value', 'answerStoreId'], this.activatedRoute);
    const RET_VAL = this.state.queryType + '_' + ANSWER_STORE_ID;
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
        _debugX(AnswersTableV1.getClassName(), `addFilterEventHandler`, { this_query: defaultQuery });
        return this.answersService.findAnswersByQuery(this.answerStoreId, defaultQuery, true).pipe(
          catchError((error) => this.handleFindAnswersByQueryError(error))
        );
      }
      ),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(AnswersTableV1.getClassName(), `addFilterEventHandler`, { response });
      this.response = response;
      this.refreshTableModel();
      this.selectedRows = [];
      this.eventsService.loadingEmit(false);
    });
  }

  handleFindAnswersByQueryError(error) {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(ANSWERS_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'answers.view.edit' });
    return RET_VAL;
  }

  rowSelect(selectedAnswer) {
    const SELECTED_ROW_INDEX = selectedAnswer.selectedRowIndex;
    const SELECTED_ROW_DATA = ramda.path(['model', '_data', SELECTED_ROW_INDEX], selectedAnswer);
    this.selectedRows.push({
      rowData: SELECTED_ROW_DATA,
      rowIndex: SELECTED_ROW_INDEX
    });
  }

  rowDeselect(deselectedAnswer) {
    const filteredArray = this.selectedRows.filter(deselectedRow => { return deselectedRow.rowIndex !== deselectedAnswer.deselectedRowIndex });
    this.selectedRows = filteredArray;
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    this.answersService.exportMany(QUERY_PARAMS);
  }

  syncSearchFieldInputWithQuery() {
    const QUERY = this.queryService.query(this.state.queryType);
    if (!lodash.isEmpty(QUERY?.filter?.search)) {
      this.state.search = QUERY?.filter?.search;
    }
  }

  emitRemovePlace() {
    const selectedAnsverAnswerKeys = [];
    const TABLE_ITEMS = ramda.path(['items'], this.response);
    for (const selectedItem of this.selectedRows) {
      const SELECTED_APP_INDEX = ramda.path(['rowIndex'], selectedItem);
      selectedAnsverAnswerKeys.push(TABLE_ITEMS[SELECTED_APP_INDEX].key);
    }
    this.onShowRemovePlace.emit(selectedAnsverAnswerKeys);
  }

  emitSearchPlace(event) {
    this.onSearchPlace.emit(event);
  }

  emitClearPlace(event) {
    this.onClearPlace.emit(event);
  }

  emitShowPullPlace() {
    this.onShowPullPlace.emit();
  }

  emitShowRollbackPlace() {
    this.onShowRollbackPlace.emit();
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
      return false;
    } else {
      return true;
    }
  }

  _hasPullConfiguration() {
    let retVal = false;
    if (
      !lodash.isEmpty(this.response?.parent?.pullConfiguration)
    ) {
      retVal = true;
    }
    return retVal;
  }

  isRollbackEnabled() {
    return this._hasPullConfiguration();
  }

  isPullEnabled() {
    return this._hasPullConfiguration();
  }

  isSkillsCountPositive(answerSkills) {
    let retVal = false;
    if (answerSkills?.count > 0) {
      retVal = true;
    }
    return retVal;
  }

  export(type) {
    switch (type) {
      case 'xlsx':
        this.answersService.exportAnswers(this.answerStoreId).pipe(
          catchError((error) => this.handleFindAnswersByQueryError(error)),
          takeUntil(this._destroyed$),
        ).subscribe((response: any) => {
          this.exportAnswersToExcelAdapter(response);
        });
        break;
      case 'json':
        this.answersService.exportAnswersAsJson(this.answerStoreId);
        break;
    }
  }

  private exportAnswersToExcelAdapter(data): void {
    if (!data.length) {
      this.notificationService.showNotification(ANSWERS_MESSAGES.WARNING.EXPORT_ANSWERS);
      return;
    }

    const EXCEL_DATA: Array<ExcelJson> = [];
    const EXCEL_TABLE_DATA: ExcelJson = {
      data: [{
        key: 'key',
        language: 'language',
        value: 'value',
        label: 'label'
      }],
      skipHeader: true
    };
    EXCEL_DATA.push(EXCEL_TABLE_DATA);

    const MAPPED_DATA = this.mapAnswersData(data);

    MAPPED_DATA.forEach(({ key, language, value, label }) => {
      EXCEL_TABLE_DATA.data.push({
        key: key,
        language: language,
        value: value,
        label: label
      });
    });

    const FILE_NAME = `answerstore_${moment().format()}`;
    const SHEET_NAME = 'answers';
    this.dataExportService.exportJsonToExcel(EXCEL_DATA, FILE_NAME, SHEET_NAME);
  }

  private mapAnswersData(data): ExcellExportMappedData {
    const MAPPED_DATA = data.reduce((acc, {key, values}) => ([
      ...acc,
      ...values.map(answerValue => ({
          key: key,
          language: answerValue.language,
          value: answerValue.output?.text || answerValue.text,
          label: answerValue.output?.intent?.name || ''
      }))
    ]), [])
    return MAPPED_DATA;
  }

  emitFilterPanelOpen() {
    this.onFilterPanelOpenEvent.emit();
  }
}
