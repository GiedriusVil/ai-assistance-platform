/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef, AfterViewInit, OnDestroy, Input } from '@angular/core';
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
  AI_TRANSLATION_MODEL_EXAMPLES_MESSAGES,
} from 'client-utils';


import {
  AiTranslationModelExamplesServiceV1,
} from 'client-services';

import { BaseTableV1 } from 'client-shared-components';

@Component({
  selector: 'aiap-ai-translation-model-examples-table-v1',
  templateUrl: './ai-translation-model-examples-table-v1.html',
  styleUrls: ['./ai-translation-model-examples-table-v1.scss'],
})
export class AiTranslationModelExamplesTableV1 extends BaseTableV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiTranslationModelExamplesTableV1';
  }

  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  @Input() aiTranslationModelId: string;
  @Input() aiTranslationServiceId: string;
  @Output() onShowRowClickPlace = new EventEmitter<any>();
  @Output() onTrainModel = new EventEmitter<any>();
  @Output() onTestModel = new EventEmitter<any>();

  state: any = {
    queryType: DEFAULT_TABLE.AI_TRANSLATION_MODEL_EXAMPLES_V1.TYPE,
    defaultSort: DEFAULT_TABLE.AI_TRANSLATION_MODEL_EXAMPLES_V1.SORT,
    search: '',
  };

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;

  constructor(
    protected sessionService: SessionServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    protected queryService: QueryServiceV1,
    public timezoneService: TimezoneServiceV1,
    private aiTranslationModelExamplesService: AiTranslationModelExamplesServiceV1,
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

        tmpQuery.filter.aiTranslationModelId = this.aiTranslationModelId;
        tmpQuery.filter.aiTranslationServiceId = this.aiTranslationServiceId;
        _debugX(AiTranslationModelExamplesTableV1.getClassName(), `addFilterEventHandler`, { query: tmpQuery });
        return this.aiTranslationModelExamplesService.findManyByQuery(tmpQuery).pipe(
          catchError((error) => this.handleFindOneByIdError(error))
        )
      }),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(AiTranslationModelExamplesTableV1.getClassName(), `addFilterEventHandler`, { response });
      this.notificationService.showNotification(AI_TRANSLATION_MODEL_EXAMPLES_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY);
      this.deselectAllRows();
      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
    });
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_translation_model_examples_table_v1.col_source.header'),
      field: 'source',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_translation_model_examples_table_v1.col_target.header'),
      field: 'target',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_translation_model_examples_table_v1.col_created.header'),
      field: 'created.date',
      style: { 'width': '15%' }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_translation_model_examples_table_v1.col_updated.header'),
      field: 'updated.date',
      style: { 'width': '15%' }
    }));

    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(item: any) {
    const RET_VAL = [];

    RET_VAL.push(new TableItem({ data: item.source }));
    RET_VAL.push(new TableItem({ data: item.target }));
    RET_VAL.push(new TableItem({ data: item, template: this.createdTemplate }));
    RET_VAL.push(new TableItem({ data: item, template: this.updatedTemplate }));

    return RET_VAL;
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'ai-translation-model-example.view.edit' });
    return RET_VAL;
  }

  emitTrainModel(value?: any): void {
    _debugX(AiTranslationModelExamplesTableV1.getClassName(), `selectedAiTranslationModelTrain`, { value });
    this.onTrainModel.emit();
  }

  emitTestModel(value?: any): void {
    _debugX(AiTranslationModelExamplesTableV1.getClassName(), `selectedAiTranslationModelTrain`, { value });
    this.onTestModel.emit();
  }

  private handleFindOneByIdError(error: any) {
    this.eventsService.loadingEmit(false);
    _errorX(AiTranslationModelExamplesTableV1.getClassName(), `handleFindOneByIdError`, { error });
    this.notificationService.showNotification(AI_TRANSLATION_MODEL_EXAMPLES_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    QUERY_PARAMS.aiTranslationModelId = this.aiTranslationModelId;
    this.aiTranslationModelExamplesService.exportMany(QUERY_PARAMS);
  }

  isTrainDisabled() {
    if (this.response?.total > 0) {
      return false;
    }
    return true;
  }

}
