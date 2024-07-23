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
  AiSkillsServiceV1 ,
} from 'client-services';

import { BaseModalV1  } from 'client-shared-views';

@Component({
  selector: 'aiap-ai-skill-sync-by-file-modal-v1',
  templateUrl: './ai-skill-sync-by-file-modal-v1.html',
  styleUrls: ['./ai-skill-sync-by-file-modal-v1.scss'],
})
export class AiSkillSyncByFileModalV1 extends BaseModalV1  implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiSkillSyncByFileModalV1';
  }

  @Input() files = new Set();

  isSyncInProgress: any = false;

  aiServiceId: any;


  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private aiSkillsService: AiSkillsServiceV1 ,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit(): void {
    //
  }

  show(aiServiceId: any): void {
    this.clearFileContainer();
    this.aiServiceId = aiServiceId;
    this.isSyncInProgress = false;
    super.superShow();
  }

  handleFilesChangeEvent(event: any): void {
    _debugX(AiSkillSyncByFileModalV1.getClassName(), 'handleFilesChangeEvent', { event: event, this_files: this.files });
  }

  synchronise() {
    this.isSyncInProgress = true;

    const FILES: Array<any> = Array.from(this.files).map((item: any) => item.file);
    _debugX(AiSkillSyncByFileModalV1.getClassName(), 'synchronise', { FILES });
    this.aiSkillsService.syncManyByFiles(FILES, this.aiServiceId).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleSyncManyByFilesError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(AiSkillSyncByFileModalV1.getClassName(), 'synchronise', { response });
      this.notificationService.showNotification(AI_SKILLS_MESSAGES.SUCCESS.SYNC_MANY_BY_FILES);
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(null);

      this.isSyncInProgress = false;
      super.close();
    });
  }

  handleSyncManyByFilesError(error: any) {
    _errorX(AiSkillSyncByFileModalV1.getClassName(), 'handleSyncManyByFilesError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AI_SKILLS_MESSAGES.ERROR.SYNC_MANY_BY_FILES);
    this.isSyncInProgress = false;
    return of();
  }

  isSynchronisationDisabled() {
    const RET_VAL = this.isSyncInProgress || lodash.isEmpty(this.files);
    return RET_VAL;
  }

  private clearFileContainer(): void {
    this.files.clear();
  }

}
