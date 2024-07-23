/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

import * as lodash from 'lodash';

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

@Component({
  selector: 'aiap-ai-skill-sync-modal-v1',
  templateUrl: './ai-skill-sync-modal-v1.html',
  styleUrls: ['./ai-skill-sync-modal-v1.scss']
})
export class AiSkillSyncModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiSkillSyncModalV1';
  }

  notification: any = {
    type: 'warning',
    title: 'Rate Limits',
    message: 'Validate amount of skills to be synchronised! External AI service might have rate limitations which would block synchronization! Suggested -> 3-5 AI Skills',
    showClose: false,
    lowContrast: true
  }

  _selections: any = {
    syncIntents: false,
    syncEntities: false,
    syncDialogNodes: false,
  }
  selections: any = lodash.cloneDeep(this._selections);

  isSyncInProgress = false;

  aiServiceId: any;
  _ids: Array<any> = [];
  ids: Array<any> = lodash.cloneDeep(this._ids);


  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private aiSkillsService: AiSkillsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit() {
    //
  }

  synchronise(): void {
    this.isSyncInProgress = true;
    this.aiSkillsService.syncManyByIds(this.ids, this.aiServiceId, this.selections)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleSyncManyByIdsError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(AiSkillSyncModalV1.getClassName(), 'synchronise', { response });
        this.isSyncInProgress = false;
        this.eventsService.loadingEmit(false)
        this.notificationService.showNotification(AI_SKILLS_MESSAGES.SUCCESS.SYNC_MANY_BY_IDS);
        this.close();
      });
  }

  close() {
    super.close();
    this.eventsService.filterEmit(null);
  }


  private handleSyncManyByIdsError(error: any): Observable<void> {
    this.eventsService.loadingEmit(false);
    _errorX(AiSkillSyncModalV1.getClassName(), 'handleSyncManyByIdsError', { error });
    this.notificationService.showNotification(AI_SKILLS_MESSAGES.ERROR.SYNC_MANY_BY_IDS);
    this.isSyncInProgress = false;
    return of();
  }

  isSynchronisationDisabled() {
    const RET_VAL =
      this.isSyncInProgress ||
      !(
        this.selections?.syncIntents ||
        this.selections?.syncEntities ||
        this.selections?.syncDialogNodes
      );
    return RET_VAL;
  }

  onChangeIntents(event: any) {
    this.selections.syncIntents = event?.checked;
  }

  onChangeEntities(event: any) {
    this.selections.syncEntities = event?.checked;
  }

  onChangeDialogNodes(event: any) {
    this.selections.syncDialogNodes = event?.checked;
  }

  show(aiServiceId: any, ids: any) {
    if (
      !lodash.isEmpty(aiServiceId) &&
      !lodash.isEmpty(ids) &&
      lodash.isArray(ids)
    ) {
      this.selections = lodash.cloneDeep(this._selections);
      this.isSyncInProgress = false;
      this.aiServiceId = aiServiceId;
      this.ids = lodash.cloneDeep(ids);
      super.superShow();
    } else {
      this.notificationService.showNotification(AI_SKILLS_MESSAGES.ERROR.SHOW_SYNC_MODAL);
    }
  }

}
