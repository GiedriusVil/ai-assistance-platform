/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  TableHeaderItem,
  TableItem,
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
  FEEDBACK_SCORES,
  StripTextPipe,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  WbcLocationServiceV1,
  EventsServiceV1,
  TimezoneServiceV1,
  QueryServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';


import {
  UTTERANCES_MESSAGES,
  DEFAULT_TABLE,
} from 'client-utils';

import {
  UtteranceService,
} from 'client-services';

import {
  BaseTable,
} from 'client-shared-components';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'aca-utterances-table-v1',
  templateUrl: './utterances-table-v1.html',
  styleUrls: ['./utterances-table-v1.scss']
})
export class UtterancesTableV1 extends BaseTable implements OnInit {

  static getClassName() {
    return 'UtterancesTableV1';
  }

  @Output() onShowUtteranceIgnoreModal = new EventEmitter<any>();
  @Output() onShowUtteranceIntentModal = new EventEmitter<any>();
  @Output() onShowUtteranceAuditModal = new EventEmitter<any>();
  @Output() onShowFeedbackModal = new EventEmitter<any>();

  @Output() onSearchEvent = new EventEmitter<any>();
  @Output() onSearchClearEvent = new EventEmitter<any>();

  @ViewChild('utteranceTemplate', { static: false }) utteranceTemplate: TemplateRef<any>;
  @ViewChild('intentTemplate', { static: false }) intentTemplate: TemplateRef<any>;
  @ViewChild('entityTemplate', { static: false }) entityTemplate: TemplateRef<any>;
  @ViewChild('scoreTemplate', { static: false }) scoreTemplate: TemplateRef<any>;
  @ViewChild('feedbackTemplate', { static: false }) feedbackTemplate: TemplateRef<any>;
  @ViewChild('overflowMenuItemTemplate', { static: false }) overflowMenuItemTemplate: TemplateRef<any>;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  loading = false;
  feedbackScores = FEEDBACK_SCORES;
  state: any = {
    queryType: DEFAULT_TABLE.UTTERANCES.TYPE,
    defaultSort: DEFAULT_TABLE.UTTERANCES.SORT,
    search: '',
  };

  constructor(
    protected eventsService: EventsServiceV1,
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    private utteranceService: UtteranceService,
    private notificationService: NotificationService,
    private timezoneService: TimezoneServiceV1,
    private stripTextPipe: StripTextPipe,
    private decimalPipe: DecimalPipe,
    private wbcLocationService: WbcLocationServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit(): void {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    this.setSearch();
    super.ngOnInit();
  }

  setSearch() {
    const QUERY = this.queryService.query(this.state.queryType);
    this.state.search = QUERY?.filter?.search || '';
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => {
        this.eventsService.loadingEmit(true);
        this.loading = true;
      }),
      switchMap((query) => {
        _debugX(UtterancesTableV1.getClassName(), 'addFilterEventHandler', { query });

        if (query) {
          defaultQuery = query;
        }
        return this.utteranceService.findManyByQuery(defaultQuery).pipe(
          catchError((error) => this.handleGetDataError(error))
        )
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(UtterancesTableV1.getClassName(), `addFilterEventHandler`, { response });
      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
      this.loading = false;
    });
  }

