/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, TemplateRef, ViewChild, } from '@angular/core';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  TableModel,
  TableHeaderItem,
  TableItem,
} from 'carbon-components-angular';

import {
  _debugX,
  handleSortByHeader,
  handlePageChangeEvent,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseModalV1,
} from 'client-shared-views';

import {
  ANSWERS_MESSAGES,
} from '../../messages';

import {
  AnswersServiceV1,
} from 'client-services';

import {
  AnswersCompareModalV1,
} from '../answers-compare-modal-v1/answers-compare-modal-v1';

@Component({
  selector: 'aiap-answers-rollback-modal-v1',
  templateUrl: './answers-rollback-modal-v1.html',
  styleUrls: ['./answers-rollback-modal-v1.scss'],
})
export class AnswersRollbackModalV1 extends BaseModalV1 implements OnInit {

  static getClassName() {
    return 'AnswersRollbackModalV1';
  }

  @ViewChild('dateCellTemplate', { static: true }) dateCellTemplate: TemplateRef<any>;
  @ViewChild('overflowActionsTemplate', { static: true }) overflowActionsTemplate: TemplateRef<any>;
  @ViewChild('answersCompareModal') answersCompareModal: AnswersCompareModalV1;

  model: TableModel = new TableModel();

  _isActionsClickAllowed = false;

  query: any = {
    answerStoreId: undefined,
    sort: {
      field: undefined,
      direction: undefined,
    },
    pagination: {
      page: 1,
      size: 10
    },
  }

  response: any = {
    items: [],
    total: 0
  };

  selectedAnswerStoreRelease: any;

