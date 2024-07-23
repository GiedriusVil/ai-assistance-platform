/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, AfterViewInit, EventEmitter, Input, Output, AfterViewChecked, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';

import { BaseViewV1 } from 'client-shared-views';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  AiSkillDeleteModalV1,
  AiSkillManageModalV1,
  AiSkillPullModalV1,
  AiSkillSyncByFileModalV1,
  AiSkillSyncModalV1,
  AiSkillDialogTreeModalV1,
} from '../';

@Component({
  selector: 'aiap-ai-service-wa-v2-content-v1',
  templateUrl: './ai-service-wa-v2-content-v1.html',
  styleUrls: ['./ai-service-wa-v2-content-v1.scss'],
})
export class AiServiceWaV2ContentV1 extends BaseViewV1 implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  
  static getClassName() {
    return 'AiServiceWaV2ContentV1';
  }

  @ViewChild('exportOverflowMenuTemplate', { static: true }) exportOverflowMenuTemplate: TemplateRef<any>;

  @ViewChild('aiSkillDeleteModal') aiSkillDeleteModal: AiSkillDeleteModalV1;
  @ViewChild('aiSkillManageModal') aiSkillManageModal: AiSkillManageModalV1;
  @ViewChild('aiSkillDialogTreeModal') aiSkillDialogTreeModal: AiSkillDialogTreeModalV1;
  @ViewChild('aiSkillSyncModal') aiSkillSyncModal: AiSkillSyncModalV1;
  @ViewChild('aiSkillSyncByFileModal') aiSkillSyncByFileModal: AiSkillSyncByFileModalV1;
  @ViewChild('aiSkillPullModal') aiSkillPullModal: AiSkillPullModalV1;

  @Output() onShowAiSkillPullModal = new EventEmitter<any>();
  @Output() onShowAiSkillRollbackModal = new EventEmitter<any>();
  @Output() onShowAiSkillDeleteModal = new EventEmitter<any>();
  @Output() onFilterPanelOpenEvent = new EventEmitter<any>();

  @Input() tableConfig: any;
  @Input() aiService: any;
  @Input() assistantId: any;
  @Input() pullConfiguration: any;

  state: any = {
    isLoading: false,
    queryType: DEFAULT_TABLE.AI_SKILLS_V1.TYPE,
  }

  query: any = {
    filter: {},
    sort: {
      field: 'id',
      direction: 'desc'
    },
    pagination: {
      page: 1,
      size: 10,
    }
  };

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private sessionService: SessionServiceV1,
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.eventsService.filterEmit(this.query);
  }

  ngAfterViewInit() {
    //
  }

  ngOnDestroy(): void {
    this.superNgOnDestroy();
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  private hasPullConfiguration() {
    let retVal = false;
    if (
      this.aiService?.pullConfiguration?.tenantId &&
      this.aiService?.pullConfiguration?.assistantId &&
      this.aiService?.pullConfiguration?.aiServiceId
    ) {
      retVal = true;
    }
    return retVal;
  }

  handleShowSavePlace(event: any) {
    _debugX(AiServiceWaV2ContentV1.getClassName(), 'handleShowSavePlace', { event });
    this.aiSkillManageModal.show({
      id: event?.value?.id,
      assistantId: this.assistantId
    });
  }

  handleShowDialogTreeModalEvent(event: any) {
    _debugX(AiSkillManageModalV1.getClassName(), 'handleShowDialogTreeModalEvant', { event });
    this.aiSkillDialogTreeModal.show({ aiSkill: event });
  }

  handleShowDeletePlace(event: any) {
    _debugX(AiServiceWaV2ContentV1.getClassName(), 'handleShowDeletePlace', { event });
    this.aiSkillDeleteModal.show(this.aiService.id, event);
  }

  handleShowSyncPlaceEvent(event: any) {
    _debugX(AiServiceWaV2ContentV1.getClassName(), 'handleShowSyncPlaceEvent', { event });
    this.aiSkillSyncModal.show(this.aiService.id, event);
  }

  handleShowSyncByFilePlaceEvent(event: any) {
    _debugX(AiServiceWaV2ContentV1.getClassName(), 'handleShowSyncByFilePlaceEvent', { event });
    this.aiSkillSyncByFileModal.show(this.aiService.id);
  }

  handleShowPullPlaceEvent(event: any) {
    _debugX(AiServiceWaV2ContentV1.getClassName(), 'handleShowPullPlaceEvent', { event });
    this.aiSkillPullModal.show(this.aiService.id, event);
  }

  handleSearchChangeEvent(event: any) {
    _debugX(AiServiceWaV2ContentV1.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(DEFAULT_TABLE.AI_SKILLS_V1.TYPE, QueryServiceV1.FILTER_KEY.SEARCH, event);

    const QUERY = this.queryService.query(DEFAULT_TABLE.AI_SKILLS_V1.TYPE);

    _debugX(AiServiceWaV2ContentV1.getClassName(), `handleSearchChangeEvent`, { QUERY });
    this.eventsService.filterEmit(QUERY);
  }


  handleSearchClearEvent(event: any) {
    _debugX(AiServiceWaV2ContentV1.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(DEFAULT_TABLE.AI_SKILLS_V1.TYPE, QueryServiceV1.FILTER_KEY.SEARCH);
    const QUERY = this.queryService.query(DEFAULT_TABLE.AI_SKILLS_V1.TYPE);
    _debugX(AiServiceWaV2ContentV1.getClassName(), `handleSearchClearEvent`, { QUERY });
    this.eventsService.filterEmit(QUERY);
  }

  isPullActionEnabled() {
    const RET_VAL = this.hasPullConfiguration();
    return RET_VAL;
  }

  isRollbackActionEnabled() {
    const RET_VAL = this.hasPullConfiguration();
    return RET_VAL;
  }

  isRemoveActionEnabled() {
    const RET_VAL = true;
    return RET_VAL;
  }

  showAiSkillDeleteModal(aiSkill: any) {
    const EVENT = {
      aiServiceId: this.aiService?.id,
      aiSkill: aiSkill
    };
    _debugX(AiServiceWaV2ContentV1.getClassName(), 'emitShowAiSkillDeleteModal', { EVENT });
    this.aiSkillDeleteModal.show(EVENT?.aiServiceId, EVENT?.aiSkill);
  }
  
  emitFilterPanelOpen() {
    this.onFilterPanelOpenEvent.emit();
  }
}
