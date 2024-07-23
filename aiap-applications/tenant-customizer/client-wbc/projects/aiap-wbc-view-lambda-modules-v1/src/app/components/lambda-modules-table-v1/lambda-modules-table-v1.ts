/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, EventEmitter, Output, ViewChild, TemplateRef, OnDestroy, Input } from '@angular/core';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
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
  QueryServiceV1,
  NotificationServiceV2,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
  LAMBDA_MODULES_MESSAGES,
} from 'client-utils';

import {
  LambdaModulesServiceV1,
} from 'client-services';

import { BaseTableV1 } from 'client-shared-components';
import { LambdaModuleUsageModalV1 } from '../lambda-modules-usage-modal-v1/lambda-modules-usage-modal-v1';

@Component({
  selector: 'aiap-lambda-modules-table-v1',
  templateUrl: './lambda-modules-table-v1.html',
  styleUrls: ['./lambda-modules-table-v1.scss'],
})
export class LambdaModulesTableV1 extends BaseTableV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'LambdaModulesTableV1';
  }

  @Output() onShowRemovePlace = new EventEmitter<any>();
  @Output() onSearchChangeEvent = new EventEmitter<any>();
  @Output() onSearchClearEvent = new EventEmitter<any>();
  @Output() onShowPullPlace = new EventEmitter<any>();

  @ViewChild('actionsTemplate', { static: true }) actionsTemplate: TemplateRef<any>;
  @ViewChild('healthCheckIcon', { static: true }) healthCheckIcon: TemplateRef<any>;
  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;
  @ViewChild('answersAndSkillsTemplate', { static: true }) answersAndskillsTemplate: TemplateRef<any>;
  @ViewChild('lambdaModuleUsageModal', { static: true }) lambdaModuleUsageModal: LambdaModuleUsageModalV1;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  skeletonState = false;
  basePaths = true;
  missingBasePath = '';
  state = {
    queryType: DEFAULT_TABLE.LAMBDA.TYPE,
    defaultSort: DEFAULT_TABLE.LAMBDA.SORT,
    search: '',
  };

  selectedRows: Array<any> = [];

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private lambdaModulesService: LambdaModulesServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    this.checkForBasePaths();
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    super.ngOnInit();
    this.syncSearchFieldInputWithQuery();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(
      new TableHeaderItem({
        data: this.translateService.instant('lambda_modules_table_v1.col_health_check.header'),
        field: 'healthCheck',
        sortable: false,
        style: { width: '5%' },
      })
    );
    TABLE_HEADER.push(new TableHeaderItem({ data: 'ID', field: 'id' }));
    TABLE_HEADER.push(
      new TableHeaderItem({
        data: this.translateService.instant('lambda_modules_table_v1.col_type.header'),
        field: 'type',
        style: { width: '10%' },
      })
    );
    TABLE_HEADER.push(
      new TableHeaderItem({
        data: this.translateService.instant('lambda_modules_table_v1.col_updated.header'),
        field: 'updated.date',
        style: { width: '15%' },
      })
    );
    TABLE_HEADER.push(
      new TableHeaderItem({
        data: this.translateService.instant('lambda_modules_table_v1.col_created.header'),
        field: 'created.date',
        style: { width: '15%' },
      })
    );
    TABLE_HEADER.push(
      new TableHeaderItem({
        data: this.translateService.instant('lambda_modules_table_v1.col_answers_skills.header'),
        field: 'skills',
        style: { width: '10%' },
        sortable: false,
      })
    );
    TABLE_HEADER.push(
      new TableHeaderItem({
        data: this.translateService.instant('lambda_modules_table_v1.col_actions.header'),
        sortable: false,
        visible: true,
        style: { width: '2%' },
      })
    );
    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(params) {
    const ITEM = params?.item;
    const BASE_PATH_ERROR = {
      basePathError: this.missingBasePath
    };
    const HEALTH_CHECK = ramda.pathOr(BASE_PATH_ERROR, ['healthCheck'], params);
    const RET_VAL = [];

    RET_VAL.push(new TableItem({ data: HEALTH_CHECK, template: this.healthCheckIcon }));
    RET_VAL.push(new TableItem({ data: ITEM?.id }));
    RET_VAL.push(new TableItem({ data: ITEM?.type }));
    RET_VAL.push(new TableItem({ data: ITEM, template: this.updatedTemplate }));
    RET_VAL.push(new TableItem({ data: ITEM, template: this.createdTemplate }));
    RET_VAL.push(new TableItem({ data: ITEM, template: this.answersAndskillsTemplate }));
    RET_VAL.push(new TableItem({ data: ITEM, template: this.actionsTemplate }));
    return RET_VAL;
  }

  public refreshTableDataRows() {
    const TABLE_ROWS = [];
    if (
      !lodash.isEmpty(this.response.items) &&
      lodash.isArray(this.response.items)
    ) {
      for (let index = 0; index < this.response.items.length; index++) {
        const ITEM = ramda.path(['items', index], this.response);
        const HEALTH_CHECK_ITEM = ramda.path(['healthCheck', index], this.response);
        TABLE_ROWS.push(this.transformResponseItemToRow({
          item: ITEM,
          healthCheck: HEALTH_CHECK_ITEM
        }));
      }
    }
    this.model.data = TABLE_ROWS;
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query) => {
        if (query) {
          defaultQuery = query;
        }
        return this.lambdaModulesService.findManyByQuery(defaultQuery).pipe(
          catchError((error: any) => this.handleFindManyByQueryError(error))
        );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(LambdaModulesTableV1.getClassName(), `addFilterEventHandler`, { response });
      this.notificationService.showNotification(LAMBDA_MODULES_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY);
      this.deselectAllRows();
      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
    });
  }

  handleFindManyByQueryError(error: any) {
    _errorX(LambdaModulesTableV1.getClassName(), `handleFindManyByQueryError`, { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(LAMBDA_MODULES_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'lambda-modules.view.edit' });
    return RET_VAL;
  }

  emitShowPullPlace() {
    _debugX(LambdaModulesTableV1.getClassName(), `emitShowPullPlace`, {});
    this.onShowPullPlace.emit({});
  }

  isPullActionEnabled() {
    let retVal = false;
    const IS_PULL_ACTION_ALLOWED = this.sessionService.isActionAllowed({ action: 'lambda-modules.view.pull' });
    const TENANT = this.sessionService.getTenant();
    if (
      IS_PULL_ACTION_ALLOWED &&
      !lodash.isEmpty(TENANT?.pullTenant?.id)
    ) {
      retVal = true;
    }
    return retVal;
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    const SELECTED_IDS = this.retrieveSelectedRowsIds();
    this.lambdaModulesService.exportMany(QUERY_PARAMS, SELECTED_IDS);
  }

  exportOne(module: any) {
    _debugX(LambdaModulesTableV1.getClassName(), `exportOne`, { module });
    const MODULE_ID = ramda.path(['id'], module);
    this.lambdaModulesService.exportOne(MODULE_ID);
  }

  syncSearchFieldInputWithQuery() {
    const QUERY = this.queryService.query(this.state.queryType);
    if (!lodash.isEmpty(QUERY?.filter?.search)) {
      this.state.search = QUERY?.filter?.search;
    }
  }

  rowSelect(selected) {
    const SELECTED_ROW_INDEX = selected.selectedRowIndex;
    const SELECTED_ROW_DATA = ramda.path(['model', '_data', SELECTED_ROW_INDEX], selected);
    this.selectedRows.push({
      rowData: SELECTED_ROW_DATA,
      rowIndex: SELECTED_ROW_INDEX
    });
  }

  rowDeselect(deselected) {
    const filteredArray = this.selectedRows.filter(deselectedRow => { return deselectedRow.rowIndex !== deselected.deselectedRowIndex });
    this.selectedRows = filteredArray;
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

  emitRemovePlace() {
    const REMOVE_IDS = [];
    const TABLE_ITEMS = ramda.path(['items'], this.response);
    for (const selectedItem of this.selectedRows) {
      const SELECTED_APP_INDEX = ramda.path(['rowIndex'], selectedItem);
      REMOVE_IDS.push(TABLE_ITEMS[SELECTED_APP_INDEX].id);
    }
    _debugX(LambdaModulesTableV1.getClassName(), 'emitRemovePlace', { REMOVE_IDS });
    this.onShowRemovePlace.emit(REMOVE_IDS);
  }

  checkForBasePaths() {
    const SESSION = this.sessionService.getSession();
    const TENANT = ramda.path(['tenant'], SESSION);
    const SOE_BASE_URL = ramda.path(['soeBaseUrl'], TENANT);
    const CHAT_APP_BASE_URL = ramda.path(['chatAppBaseUrl'], TENANT);
    const TENANT_CUSTOMIZER_BASE_URL = ramda.path(['tenantCustomizerBaseUrl'], TENANT);
    if (
      lodash.isEmpty(SOE_BASE_URL) &&
      lodash.isEmpty(CHAT_APP_BASE_URL) &&
      lodash.isEmpty(TENANT_CUSTOMIZER_BASE_URL)
    ) {
      this.basePaths = false;
    }
    if (lodash.isEmpty(SOE_BASE_URL)) {
      this.missingBasePath = 'soeBaseUrl is not configured in Tenant!';
    } else if (lodash.isEmpty(CHAT_APP_BASE_URL)) {
      this.missingBasePath = 'chatAppBaseUrl is not configured in Tenant!';
    } else if (lodash.isEmpty(TENANT_CUSTOMIZER_BASE_URL)) {
      this.missingBasePath = 'tenantCustomizerBaseUrl is not configured in Tenant!';
    }
  }

  formatTimestamp(timestamp: string) {
    let retVal = '';
    if (
      lodash.isString(timestamp) &&
      !lodash.isEmpty(timestamp)
    ) {
      const DATE_AND_TIME = timestamp.split('T');
      if (DATE_AND_TIME.length > 0) {
        const DATE = ramda.pathOr('', [0], DATE_AND_TIME);
        const TIME = ramda.path([1], DATE_AND_TIME);
        retVal = `${retVal}${DATE}`;
        if (TIME.length >= 8) {
          const TIME_WITH_SECONDS = TIME.substring(0, 8);
          retVal = `${retVal} ${TIME_WITH_SECONDS}`;
        }
      }
    }
    return retVal;
  }

  isModuleHasSkills(lambdaModule) {
    const LAMBDA_MODULE_SKILLS = lambdaModule?.skills;
    let retVal = false;
    if (
      !lodash.isEmpty(LAMBDA_MODULE_SKILLS)) {
      retVal = true;
    }
    return retVal;
  }

  countSkillsAndAnswersByModuleType(data) {
    const SKILLS_COUNT = data?.skills?.length;
    const ANSWERS_COUNT = data?.answers?.length;
    const IS_TYPE_ACTION_TAG = this.isTypeActionTag(data);
    let retVal = 'N/A';
    if (IS_TYPE_ACTION_TAG) {
      retVal = SKILLS_COUNT + ANSWERS_COUNT;
    }
    return retVal;
  }

  isTypeActionTag(data) {
    const LAMBDA_MODULE_TYPE = data?.type;
    let retVal = false;
    if (LAMBDA_MODULE_TYPE === 'ACTION_TAG') {
      retVal = true;
    }
    return retVal;
  }

  isModuleHasAnswers(lambdaModule) {
    const LAMBDA_MODULE_ANSWERS = lambdaModule?.answers;
    let retVal = false;
    if (
      !lodash.isEmpty(LAMBDA_MODULE_ANSWERS)) {
      retVal = true;
    }
    return retVal;
  }

  emitSearchChangeEvent(event: any) {
    this.onSearchChangeEvent.emit(event);
  }

  emitSearchClearEvent() {
    this.onSearchClearEvent.emit();
  }

  onAnswerSkillButtonClick(event, data) {
    event.stopPropagation();

    this.lambdaModuleUsageModal.show(data);
  }

  getExportButtonText() {
    const TEXT = this.translateService.instant('lambda_modules_table_v1.btn_export.text');
    const TEXT_END = this.selectedRows.length > 0 ? `(${this.selectedRows.length})` : this.translateService.instant('lambda_modules_table_v1.btn_export.all');
    return `${TEXT} ${TEXT_END}`;
  }
}
