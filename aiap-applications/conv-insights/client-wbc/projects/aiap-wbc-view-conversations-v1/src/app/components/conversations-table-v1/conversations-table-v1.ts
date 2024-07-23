/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnInit, ViewChild, TemplateRef, OnChanges, Output, EventEmitter } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  TableHeaderItem,
  TableItem,
} from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BrowserServiceV1,
  EventsServiceV1,
  TimezoneServiceV1,
  QueryServiceV1,
  NotificationServiceV2,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
  CONVERSATIONS_MESSAGES,
} from 'client-utils';

import {
  ConversationService,
} from 'client-services';

import {
  BaseTable,
} from 'client-shared-components';

@Component({
  selector: 'aiap-conversations-table-v1',
  templateUrl: './conversations-table-v1.html',
  styleUrls: ['./conversations-table-v1.scss'],
})
export class ConversationsTableV1 extends BaseTable implements OnInit, OnChanges {

  static getClassName() {
    return 'ConversationsTableV1';
  }

  /**
   * When getting configuration from parent, rebuild table headers.
   * Otherwise we will not see browser data
   */

  @Input()
  get config(): object { return this._config }
  set config(config: object) {
    this._config = config;
    this.filterIcon = this._config.filterIcon;
    setTimeout(() => {
      this.constructTableHeader();
    }, 0);
  }

  @Output() onSearchEvent = new EventEmitter<any>();
  @Output() onSearchClearEvent = new EventEmitter<any>();
  @Output() onFilerPanelOpenEvent = new EventEmitter<any>();

  @ViewChild('datatable', { static: true }) datatable: any;
  @ViewChild('browsericon', { static: true }) browsericon: TemplateRef<any>;
  @ViewChild('startedTime', { static: true }) startedTime: TemplateRef<any>;
  @ViewChild('endedTime', { static: true }) endedTime: TemplateRef<any>;
  @ViewChild('channelIcon', { static: true }) channelIcon: TemplateRef<any>;
  @ViewChild('userLang', { static: true }) userLang: TemplateRef<any>;
  @ViewChild('windowSize', { static: true }) windowSize: TemplateRef<any>;
  @ViewChild('clientOs', { static: true }) clientOs: TemplateRef<any>;
  @ViewChild('clientHostname', { static: true }) clientHostname: TemplateRef<any>;
  @ViewChild('hasIssues', { static: true }) hasIssues: TemplateRef<any>;
  @ViewChild('conversationId', { static: true }) conversationId: TemplateRef<any>;
  @ViewChild('userId', { static: true }) userId: TemplateRef<any>;
  @ViewChild('reviewAmount', { static: true }) reviewAmount: TemplateRef<any>;
  @ViewChild('tags', { static: true }) tags: TemplateRef<any>;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  timezone: any = null;
  isActionsClickAllowed = false;
  _config: any;
  state: any = {
    queryType: DEFAULT_TABLE.CONVERSATIONS.TYPE,
    search: '',
  };
  filterIcon: string;

  constructor(
    public timezoneService: TimezoneServiceV1,
    private browserService: BrowserServiceV1,
    private notificationService: NotificationServiceV2,
    private conversationService: ConversationService,
    protected eventsService: EventsServiceV1,
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.setSearch();
    super.ngOnInit();
  }

  ngOnChanges() {
    //
  }

  _isEmpty(data) {
    return lodash.isEmpty(data);
  }