  _answerStore: any = {
    id: undefined,
    name: undefined,
    assistant: undefined,
    pullConfiguration: undefined
  };
  answerStore: any = lodash.cloneDeep(this._answerStore);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private answersService: AnswersServiceV1,
    private translationService: TranslateHelperServiceV1
  ) {
    super();
  }

  ngOnInit() {
    this.constructTableHeaders();
    this.model.data = [];
    this.model.totalDataLength = this.response.total;
    this.model.pageLength = this.query.pagination.size;
    this.model.currentPage = this.query.pagination.page;
    this.addFilterEventHandler();
  }

  constructTableHeaders() {
    const TABLE_HEADERS = [];
    TABLE_HEADERS.push(new TableHeaderItem({
      data: this.translationService.instant('answers_view_v1.rollback_modal.table.col_versions.header'),
      field: 'created',
    }));
    TABLE_HEADERS.push(new TableHeaderItem({
      data: this.translationService.instant('answers_view_v1.rollback_modal.table.col_deployed.header'),
      field: 'deployed'
    }));
    TABLE_HEADERS.push(new TableHeaderItem({
      data: this.translationService.instant('answers_view_v1.rollback_modal.table.col_actions.header'),
      sortable: false
    }));
    this.model.header = TABLE_HEADERS;
  }

  addFilterEventHandler() {
    this.eventsService.modalFilterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap(query => {
        // for some reason this comes with undefined values
        // if (query) {
        //     this.query = query;
        // }
        return this.answersService.findAnswerStoreReleasesByQuery(this.answerStore?.id, this.query).pipe(
          catchError((error) => this.handleFindAnswerStoreReleasesByQueryError(error))
        );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(AnswersRollbackModalV1.getClassName(), 'addFilterEventHandler', { response });
      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
      this.superShow();
    });
  }

  handleFindAnswerStoreReleasesByQueryError(error: any) {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(ANSWERS_MESSAGES.ERROR.FAILED_TO_PULL_ANSWER_STORE);
    return of();
  }

  refreshTableModel() {
    const TABLE_ROWS = [];
    if (
      !lodash.isEmpty(this.response.items) &&
      lodash.isArray(this.response.items)
    ) {
      for (const ITEM of this.response.items) {
        if (
          ITEM?.id
        ) {
          const COMPARE_DATA = {
            source: {
              answers: ITEM?.versions?.deployed?.answers,
              displayName: `version ${ITEM?.deployed}`
            },
            target: {
              answerStoreId: this.answerStore?.id,
              displayName: 'current answer store'
            },
          };
          TABLE_ROWS.push([
            new TableItem({ data: ITEM?.created, template: this.dateCellTemplate }),
            new TableItem({ data: ITEM?.deployed }),
            new TableItem({ data: COMPARE_DATA, template: this.overflowActionsTemplate })
          ]);
        }
      }
    }
    this.model.data = TABLE_ROWS;
    this.model.totalDataLength = this.response.total;
    this.model.pageLength = this.query.pagination.size;
    this.model.currentPage = this.query.pagination.page;
  }

  handleRowClick(rowIndex: number) {
    if (!this._isActionsClickAllowed) {
      const IS_ROW_SELECTED = this.model.isRowSelected(rowIndex);
      this._clearSelection();
      this.model.selectRow(rowIndex, !IS_ROW_SELECTED);
      const EVENT: any = {
        model: this.model,
      }
      if (IS_ROW_SELECTED) {
        EVENT.deselectedRowIndex = rowIndex;
        this.handleRowDeSelection(EVENT);
      } else {
        EVENT.selectedRowIndex = rowIndex;
        this.handleRowSelection(EVENT);
      }
    }
    this._isActionsClickAllowed = false;
  }

  _clearSelection() {
    this.selectedAnswerStoreRelease = undefined;
    this.model.selectAll(false);
  }

  handleRowDeSelection(event: any) {
    _debugX(AnswersCompareModalV1.getClassName(), 'handleRowDeSelection', { event });
    this.selectedAnswerStoreRelease = undefined;
  }

  handleRowSelection(event: any) {
    _debugX(AnswersCompareModalV1.getClassName(), 'handleRowSelection', { event });
    if (
      event?.selectedRowIndex >= 0
    ) {
      this.selectedAnswerStoreRelease = this.response?.items[event?.selectedRowIndex];
    }
  }

  handleSortEvent(index: any) {
    this._clearSelection();
    handleSortByHeader(
      this.eventsService,
      this.model,
      this.query,
      index,
      true
    );
  }

  handlePageSelection(page: any) {
    this._clearSelection();
    handlePageChangeEvent(
      this.eventsService,
      this.model,
      this.query,
      page,
      true
    );
  }

  close() {
    super.close();
  }

  isRollbackDisabled() {
    let retVal = true;
    if (
      this.selectedAnswerStoreRelease
    ) {
      retVal = false;
    }
    return retVal;
  }

  rollback() {
    const ANSWER_STORE_ID = this.answerStore?.id;
    const ANSWER_STORE_RELEASE_ID = this.selectedAnswerStoreRelease?.id;
    _debugX(AnswersCompareModalV1.getClassName(), 'rollback', { ANSWER_STORE_RELEASE_ID });
    this.answersService.rollbackAnswerStore(ANSWER_STORE_ID, ANSWER_STORE_RELEASE_ID)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleAnswerStoreRollbackError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response) => {
        _debugX(AnswersCompareModalV1.getClassName(), 'rollback | response', { response });
        this.notificationService.showNotification(ANSWERS_MESSAGES.SUCCESS.ANSWER_STORE_ROLLED_BACK);
        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(null);
        this.close();
      });
  }

  handleAnswerStoreRollbackError(error: any) {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(ANSWERS_MESSAGES.ERROR.FAILED_TO_ROLLBACK_ANSWER_STORE);
    return of();
  }

  _allowActionsClick() {
    this._isActionsClickAllowed = true;
  }

  showCompareModal(event) {
    const PARAMS = {
      source: event?.source,
      target: event?.target,
    }
    this.answersCompareModal.show(PARAMS);
  }

  show(store: any) {
    _debugX(AnswersCompareModalV1.getClassName(), 'show', { store });
    this._clearSelection();
    if (
      store?.id
    ) {
      this.answerStore = store;
      this.query.answerStoreId = store.id;
      this.eventsService.modalFilterEmit(this.query);
    } else {
      this.notificationService.showNotification(ANSWERS_MESSAGES.ERROR.FAILED_TO_PULL_ANSWER_STORE);
    }
  }

}
