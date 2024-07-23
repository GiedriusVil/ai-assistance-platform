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
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  BaseModal,
} from 'client-shared-views';

import {
  AiSearchAndAnalysisProjectsServiceV1,
} from 'client-services';

import {
  AI_SEARCH_AND_ANALYSIS_PROJECTS_MESSAGES,
} from '../../messages';

@Component({
  selector: 'aiap-ai-search-and-analysis-project-import-modal-v1',
  templateUrl: './ai-search-and-analysis-project-import-modal-v1.html',
  styleUrls: ['./ai-search-and-analysis-project-import-modal-v1.scss'],
})
export class AiSearchAndAnalysisProjectImportModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiSearchAndAnalysisProjectImportModalV1';
  }

  @Input() files = new Set();
  @Input() aiSearchAndAnalysisServiceId: string;

  uploadButtonDisabled = true;

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private aiSearchAndAnalysisProjectService: AiSearchAndAnalysisProjectsServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    //
  }

  ngOnDestroy(): void {
    this.superNgOnDestroy();
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
    const PARAMS = {
      aiSearchAndAnalysisServiceId: this.aiSearchAndAnalysisServiceId
    };
    _debugX(AiSearchAndAnalysisProjectImportModalV1.getClassName(), 'import',
      {
        FILE,
        PARAMS,
      });

    this.aiSearchAndAnalysisProjectService.importManyFromFile(FILE, PARAMS).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleImportManyFromFileError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(AiSearchAndAnalysisProjectImportModalV1.getClassName(), 'import',
        {
          response,
        });

      this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_PROJECTS_MESSAGES.SUCCESS.IMPORT_MANY_FROM_FILE);
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(null);
      this.close();
    });
  }

  handleImportManyFromFileError(error: any) {
    _errorX(AiSearchAndAnalysisProjectImportModalV1.getClassName(), 'handleImportError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_PROJECTS_MESSAGES.ERROR.IMPORT_MANY_FROM_FILE);
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

  handleEventImport(event: any) {
    _debugX(AiSearchAndAnalysisProjectImportModalV1.getClassName(), 'handleEventImport',
      {
        event,
      });

    this.import();
  }

}
