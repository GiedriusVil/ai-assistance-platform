/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  BaseModalV1
} from 'client-shared-views';

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

@Component({
  selector: 'aiap-ai-skill-delete-modal-v1',
  templateUrl: './ai-skill-delete-modal-v1.html',
  styleUrls: ['./ai-skill-delete-modal-v1.scss']
})
export class AiSkillDeleteModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiSkillDeleteModalV1';
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
    //
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit() {
    //
  }

  show(aiServiceId: any, ids: any) {
    if (
      !lodash.isEmpty(aiServiceId) &&
      !lodash.isEmpty(ids) &&
      lodash.isArray(ids)
    ) {
      this.aiServiceId = aiServiceId;
      this.ids = lodash.cloneDeep(ids);
      this.superShow();
    } else {
      this.notificationService.showNotification(AI_SKILLS_MESSAGES.ERROR.SHOW_AI_SKILL_DELETE_MODAL);
    }
  }

  delete(): void {
    this.aiSkillsService.deleteManyByIds(this.ids, this.aiServiceId)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleAiSkillDeleteError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(AiSkillDeleteModalV1.getClassName(), 'handleShowAiSkillDeleteModal', { response });
        this.eventsService.loadingEmit(false)
        this.notificationService.showNotification(AI_SKILLS_MESSAGES.SUCCESS.DELETE_MANY_BY_IDS);
        this.close();
        this.eventsService.filterEmit(null);
      });
  }

  private handleAiSkillDeleteError(error: any): Observable<void> {
    this.eventsService.loadingEmit(false);
    _errorX(AiSkillDeleteModalV1.getClassName(), 'handleAiSkillDeleteError', { error });
    this.notificationService.showNotification(AI_SKILLS_MESSAGES.ERROR.DELETE_MANY_BY_IDS);
    return of();
  }

}
