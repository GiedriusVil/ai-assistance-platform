/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, Input } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  AI_TRANSLATION_SERVICES_MESSAGES,
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
  AiTranslationServicesServiceV1,
} from 'client-services';

import { BaseModalV1 } from 'client-shared-views';

@Component({
  selector: 'aiap-ai-translation-service-import-modal-v1',
  templateUrl: './ai-translation-service-import-modal-v1.html',
  styleUrls: ['./ai-translation-service-import-modal-v1.scss'],
})
export class AiTranslationServiceImportModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiTranslationServiceImportModalV1';
  }

  @Input() files = new Set();

  uploadButtonDisabled = true;

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private aiTranslationServicesService: AiTranslationServicesServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    //
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit(): void {
    //
  }

  show(): void {
    this.clearFileContainer();
    this.uploadButtonDisabled = true;
    this.isOpen = true;
  }

  async import() {
    const FILE = ramda.path(['file'], this.files.values().next().value);
    _debugX(AiTranslationServiceImportModalV1.getClassName(), 'import', { FILE });
    this.aiTranslationServicesService.importManyFromFile(FILE).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleImportManyFromFile(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(AiTranslationServiceImportModalV1.getClassName(), 'import', { response });
      this.notificationService.showNotification(AI_TRANSLATION_SERVICES_MESSAGES.SUCCESS.IMPORT_MANY_FROM_FILE);
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(null);
      this.close();
    });
  }

  handleImportManyFromFile(error: any) {
    _errorX(AiTranslationServiceImportModalV1.getClassName(), 'handleImportError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AI_TRANSLATION_SERVICES_MESSAGES.ERROR.IMPORT_MANY_FROM_FILE);
    return of();
  }

  clearFileContainer(): void {
    this.files.clear();
  }

  onFileAdd(event: any): void {
    if (!lodash.isEmpty(event)) {
      this.uploadButtonDisabled = false;
    } else {
      this.uploadButtonDisabled = true;
    }
  }

}
