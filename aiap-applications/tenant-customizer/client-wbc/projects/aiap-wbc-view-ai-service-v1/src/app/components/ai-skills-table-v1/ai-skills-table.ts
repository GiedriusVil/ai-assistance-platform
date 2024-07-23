/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
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
  DEFAULT_TABLE,
} from 'client-utils';

import {
  AI_SKILLS_MESSAGES,
} from '../../messages';

import {
  AiSkillsServiceV1,
} from 'client-services';

import {
  BaseTableV1,
} from 'client-shared-components';

@Component({
  selector: 'aiap-ai-skills-table-v1',
  templateUrl: './ai-skills-table.html',
  styleUrls: ['./ai-skills-table.scss'],
})
export class AiSkillsTableV1 extends BaseTableV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiSkillsTableV1';
  }

  @ViewChild('overflowActionsTemplate', { static: true }) overflowActionsTemplate: TemplateRef<any>;
  @ViewChild('skillTemplate', { static: true }) skillTemplate: TemplateRef<any>;
  
  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;
  
  @Input() config;
  @Input() aiServiceId;
  @Input() isPullConfigurationExists: boolean;

  @Output() onShowSyncByFilePlace = new EventEmitter<any>();
  @Output() onShowManageAiSkillPlace = new EventEmitter<any>();
  @Output() onFilterPanelOpenEvent = new EventEmitter<any>();

  filterIcon: string;

  state: any = {
    query: {
      type: DEFAULT_TABLE.AI_SKILLS_V1.TYPE,
      filter: {
        search: '',
      },
      sort: DEFAULT_TABLE.AI_SKILLS_V1.SORT,
    }
  };

  pullDisabled = false;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;

  constructor(
    protected sessionService: SessionServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    protected queryService: QueryServiceV1,
    private aiSkillsService: AiSkillsServiceV1,
    public timezoneService: TimezoneServiceV1,
    private translateHelperService: TranslateHelperServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state?.query?.type);
    this.queryService.setSort(this.state?.query?.type, this.state?.query?.sort);
    const QUERY = this.queryService.query(this.state?.query?.type);
    if (
      QUERY?.filter?.search
    ) {
      this.state.search = QUERY?.filter?.search;
    }
    this.filterIcon = this.config?.filterIcon;
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  addFilterEventHandler() {
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query) => {
        let tmpQuery = query;
        if (
          lodash.isEmpty(tmpQuery)
        ) {
          tmpQuery = this.queryService.query(this.state?.query?.type);
        }
        if (
          lodash.isEmpty(tmpQuery?.filter)
        ) {
          tmpQuery.filter = {};
        }
        tmpQuery.filter.aiServiceId = this.aiServiceId;
        _debugX(AiSkillsTableV1.getClassName(), `addFilterEventHandler`,
          {
            query: tmpQuery
          });
        return this.aiSkillsService.findManyByQuery(tmpQuery).pipe(
          catchError((error) => this.handleFindManyByQueryError(error))
        )
      }),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(AiSkillsTableV1.getClassName(), `addFilterEventHandler`, { response });
      this.notificationService.showNotification(AI_SKILLS_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY);
      this.handleEventAllDeselect();
      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
    });
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateHelperService.instant('ai_skills_table_v1.col_skill.header'),
      field: 'name',
    }));

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateHelperService.instant('ai_skills_table_v1.col_version.header'),
      field: 'version',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateHelperService.instant('ai_skills_table_v1.col_actions.header'),
      field: 'totals.actions',
      style: {
        width: '10%',
      },
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateHelperService.instant('ai_skills_table_v1.col_intents.header'),
      field: 'totals.intents',
      style: {
        width: '10%',
      },
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateHelperService.instant('ai_skills_table_v1.col_entities.header'),
      field: 'totals.entities',
      style: {
        width: '10%',
      },
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateHelperService.instant('ai_skills_table_v1.col_dialogNodes.header'),
      field: 'totals.dialog_nodes',
      style: {
        width: '10%',
      },
    }));
    if (this.isViewDialogTreeAllowed()) {
      TABLE_HEADER.push(new TableHeaderItem({
        data: this.translateHelperService.instant('ai_skills_table_v1.col_tree.header'),
        sortable: false,
        style: { width: '5%' },
      }));
    }
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateHelperService.instant('ai_skills_table_v1.col_updated.header'),
      field: 'updated.date',
      style: {
        width: '10%',
      },
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateHelperService.instant('ai_skills_table_v1.col_created.header'),
      field: 'created.date',
      style: {
        width: '10%',
      },
    }));
    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(value) {
    const RET_VAL = [];

    RET_VAL.push(new TableItem({
      data: value,
      template: this.skillTemplate,
    }));
    RET_VAL.push(new TableItem({
      data: value?.version,
    }));
    RET_VAL.push(new TableItem({
      data: value?.totals?.actions,
    }));
    RET_VAL.push(new TableItem({
      data: value?.totals?.intents,
    }));
    RET_VAL.push(new TableItem({
      data: value?.totals?.entities,
    }));
    RET_VAL.push(new TableItem({
      data: value?.totals?.dialog_nodes,
    }));
    if (
      this.isViewDialogTreeAllowed()
    ) {
      RET_VAL.push(new TableItem({
        data: value,
        template: this.overflowActionsTemplate,
      }));
    }
    RET_VAL.push(new TableItem({
      data: value,
      template: this.updatedTemplate,
    }));
    RET_VAL.push(new TableItem({
      data: value,
      template: this.createdTemplate,
    }));

    return RET_VAL;
  }

  isViewDialogTreeAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'ai-service.view.view-dialog-tree' });
    return RET_VAL;
  }

  isSyncByFileDisabled() {
    const RET_VAL = this.isPullConfigurationExists;
    return RET_VAL;
  }

  isSyncDisabled() {
    const RET_VAL =
      !(
        !this.isPullConfigurationExists &&
        !this.isEmptySelectedRows()
      );
    return RET_VAL;
  }

  isPullDisabled() {
    const RET_VAL =
      !(
        this.isPullConfigurationExists &&
        !this.isEmptySelectedRows()
      );
    return RET_VAL;
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }

  emitShowPullPlace(aiSkill: any) {
    _debugX(AiSkillsTableV1.getClassName(), `emitShowPullPlace`,
      {
        aiSkill
      });

    this.onShowPullPlace.emit(aiSkill);
  }

  emitShowManageAiSkillPlace(index: any) {
    _debugX(AiSkillsTableV1.getClassName(), 'emitShowManageAiSkillPlace',
      {
        index
      });

    if (
      !this._isActionsClickAllowed
    ) {
      const TABLE_ITEMS = this.response?.items;
      const VALUE = TABLE_ITEMS[index];
      this.onShowManageAiSkillPlace.emit({ value: VALUE });
    }
    this._isActionsClickAllowed = false;
  }


  emitShowSyncByFilePlaceEvent(event: any) {
    _debugX(AiSkillsTableV1.getClassName(), `emitShowSyncByFilePlaceEvent`,
      {
        event,
      });

    const EVENT = {};
    this.onShowSyncByFilePlace.emit(EVENT);
  }

  private handleFindManyByQueryError(error: any) {
    this.eventsService.loadingEmit(false);
    _errorX(AiSkillsTableV1.getClassName(), `handleFindManyByQueryError`,
      {
        error,
      });

    this.notificationService.showNotification(AI_SKILLS_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  emitFilterPanelOpen() {
    this.onFilterPanelOpenEvent.emit();
  }
}