  handleGetDataError(error: any) {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(UTTERANCES_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    this.loading = false;
    return of()
  }

  constructTableHeader(): void {
    const ACTIONS_ALLOWED = this.areActionsAllowed();
    const TABLE_HEADER = [
      new TableHeaderItem({
        data: this.translateService.instant('utterances_table_v1.col_utterance.header'),
        field: 'timestamp',
        style: {
          width: '30%'
        }
      }),
      new TableHeaderItem({
        data: this.translateService.instant('utterances_table_v1.col_assistant_id.header'),
        field: 'assistantId',
        style: {
          width: '10%'
        }
      }),
      new TableHeaderItem({
        data: this.translateService.instant('utterances_table_v1.col_intent.header'),
        field: 'topIntentScore',
        style: {
          width: '20%'
        }
      }),
      new TableHeaderItem({
        data: this.translateService.instant('utterances_table_v1.col_entity.header'),
        sortable: false,
        field: 'entity',
        style: {
          width: '20%'
        }
      }),
      new TableHeaderItem({
        data: this.translateService.instant('utterances_table_v1.col_score.header'),
        sortable: false,
        field: 'score',
        style: {
          width: '5%'
        }
      }),
      new TableHeaderItem({
        data: this.translateService.instant('utterances_table_v1.col_feedback.header'),
        sortable: false,
        field: 'feedback',
        style: {
          width: '5%'
        }
      }),
      new TableHeaderItem({
        data: this.translateService.instant('utterances_table_v1.col_user.header'),
        sortable: false,
        field: 'user',
        style: {
          width: '5%'
        }
      }),
      new TableHeaderItem({
        data: this.translateService.instant('utterances_table_v1.col_action.header'),
        field: 'actions',
        style: {
          width: '5%'
        },
        sortable: false,
        visible: ACTIONS_ALLOWED
      })
    ];
    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(item) {
    const UTTERANCE = {
      conversationId: item.conversationId,
      utterance: this.stripTextPipe.transform(item.utterance),
      created: this.timezoneService.getTimeByUserTimezone(item.created)
    };
    const INTENT = {
      intent: item.intent ? this.stripTextPipe.transform(`#${item.intent}`) : 'Irrelevant',
      confidence: item.confidence && this.decimalPipe.transform(item.confidence, '1.3-3'),
      skillName: item.skillName && this.stripTextPipe.transform(item.skillName)
    };
    const ENTITY = {
      entity: item.entity ? this.stripTextPipe.transform(`@${item.entity}:`) : 'No entities',
      entity_value_trigger: item?.aiServiceResponse?.external?.result?.entities?.[0]?.value,
      entity_confidence: item.entity && this.decimalPipe.transform(item.entity_value, '1.3-3'),
    };
    const SCORE = {
      score: item.feedback_score
    };
    const COMMENT = ramda.pathOr('Not provided', ['feedback_comment'], item);
    const FEEDBACK = {
      score: item.feedback_score,
      reason: item.feedback_reason,
      comment: COMMENT,
      strippedComment: this.stripTextPipe.transform(COMMENT)
    };
    const USER = item.username;
    const ASSISTANT = item.assistantId || 'Unknown';

    const RET_VAL = [
      new TableItem({ data: UTTERANCE, template: this.utteranceTemplate }),
      new TableItem({ data: ASSISTANT }),
      new TableItem({ data: INTENT, template: this.intentTemplate }),
      new TableItem({ data: ENTITY, template: this.entityTemplate }),
      new TableItem({ data: SCORE, template: this.scoreTemplate }),
      new TableItem({ data: FEEDBACK, template: this.feedbackTemplate }),
      new TableItem({ data: USER }),
      new TableItem({ data: item, template: this.overflowMenuItemTemplate }),
    ];
    return RET_VAL;
  }

  navToTranscript(data): void {
    const IS_VIEW_ALLOWED = this.sessionService.isActionAllowed({ action: 'utterances.view.view-transcript' });
    _debugX(UtterancesTableV1.getClassName(), 'navToTranscript', { IS_VIEW_ALLOWED });
    if (IS_VIEW_ALLOWED) {
      const NAVIGATION: any = {};
      let id;
      try {
        id = data?.conversationId;
        NAVIGATION.path = '(convInsights:main-view/utterances-view-v1/transcript-view-v1)';
        NAVIGATION.extras = { queryParams: { id } }
        this.wbcLocationService.navigateToPathByEnvironmentServiceV1(NAVIGATION.path, NAVIGATION.extras);
      } catch (error) {
        _errorX(UtterancesTableV1.getClassName(), 'navToTranscript', { error });
        throw error;
      }
    }
  }

  emitShowIgnoreUtteranceModal(utterance) {
    _debugX(UtterancesTableV1.getClassName(), 'emitShowIgnoreUtteranceModal', { utterance });
    this.onShowUtteranceIgnoreModal.emit(utterance);
  }

  emitShowUtteranceIntentModal(utterance) {
    _debugX(UtterancesTableV1.getClassName(), 'emitShowUtteranceIntentModal', { utterance });
    this.onShowUtteranceIntentModal.emit(utterance);
  }

  emitShowUtteranceAuditModal(utterance) {
    _debugX(UtterancesTableV1.getClassName(), 'emitShowUtteranceAuditModal', { utterance });
    this.onShowUtteranceAuditModal.emit(utterance);
  }

  emitShowFeedbackModal(utterance) {
    _debugX(UtterancesTableV1.getClassName(), 'emitShowFeedbackModal', { utterance });

    const IS_VIEW_FEEDBACK_ALLOWED = this.sessionService.isActionAllowed({ action: 'utterances.view.view-feedback' });
    if (IS_VIEW_FEEDBACK_ALLOWED) {
      this.onShowFeedbackModal.emit(utterance);
    }
  }

  emitSearchEvent(event: any) {
    this.onSearchEvent.emit(event);
  }

  emitSearchClearEvent() {
    this.onSearchClearEvent.emit();
  }

  isShowRowSavePlaceAllowed() {
    return false;
  }

  private areActionsAllowed(): boolean {
    const AVAILABLE_ACTIONS = ['utterances.view.edit', 'utterances.view.ignore', 'utterances.view.view-audit'];
    const ACTIONS_ALLOWED = this.sessionService.areActionsAllowed(AVAILABLE_ACTIONS);
    return ACTIONS_ALLOWED;
  }
}
