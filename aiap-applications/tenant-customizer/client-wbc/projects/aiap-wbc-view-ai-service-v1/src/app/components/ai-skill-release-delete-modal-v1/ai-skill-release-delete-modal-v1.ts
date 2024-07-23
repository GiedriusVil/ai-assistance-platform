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
  AI_SKILL_RELEASES_MESSAGES,
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
  AiSkillsReleasesServiceV1,
} from 'client-services';

import { BaseModalV1 } from 'client-shared-views';

@Component({
  selector: 'aiap-ai-skill-release-delete-modal-v1',
  templateUrl: './ai-skill-release-delete-modal-v1.html',
  styleUrls: ['./ai-skill-release-delete-modal-v1.scss']
})
export class AiSkillReleaseDeleteModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiSkillReleaseDeleteModalV1';
  }

  _ids: Array<any> = [];
  ids: Array<any> = lodash.cloneDeep(this._ids);


  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private aiSkillsReleasesService: AiSkillsReleasesServiceV1,
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

  show(ids: any) {
    if (
      !lodash.isEmpty(ids) &&
      lodash.isArray(ids)
    ) {
      this.ids = lodash.cloneDeep(ids);
      super.superShow();
    } else {
      this.notificationService.showNotification(AI_SKILL_RELEASES_MESSAGES.ERROR.SHOW_DELETE_MODAL);
    }
  }

  delete(): void {
    this.aiSkillsReleasesService.deleteManyByIds(this.ids)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleAiSkillDeleteError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(AiSkillReleaseDeleteModalV1.getClassName(), 'delete', { response });
        this.eventsService.loadingEmit(false)
        this.notificationService.showNotification(AI_SKILL_RELEASES_MESSAGES.SUCCESS.DELETE_MANY_BY_IDS);
        this.close();
      });
  }

  close() {
    super.close();
    this.eventsService.filterEmit(null);
  }


  private handleAiSkillDeleteError(error: any): Observable<void> {
    this.eventsService.loadingEmit(false);
    _errorX(AiSkillReleaseDeleteModalV1.getClassName(), 'handleAiSkillDeleteError', { error });
    this.notificationService.showNotification(AI_SKILL_RELEASES_MESSAGES.ERROR.DELETE_MANY_BY_IDS);
    return of();
  }

}
