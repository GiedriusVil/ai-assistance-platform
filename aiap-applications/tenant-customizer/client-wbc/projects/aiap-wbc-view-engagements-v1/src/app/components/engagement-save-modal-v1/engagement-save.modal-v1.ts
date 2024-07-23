/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  ENGAGEMENTS_MESSAGES,
} from 'client-utils';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  EngagementsServiceV1,
} from 'client-services';

import {
  EngagementChatAppTab,
  EngagementChatAppButtonTab,
  EngagementChatAppServerTab,
  EngagementGeneralTab,
  EngagementSlackTab,
  EngagementStylesTab,
  EngagementSoeTab,
} from '.';

import { DEFAULT_ENGAGEMENT } from './engagement-save.modal.utils-v1';
import { BaseModal } from 'client-shared-views';

@Component({
  selector: 'aiap-engagement-save-modal-v1',
  templateUrl: './engagement-save.modal-v1.html',
  styleUrls: ['./engagement-save.modal-v1.scss']
})
export class EngagementSaveModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'EngagementSaveModalV1';
  }

  @ViewChild('generalTab', { static: true }) generalTab: EngagementGeneralTab;
  @ViewChild('stylesTab', { static: true }) stylesTab: EngagementStylesTab;
  @ViewChild('chatAppTab', { static: true }) chatAppTab: EngagementChatAppTab;
  @ViewChild('chatAppButtonTab', { static: true }) chatAppButtonTab: EngagementChatAppButtonTab;
  @ViewChild("chatAppServerTab", { static: true }) chatAppServerTab: EngagementChatAppServerTab;
  @ViewChild("slackTab", { static: true }) slackTab: EngagementSlackTab;
  @ViewChild("soeTab", { static: true }) soeTab: EngagementSoeTab;

  engagement = lodash.cloneDeep(DEFAULT_ENGAGEMENT);

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private engagementsService: EngagementsServiceV1,
  ) {
    super();
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  save() {
    const SANITIZED_ENGAGEMENT = this._sanitizedEngagement();
    _debugX(EngagementSaveModalV1.getClassName(), 'save', { SANITIZED_ENGAGEMENT });
    this.engagementsService.saveOne(SANITIZED_ENGAGEMENT).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleSaveOneError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {

      this.notificationService.showNotification(ENGAGEMENTS_MESSAGES.SUCCESS.SAVE_ONE);
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(null);
      this.close();
    });
  }

  private handleSaveOneError(error) {
    _errorX(EngagementSaveModalV1.getClassName(), 'handleSaveOneError', { error });
    this.notificationService.showNotification(ENGAGEMENTS_MESSAGES.ERROR.SAVE_ONE);
    this.eventsService.loadingEmit(false);
    return of();
  }

  _sanitizedEngagement() {
    const ENGAGEMENT = lodash.cloneDeep(this.engagement);

    ENGAGEMENT.assistant = {
      id: this.engagement.assistant.id
    };

    const VALUE_GENERAL_TAB = this.generalTab.getValue();
    const VALUE_STYLES_TAB: any = this.stylesTab.getValue();
    const VALUE_CHAT_APP_TAB = this.chatAppTab.getValue();
    const VALUE_CHAT_APP_BUTTON_TAB = this.chatAppButtonTab.getValue();
    const VALUE_CHAT_APP_SERVER_TAB = this.chatAppServerTab.getValue();
    const VALUE_SLACK_TAB = this.slackTab.getValue();
    const VALUE_SOE_TAB = this.soeTab.getValue();

    _debugX(EngagementSaveModalV1.getClassName(), '_sanitizedEngagement', {
      VALUE_GENERAL_TAB,
      VALUE_STYLES_TAB,
      VALUE_CHAT_APP_TAB,
      VALUE_CHAT_APP_BUTTON_TAB,
      VALUE_SLACK_TAB,
      VALUE_SOE_TAB,
    });

    ENGAGEMENT.styles.value = VALUE_STYLES_TAB?.value;
    ENGAGEMENT.chatApp = VALUE_CHAT_APP_TAB;
    ENGAGEMENT.chatAppButton = VALUE_CHAT_APP_BUTTON_TAB;
    ENGAGEMENT.chatAppServer = VALUE_CHAT_APP_SERVER_TAB
    ENGAGEMENT.soe = VALUE_SOE_TAB;
    ENGAGEMENT.slack = VALUE_SLACK_TAB;

    return ENGAGEMENT;
  }

  isInvalid() {
    let retVal =

      !this.engagement?.name ||
      !this.engagement?.assistant ||
      !this.engagement?.id ||
      !this.stylesTab.isValid() ||
      !this.chatAppTab.isValid() ||
      !this.chatAppButtonTab.isValid() ||
      !this.slackTab.isValid() ||
      !this.soeTab.isValid();

    return retVal;
  }

  handleGeneralTabData(generalTabData) {
    this.engagement.name = generalTabData.name;
    this.engagement.assistantDisplayName = generalTabData.assistantDisplayName;
  }

  handleStylesData(stylesData) {
    this.engagement.code = stylesData.code;
  }

  handleSelectedAssistant(selectedAssistant) {
    this.engagement.assistant = selectedAssistant;
  }

  private sendErrorNotification(error: any) {
    _errorX(EngagementSaveModalV1.getClassName(), 'handleFindManyByQueryError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(ENGAGEMENTS_MESSAGES.ERROR.FIND_ONE_BY_ID);
    return of();
  }

  loadFormData(id: any) {
    this.engagementsService.findOneById(id).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.sendErrorNotification(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response) => {
      this.engagement = response;
      this.superShow();
      this.eventsService.loadingEmit(false);
    });
  }

  show(engagementId: string) {
    _debugX(EngagementSaveModalV1.getClassName(), 'show', { engagementId });

    this.stylesTab.createMonacoEditor();
    this.engagement = lodash.cloneDeep(DEFAULT_ENGAGEMENT);
    if (
      lodash.isString(engagementId) &&
      !lodash.isEmpty(engagementId)
    ) {
      this.loadFormData(engagementId);
    } else {
      this.superShow();
    }
  }

  close() {
    this.stylesTab.clearMonacoContainer();
    super.close();
  }
}
