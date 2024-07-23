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

@Component({
  selector: 'aiap-ai-skill-release-deploy-modal-v1',
  templateUrl: './ai-skill-release-deploy-modal-v1.html',
  styleUrls: ['./ai-skill-release-deploy-modal-v1.scss']
})
export class AiSkillReleaseDeployModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiSkillReleaseDeployModalV1';
  }

  _release: any = {
    id: undefined,
  }
  release: any = lodash.cloneDeep(this._release);

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

  deploy(): void {
    _debugX(AiSkillReleaseDeployModalV1.getClassName(), 'deploy', { this_release: this.release });
    this.aiSkillsReleasesService.deployOne(this.release)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleDeployOneError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(AiSkillReleaseDeployModalV1.getClassName(), 'deploy', { response });
        this.eventsService.loadingEmit(false)
        this.notificationService.showNotification(AI_SKILL_RELEASES_MESSAGES.SUCCESS.DEPLOY_ONE);
        this.eventsService.refreshModalEmit(null);
        this.close();
      });
  }

  private handleDeployOneError(error: any): Observable<void> {
    this.eventsService.loadingEmit(false);
    _errorX(AiSkillReleaseDeployModalV1.getClassName(), 'handleDeployOneError', { error });
    this.notificationService.showNotification(AI_SKILL_RELEASES_MESSAGES.ERROR.DEPLOY_ONE);
    return of();
  }

  close() {
    super.close();
    this.eventsService.filterEmit(null);
  }

  show(release: any) {
    if (
      !lodash.isEmpty(release?.id)
    ) {
      this.release = lodash.cloneDeep(release);
      super.superShow();
    } else {
      this.notificationService.showNotification(AI_SKILL_RELEASES_MESSAGES.ERROR.SHOW_DEPLOY_MODAL);
    }
  }

}
