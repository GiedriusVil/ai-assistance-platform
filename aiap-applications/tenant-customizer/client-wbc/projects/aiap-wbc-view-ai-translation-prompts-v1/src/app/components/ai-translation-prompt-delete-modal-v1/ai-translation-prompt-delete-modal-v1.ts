/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
   AI_TRANSLATION_PROMPTS_MESSAGES,
} from 'client-utils';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  AiTranslationPromptsServiceV1,
} from 'client-services';

import { BaseModalV1 } from 'client-shared-views';

@Component({
  selector: 'aiap-ai-translation-prompt-delete-modal-v1',
  templateUrl: './ai-translation-prompt-delete-modal-v1.html',
  styleUrls: ['./ai-translation-prompt-delete-modal-v1.scss']
})
export class AiTranslationPromptDeleteModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiTranslationPromptDeleteModalV1';
  }

  @Input() aiTranslationServiceId: string;

  _ids: Array<any> = [];
  ids: Array<any>;

  constructor(
    private notificationService: NotificationServiceV2,
    private aiTranslationPromptsServiceV1: AiTranslationPromptsServiceV1,
    private eventsService: EventsServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    //
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit(): void {
    //
  }

  show(ids: any) {
    if (
      lodash.isArray(ids) &&
      !lodash.isEmpty(ids)
    ) {
      this.ids = lodash.cloneDeep(ids);
      this.isOpen = true;
    } else {
      this.notificationService.showNotification(AI_TRANSLATION_PROMPTS_MESSAGES.ERROR.SHOW_DELETE_MODAL);
    }
  }

  delete(): void {
    _debugX(AiTranslationPromptDeleteModalV1.getClassName(), 'delete', { this_ids: this.ids });
    this.aiTranslationPromptsServiceV1.deleteManyByServicePromptIds(this.aiTranslationServiceId, this.ids)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleDeleteManyByIds(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response) => {
        _debugX(AiTranslationPromptDeleteModalV1.getClassName(), 'delete', { response });
        this.notificationService.showNotification(AI_TRANSLATION_PROMPTS_MESSAGES.SUCCESS.DELETE_MANY_BY_IDS);
        this.isOpen = false;
        this.eventsService.filterEmit(null);
      });
  }

  handleDeleteManyByIds(error: any): Observable<void> {
    this.eventsService.loadingEmit(false);
    _errorX(AiTranslationPromptDeleteModalV1.getClassName(), 'handleDeleteOneByIdError', { error });
    this.notificationService.showNotification(AI_TRANSLATION_PROMPTS_MESSAGES.ERROR.DELETE_MANY_BY_IDS);
    return of();
  }

}
