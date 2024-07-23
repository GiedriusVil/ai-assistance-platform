/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, takeUntil, } from 'rxjs/operators';

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
  selector: 'aiap-ai-skill-pull-modal-v1',
  templateUrl: './ai-skill-pull-modal-v1.html',
  styleUrls: ['./ai-skill-pull-modal-v1.scss']
})
export class AiSkillPullModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiSkillPullModalV1';
  }

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
    this.superNgOnInit(this.eventsService);
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit() {
    //
  }

  pull(): void {
    _debugX(AiSkillPullModalV1.getClassName(), 'pull', { this_ids: this.ids, this_aiServiceId: this.aiServiceId });
    this.eventsService.loadingEmit(true);
    this.aiSkillsService.pullManyByIds(this.ids, this.aiServiceId)
      .pipe(
        catchError((error) => this.handlePullManyByIdsError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(AiSkillPullModalV1.getClassName(), 'pull', { response });
        this.eventsService.loadingEmit(false)
        this.notificationService.showNotification(AI_SKILLS_MESSAGES.SUCCESS.PULL_MANY_BY_IDS);
        this.close();
        this.eventsService.filterEmit(null);
      });
  }

  private handlePullManyByIdsError(error: any): Observable<void> {
    this.eventsService.loadingEmit(false);
    _errorX(AiSkillPullModalV1.getClassName(), 'handlePullManyByIdsError', { error });
    this.notificationService.showNotification(AI_SKILLS_MESSAGES.ERROR.PULL_MANY_BY_IDS);
    return of();
  }

  close() {
    super.close();
    this.eventsService.filterEmit(null);
  }

  show(aiServiceId: any, ids: any) {
    if (
      !lodash.isEmpty(aiServiceId) &&
      !lodash.isEmpty(ids) &&
      lodash.isArray(ids)
    ) {
      this.aiServiceId = aiServiceId;
      this.ids = lodash.cloneDeep(ids);
      super.superShow();
    } else {
      this.notificationService.showNotification(AI_SKILLS_MESSAGES.ERROR.SHOW_PULL_MODAL);
    }
  }

}
