/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

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
  AiSearchAndAnalysisDocumentsServiceV1,
} from 'client-services';

import {
  AI_SEARCH_AND_ANALYSIS_DOCUMENTS_MESSAGES,
} from '../../messages';

@Component({
  selector: 'aiap-ai-search-and-analysis-document-delete-modal-v1',
  templateUrl: './ai-search-and-analysis-document-delete-modal-v1.html',
  styleUrls: ['./ai-search-and-analysis-document-delete-modal-v1.scss']
})
export class AiSearchAndAnalysisDocumentDeleteModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiSearchAndAnalysisDocumentDeleteModalV1';
  }

  @Input() aiSearchAndAnalysisServiceId: string;
  @Input() aiSearchAndAnalysisProjectId: string;
  @Input() aiSearchAndAnalysisCollectionId: string;

  _documents: Array<any> = [];
  documents: Array<any>;

  constructor(
    private notificationService: NotificationServiceV2,
    private aiSearchAndAnalysisDocumentsService: AiSearchAndAnalysisDocumentsServiceV1,
    private eventsService: EventsServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    //
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngAfterViewInit(): void {
    //
  }

  show(documents: Array<any>) {
    if (
      lodash.isArray(documents) &&
      !lodash.isEmpty(documents)
    ) {
      this.documents = lodash.cloneDeep(documents);
      this.isOpen = true;
    } else {
      this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_DOCUMENTS_MESSAGES.ERROR.SHOW_DELETE_MODAL);
    }
  }

  delete(): void {
    _debugX(AiSearchAndAnalysisDocumentDeleteModalV1.getClassName(), 'delete',
      {
        aiSearchAndAnalysisServiceId: this.aiSearchAndAnalysisServiceId,
        aiSearchAndAnalysisProjectId: this.aiSearchAndAnalysisProjectId,
        aiSearchAndAnalysisCollectionId: this.aiSearchAndAnalysisCollectionId,
        this_documents: this.documents,
      });

    this.aiSearchAndAnalysisDocumentsService.deleteManyByServiceProjectCollectionIdAndDocuments(this.documents, {
      aiSearchAndAnalysisServiceId: this.aiSearchAndAnalysisServiceId,
      aiSearchAndAnalysisProjectId: this.aiSearchAndAnalysisProjectId,
      aiSearchAndAnalysisCollectionId: this.aiSearchAndAnalysisCollectionId,
    }).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleDeleteManyByServiceProjectCollectionIdAndDocuments(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response) => {
      _debugX(AiSearchAndAnalysisDocumentDeleteModalV1.getClassName(), 'delete',
        {
          response,
        });

      this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_DOCUMENTS_MESSAGES.SUCCESS.DELETE_MANY_BY_DOCUMENTS);
      this.isOpen = false;
      this.eventsService.filterEmit(null);
    });
  }

  handleDeleteManyByServiceProjectCollectionIdAndDocuments(error: any): Observable<void> {
    this.eventsService.loadingEmit(false);
    _errorX(AiSearchAndAnalysisDocumentDeleteModalV1.getClassName(), 'handleDeleteOneByIdError',
      {
        error,
      });

    this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_DOCUMENTS_MESSAGES.ERROR.DELETE_MANY_BY_DOCUMENTS);
    return of();
  }

  handleEventDelete(event: any) {
    _debugX(AiSearchAndAnalysisDocumentDeleteModalV1.getClassName(), 'handleEventDelete',
      {
        event,
      });

    this.delete();
  }

}