  setSearch() {
    const QUERY = this.queryService.query(this.state.queryType);
    this.state.search = QUERY?.filter?.search || '';
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.emitterWindowEvents.subscribe((event) => {
      if (
        event?.type === EventsServiceV1.EVENT_TYPE.EVENT_WINDOW_RESIZE
      ) {
        const HEADERS: Array<any> = this.model.header;
        for (const header of HEADERS) {
          if (
            header?.isAcaBrowserData
          ) {
            header.visible = this.isBrowserDataEnabled();
          }
          if (
            header?.isAcaOptionalMdColumn
          ) {
            header.visible = this.isAcaOptionalMdEnabled();
          }
          if (
            header?.isAcaOptionalSmColumn
          ) {
            header.visible = this.isAcaOptionalSmEnabled();
          }
        }
      }
    });
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query) => {
        _debugX(ConversationsTableV1.getClassName(), `addFilterEventHandler`, { query });
        if (query) {
          defaultQuery = query;
        }
        return this.conversationService.findManyByQuery(defaultQuery).pipe(
          catchError((error: any) => this.handleFindManyByQueryError(error))
        )
      }),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(ConversationsTableV1.getClassName(), `addFilterEventHandler`, { response });
      this.eventsService.loadingEmit(false);
      this.response = response;
      this.deselectAllRows();
      this.refreshTableModel();
      this.notificationService.showNotification(CONVERSATIONS_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY);
    });
  }

  isBrowserDataEnabled() {
    const _isBrowserDataEnabled = window.innerWidth > 1479;
    const RET_VAL = _isBrowserDataEnabled && this._config?.showBrowserData;
    return RET_VAL;
  }

  isAcaOptionalMdEnabled() {
    const RET_VAL = window.innerWidth > 1052;
    return RET_VAL;
  }

  isAcaOptionalSmEnabled() {
    const RET_VAL = window.innerWidth > 629;
    return RET_VAL;
  }

  handleFindManyByQueryError(error: any) {
    _errorX(ConversationsTableV1.getClassName(), 'handleFindManyByQueryError', { error })
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(CONVERSATIONS_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  handleOpenTranscriptInNewTab(conversationId: any = undefined) {
    const ROUTE = 'main-view-wbc/conv-insights(convInsights:main-view/conversations-view-v1/transcript-view-v1)';
    const QUERY_PARAMS = {
      id: conversationId
    };
    this.browserService.openInNewTabWithParams(ROUTE, QUERY_PARAMS);
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('conversations_table_v1.col_reviews.header'),
      field: 'review',
      sortable: false,
      style: {
        'width': '2%'
      }
    }))
    TABLE_HEADER.push(new TableHeaderItem({
      data:  this.translateService.instant('conversations_table_v1.col_tags.header'),
      field: 'tags',
      sortable: false,
      style: {
        'width': '10%'
      }
    }))
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('conversations_table_v1.col_issues.header'),
      field: 'hasErrorMessages',
      style: {
        'width': '2%'
      },
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('conversations_table_v1.col_score.header'),
      field: 'score',
      style: {
        'width': '2%'
      },
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('conversations_table_v1.col_id.header'),
      field: '_id',
      style: {
        'width': '10%',
        'padding': '0'
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('conversations_table_v1.col_assistant.header'),
      field: 'assistantId',
      style: {
        'width': '10%'
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('conversations_table_v1.col_user.header'),
      field: 'userId',
      style: {
        'width': '10%'
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('conversations_table_v1.col_started.header'),
      field: 'start'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      isAcaOptionalMdColumn: true,
      data: this.translateService.instant('conversations_table_v1.col_ended.header'),
      field: 'end',
      visible: this.isAcaOptionalMdEnabled()
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      isAcaOptionalMdColumn: false,
      data: this.translateService.instant('conversations_table_v1.col_duration.header'),
      field: 'duration',
      visible: this.isAcaOptionalMdEnabled()
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      isAcaBrowserData: true,
      data: this.translateService.instant('conversations_table_v1.col_browser_window_size.header'),
      field: 'clientSideWindowSize',
      style: {
        'width': '5%'
      },
      visible: this.isBrowserDataEnabled()
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      isAcaBrowserData: true,
      data: this.translateService.instant('conversations_table_v1.col_browser_name.header'),
      field: 'clientSideBrowserName',
      style: {
        'width': '2%'
      },
      visible: this.isBrowserDataEnabled()
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      isAcaBrowserData: true,
      data: this.translateService.instant('conversations_table_v1.col_browser_language.header'),
      field: 'clientSideBrowserLanguage',
      style: {
        'width': '2%'
      },
      visible: this.isBrowserDataEnabled()
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      isAcaBrowserData: true,
      data: this.translateService.instant('conversations_table_v1.col_client_side_os.header'),
      field: 'clientSideOS',
      style: {
        'width': '2%'
      },
      visible: this.isBrowserDataEnabled()
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      isAcaBrowserData: true,
      data: this.translateService.instant('conversations_table_v1.col_hostname.header'),
      field: 'clientSideHostname',
      style: {
        'width': '10%'
      },
      visible: this.isBrowserDataEnabled()
    }));

    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(item) {
    const TAGS = item?.tags?.map(({ tags }) => tags) || [];
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: item.reviewed, template: this.reviewAmount }));
    RET_VAL.push(new TableItem({ data: TAGS, template: this.tags }));
    RET_VAL.push(new TableItem({ data: item?.hasErrorMessages, template: this.hasIssues }));
    RET_VAL.push(new TableItem({ data: item?.score }));
    RET_VAL.push(new TableItem({ data: item?.conversationId, template: this.conversationId }));
    RET_VAL.push(new TableItem({ data: item?.assistantId }));
    RET_VAL.push(new TableItem({ data: item?.userId, template: this.userId }));

    RET_VAL.push(new TableItem({ data: item?.started, template: this.startedTime }));
    RET_VAL.push(new TableItem({ data: item?.ended, template: this.endedTime }));
    RET_VAL.push(new TableItem({ data: item?.duration }));

    RET_VAL.push(new TableItem({ data: item?.clientSideWindowSize, template: this.windowSize }));
    RET_VAL.push(new TableItem({ data: item?.clientSideBrowserName, template: this.browsericon }));
    RET_VAL.push(new TableItem({ data: item?.clientSideBrowserLanguage, template: this.userLang }));
    RET_VAL.push(new TableItem({ data: item?.clientSideOS, template: this.clientOs }));
    RET_VAL.push(new TableItem({ data: item?.clientSideHostname, template: this.clientHostname }));

    return RET_VAL;
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'conversations.view.view-transcript' });
    return RET_VAL;
  }

  emitSearchEvent(event: any) {
    this.onSearchEvent.emit(event);
  }

  emitSearchClearEvent() {
    this.onSearchClearEvent.emit();
  }

  emitFilterPanelOpen() {
    this.onFilerPanelOpenEvent.emit();
  }
}
