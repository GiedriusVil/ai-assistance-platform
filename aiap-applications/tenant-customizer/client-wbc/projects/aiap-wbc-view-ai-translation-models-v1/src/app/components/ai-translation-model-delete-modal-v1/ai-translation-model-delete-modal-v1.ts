/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  AI_TRANSLATION_MODELS_MESSAGES,
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
  AiTranslationModelsServiceV1,
} from 'client-services';

import { BaseModalV1 } from 'client-shared-views';

@Component({
  selector: 'aiap-ai-translation-model-delete-modal-v1',
  templateUrl: './ai-translation-model-delete-modal-v1.html',
  styleUrls: ['./ai-translation-model-delete-modal-v1.scss']
})
export class AiTranslationModelDeleteModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiTranslationModelDeleteModalV1';
  }

  @Input() aiTranslationServiceId: string;

  _ids: Array<any> = [];
  ids: Array<any>;

  constructor(
    private notificationService: NotificationServiceV2,
    private aiTranslationModelsService: AiTranslationModelsServiceV1,
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
      this.notificationService.showNotification(AI_TRANSLATION_MODELS_MESSAGES.ERROR.SHOW_DELETE_MODAL);
    }
  }

  delete(): void {
    _debugX(AiTranslationModelDeleteModalV1.getClassName(), 'delete', { this_ids: this.ids });
    this.aiTranslationModelsService.deleteManyByServiceModelIds(this.aiTranslationServiceId, this.ids)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleDeleteManyByIds(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response) => {
        _debugX(AiTranslationModelDeleteModalV1.getClassName(), 'delete', { response });
        this.notificationService.showNotification(AI_TRANSLATION_MODELS_MESSAGES.SUCCESS.DELETE_MANY_BY_IDS);
        this.isOpen = false;
        this.eventsService.filterEmit(null);
      });
  }

  handleDeleteManyByIds(error: any): Observable<void> {
    this.eventsService.loadingEmit(false);
    _errorX(AiTranslationModelDeleteModalV1.getClassName(), 'handleDeleteOneByIdError', { error });
    this.notificationService.showNotification(AI_TRANSLATION_MODELS_MESSAGES.ERROR.DELETE_MANY_BY_IDS);
    return of();
  }

}
