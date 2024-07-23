/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, AfterViewInit, OnDestroy, Input, ViewChild, TemplateRef, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { catchError, switchMap, takeUntil, tap, skipWhile } from 'rxjs/operators';
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
  AI_SKILL_RELEASES_MESSAGES,
} from '../../messages';

import {
  AiSkillsReleasesServiceV1,
} from 'client-services';

import { BaseTableV1 } from 'client-shared-components';

@Component({
  selector: 'aiap-ai-skills-releases-table-v1',
  templateUrl: './ai-skills-releases-table-v1.html',
  styleUrls: ['./ai-skills-releases-table-v1.scss'],
})
export class AiSkillsReleasesTableV1 extends BaseTableV1 implements OnInit, OnDestroy, AfterViewInit, OnChanges {

  static getClassName() {
    return 'AiSkillsReleasesTableV1';
  }

  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('deployedTemplate', { static: true }) deployedTemplate: TemplateRef<any>;

  @ViewChild('actionsOverFlowTemplate', { static: true }) actionsOverFlowTemplate: TemplateRef<any>;

  @Input() aiSkill;

  @Output() onShowDeployPlace = new EventEmitter<any>();
  @Output() onShowComparePlace = new EventEmitter<any>();

  state: any = {
    queryType: DEFAULT_TABLE.AI_SKILLS_RELEASES.TYPE,
    defaultSort: DEFAULT_TABLE.AI_SKILLS_RELEASES.SORT,
    defaultPagination: DEFAULT_TABLE.AI_SKILLS_RELEASES.PAGINATION,
    search: '',
  };

  itemsPerPageOptions: number[] = DEFAULT_TABLE.AI_SKILLS_RELEASES.ITEMS_PER_PAGE_OPTIONS;

  constructor(
    protected sessionService: SessionServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    protected queryService: QueryServiceV1,
    private aiSkillsReleasesService: AiSkillsReleasesServiceV1,
    public timezoneService: TimezoneServiceV1,
    private translateHelperService: TranslateHelperServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    _debugX(AiSkillsReleasesTableV1.getClassName(), 'ngOnChanges', {
      this_aiSkill: this.aiSkill
    });
    if (
      lodash.isEmpty(this.aiSkill?.aiServiceId) &&
      lodash.isEmpty(this.aiSkill?.id)
    ) {
      this.skeletonState = false;
    } else {
      this.skeletonState = true;
      this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
    }
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    this.queryService.setPagination(this.state.queryType, this.state.defaultPagination);
    const QUERY = this.queryService.query(this.state.queryType);
    if (
      QUERY?.filter?.search
    ) {
      this.state.search = QUERY?.filter?.search;
    }
    super.ngOnInit();
  }

  ngAfterViewInit(): void { }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  addFilterEventHandler() {
    this.eventsService.filterEmitter.pipe(
      skipWhile((query: any) => {
        return lodash.isEmpty(this.aiSkill?.aiServiceId) && lodash.isEmpty(this.aiSkill?.id);
      }),
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query: any) => {
        let tmpQuery = query;
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
        tmpQuery.filter.aiServiceId = this.aiSkill?.aiServiceId;
        tmpQuery.filter.aiSkillId = this.aiSkill?.id;
        _debugX(AiSkillsReleasesTableV1.getClassName(), `addFilterEventHandler`, { query: tmpQuery });
        return this.aiSkillsReleasesService.findManyLiteByQuery(tmpQuery).pipe(
          catchError((error) => this.handleFindManyLiteByQueryError(error))
        )
      }),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(AiSkillsReleasesTableV1.getClassName(), `addFilterEventHandler`, { response });
      this.notificationService.showNotification(AI_SKILL_RELEASES_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY);
      this.handleEventAllDeselect();
      this.response = response;
      this.refreshTableModel();

      this.skeletonState = false;
      this.eventsService.loadingEmit(false);
    });
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateHelperService.instant('ai_skills_releases_table_v1.col_version.header'),
      field: "createdT",
      style: { width: '45%' },
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateHelperService.instant('ai_skills_releases_table_v1.col_deployed.header'),
      field: 'deployed.date'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateHelperService.instant('ai_skills_releases_table_v1.col_created.header'),
      field: 'created.date'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateHelperService.instant('ai_skills_releases_table_v1.col_actions.header'),
      field: 'actions',
      sortable: false,
      style: { width: '5%' },
    }));
    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(value) {
    const RET_VAL = [];

    RET_VAL.push(new TableItem({
      data: `(${value?.createdT}) -> ${this.timezoneService.getTimeByUserTimezone(value?.createdT)}`
    }));
    RET_VAL.push(new TableItem({ data: value, template: this.deployedTemplate }));
    RET_VAL.push(new TableItem({ data: value, template: this.createdTemplate }));
    RET_VAL.push(new TableItem({ data: value, template: this.actionsOverFlowTemplate }));

    return RET_VAL;
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }

  handleDeployClickEvent(event) {
    _debugX(AiSkillsReleasesTableV1.getClassName(), 'handleDeployClickEvent', { event });
    this.onShowDeployPlace.emit(event);
  }

  handleCompareClickEvent(event) {
    _debugX(AiSkillsReleasesTableV1.getClassName(), 'handleCompareClickEvent', { event });
    const PARAMS = {
      source: {
        id: event?.id,
        displayName: `version ${event?.createdT}`
      },
      target: {
        skill: this.aiSkill,
        displayName: 'current skill version'
      }
    }
    this.onShowComparePlace.emit(PARAMS);
  }

  private handleFindManyLiteByQueryError(error: any) {
    this.eventsService.loadingEmit(false);
    _errorX(AiSkillsReleasesTableV1.getClassName(), `handleFindManyLiteByQueryError`, { error });
    this.notificationService.showNotification(AI_SKILL_RELEASES_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  translateBtnDeleteText() {
    return this.translateHelperService.instant('ai_skills_releases_table_v1.btn_delete.text', { count: this.selectedRows.length });
  }

}
