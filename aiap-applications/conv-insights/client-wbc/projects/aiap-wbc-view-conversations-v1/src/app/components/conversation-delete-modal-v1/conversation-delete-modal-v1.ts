/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  BaseModal
} from 'client-shared-views';

import {
  EventsServiceV1,
  NotificationServiceV2,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  ConversationService,
} from 'client-services';

import {
  _debugX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-conversation-delete-modal-v1',
  templateUrl: './conversation-delete-modal-v1.html',
  styleUrls: ['./conversation-delete-modal-v1.scss'],
})
export class ConversationDeleteModalV1 extends BaseModal {

  static getClassName() {
    return 'ConversationDeleteModalV1';
  }

  conversationIds: string[] = [];

  constructor(
    private conversationService: ConversationService,
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private translateService: TranslateHelperServiceV1,
  ) {
    super();
  }

  show(conversationIds: Array<string> = []) {
    _debugX(ConversationDeleteModalV1.getClassName(), 'show', { conversationIds });
    if (!lodash.isEmpty(conversationIds)) {
      this.conversationIds = lodash.cloneDeep(conversationIds);
      this.superShow();
    }
  }

  handleDeleteManyByIds() {
    _debugX(ConversationDeleteModalV1.getClassName(), 'handleDeleteManyByIds', { conversationIds: this.conversationIds });
    this.conversationService.deleteManyByIds(this.conversationIds)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleDeleteManyByIdsError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response) => {
        _debugX(ConversationDeleteModalV1.getClassName(), 'handleDeleteManyByIds', { response });
        const NOTIFICATION = {
          type: 'success',
          title: this.translateService.instant('conversations_view_v1.delete_modal_v1.notification.conversation_deleted'),
          target: '.notification-container',
          duration: 5000
        }
        this.notificationService.showNotification(NOTIFICATION);
        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(null);
        this.close();
      });
  }

  handleDeleteManyByIdsError(error) {
    _debugX(ConversationDeleteModalV1.getClassName(), 'handleDeleteManyByIdsError', { error });
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('conversations_view_v1.delete_modal_v1.notification.unable_delete_conversationS'),
      target: '.notification-container',
      duration: 10000
    }
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }
}
