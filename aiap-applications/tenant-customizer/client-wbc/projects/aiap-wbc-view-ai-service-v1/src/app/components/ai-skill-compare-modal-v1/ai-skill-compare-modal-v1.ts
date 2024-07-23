/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { catchError, tap, of } from 'rxjs';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import { BaseModalV1 } from 'client-shared-views';

import { AiSkillsReleasesServiceV1 } from 'client-services';

import { AcaJsonDifference } from 'client-shared-components';

import {
  EventsServiceV1,
  NotificationServiceV2,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import { 
  AI_SKILL_RELEASES_MESSAGES 
} from '../../messages';

@Component({
  selector: 'aiap-ai-skill-compare-modal-v1',
  templateUrl: './ai-skill-compare-modal-v1.html',
  styleUrls: ['./ai-skill-compare-modal-v1.scss'],
})
export class AiSkillCompareModalV1 extends BaseModalV1 implements OnDestroy {

  static getClassName() {
    return 'AiSkillCompareModalV1';
  }

  @ViewChild('jsonDiff') jsonDiff: AcaJsonDifference

  sourceSkill: any;
  targetSkill: any;

  _state = {
    sourceDisplayName: '',
    targetDisplayName: '',
    headerText: '',
  }

  state: any = lodash.cloneDeep(this._state);

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private aiSkillsReleasesService: AiSkillsReleasesServiceV1,
    private translateHelperService: TranslateHelperServiceV1,
  ) {
    super();
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  retrieveSourceRelease(releaseId, targetSkill) {
    return this.aiSkillsReleasesService.findOneById(releaseId)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleRetrieveSourceReleaseError(error)),
      ).subscribe((response: any) => {
        _debugX(AiSkillCompareModalV1.getClassName(), `retrieveSourceRelease`, { response,targetSkill });

        this.sourceSkill = response?.versions?.deployed;
        this.targetSkill = response?.versions?.current;

        this.eventsService.loadingEmit(false);
        this.superShow();
      });
  }

  handleRetrieveSourceReleaseError(error) {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AI_SKILL_RELEASES_MESSAGES.ERROR.COMPARE);
    return of();
  }

  showCompareErrorNotification() {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AI_SKILL_RELEASES_MESSAGES.ERROR.COMPARE);
  }

  show(params) {
    this.state = lodash.cloneDeep(this._state);

    const SOURCE = params?.source;
    const TARGET = params?.target;
    this.state.sourceDisplayName = SOURCE.displayName;
    this.state.targetDisplayName = TARGET.displayName;

    this.state.headerText = this.translateHelperService.instant(
      'ai_service_v1.compare_modal_v1.header.title', 
      {
        sourceDisplayName: this.state.sourceDisplayName, 
        targetDisplayName: this.state.targetDisplayName
      })
      this.jsonDiff.createMonacoEditor();
    this.retrieveSourceRelease(SOURCE?.id, TARGET?.skill);
  }

  close() {
    this.jsonDiff.clearMonacoContainer();
    super.close();
  }
}
