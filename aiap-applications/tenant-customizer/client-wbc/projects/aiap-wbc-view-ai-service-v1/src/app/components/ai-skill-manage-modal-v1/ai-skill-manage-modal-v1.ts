/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  AI_SKILLS_MESSAGES,
} from '../../messages';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  AiSkillsServiceV1,
} from 'client-services';

import { BaseModalV1 } from 'client-shared-views';

import { AiSkillReleaseDeleteModalV1 } from '../ai-skill-release-delete-modal-v1/ai-skill-release-delete-modal-v1';
import { AiSkillReleaseDeployModalV1 } from '../ai-skill-release-deploy-modal-v1/ai-skill-release-deploy-modal-v1';
import { AiSkillReleaseTestModalV1 } from '../ai-skill-release-test-modal-v1/ai-skill-release-test-modal-v1';
import { AiSkillCompareModalV1 } from '../ai-skill-compare-modal-v1/ai-skill-compare-modal-v1';

@Component({
  selector: 'aiap-ai-skill-manage-modal-v1',
  templateUrl: './ai-skill-manage-modal-v1.html',
  styleUrls: ['./ai-skill-manage-modal-v1.scss']
})
export class AiSkillManageModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiSkillManageModalV1';
  }

  @ViewChild('aiSkillReleaseDeleteModal') aiSkillReleaseDeleteModal: AiSkillReleaseDeleteModalV1;
  @ViewChild('aiSkillReleaseDeployModal') aiSkillReleaseDeployModal: AiSkillReleaseDeployModalV1;
  @ViewChild('aiSkillReleaseTestModal') aiSkillReleaseTestModal: AiSkillReleaseTestModalV1;
  @ViewChild('aiSkillCompareModal') aiSkillCompareModal: AiSkillCompareModalV1;


  _aiSkill: any = {
    id: undefined,
    name: undefined,
    aiServiceId: undefined,
    external: {
      workspace_id: undefined,
    }
  }
  aiSkill: any = lodash.cloneDeep(this._aiSkill);
  assistantId: string = undefined;

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private aiSkillsService: AiSkillsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.addFilterEventHandler();
  }

  ngAfterViewInit() {
    //
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  addFilterEventHandler() {
    this.eventsService.refreshModalEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(AiSkillManageModalV1.getClassName(), 'addFilterEventHandler', { response });
      this.collectManageOneModalData(this.aiSkill?.id);
    });
  }

  collectManageOneModalData(id: any) {
    super.superShow();
    this.aiSkillsService.collectManageOneModalData(id)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleCollectManageOneModalDataError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(AiSkillManageModalV1.getClassName(), 'collectManageOneModalData', { response });
        const AI_SKILL = response?.aiSkill;
        if (
          !lodash.isEmpty(AI_SKILL)
        ) {
          this.aiSkill = lodash.cloneDeep(AI_SKILL);
        } else {
          this.aiSkill = lodash.cloneDeep(this._aiSkill);
        }

        this.eventsService.loadingEmit(false)
        this.notificationService.showNotification(AI_SKILLS_MESSAGES.SUCCESS.COLLECT_MANAGE_ONE_MODAL_DATA);
        this.superShow();
        this.disableBodyScroll();
        this.eventsService.filterEmit(null);
      });
  }

  private handleCollectManageOneModalDataError(error: any): Observable<void> {
    this.eventsService.loadingEmit(false);
    _errorX(AiSkillManageModalV1.getClassName(), 'handleCollectManageOneModalDataError', { error });
    this.notificationService.showNotification(AI_SKILLS_MESSAGES.ERROR.COLLECT_MANAGE_ONE_MODAL_DATA);
    return of();
  }

  close() {
    super.close();
    this.eventsService.filterEmit(null);
  }

  show(params: any) {
    const ID = ramda.path(['id'], params);
    this.assistantId = ramda.path(['assistantId'], params);
    if (
      !lodash.isEmpty(ID)
    ) {
      this.collectManageOneModalData(ID);
    } else {
      this.notificationService.showNotification(AI_SKILLS_MESSAGES.ERROR.SHOW_MANAGE_MODAL);
    }
  }

  handleShowDeployPlaceEvent(event: any) {
    _debugX(AiSkillManageModalV1.getClassName(), 'handleShowDeployPlaceEvent', { event });
    this.aiSkillReleaseDeployModal.show(event);
  }

  handleShowRemovePlaceEvent(event: any) {
    _debugX(AiSkillManageModalV1.getClassName(), 'handleShowRemovePlaceEvent', { event });
    this.aiSkillReleaseDeleteModal.show(event);
  }

  handleShowComparePlaceEvent(event: any) {
    _debugX(AiSkillManageModalV1.getClassName(), 'handleShowComparePlaceEvent', { event });
    this.aiSkillCompareModal.show(event);
  }

  handleRunAiTestClickEvent(event: any) {
    _debugX(AiSkillManageModalV1.getClassName(), 'handleRunAiTestClickEvent', { event });
    this.aiSkill.assistantId = this.assistantId;
    this.aiSkillReleaseTestModal.show(this.aiSkill);
  }

}
