/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  Input,
} from '@angular/core';

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

} from 'client-utils';

import {
  AiSearchAndAnalysisProjectsServiceV1,
} from 'client-services';

import {
  AI_SEARCH_AND_ANALYSIS_PROJECTS_MESSAGES,
} from '../../messages';

@Component({
  selector: 'aiap-ai-search-and-analysis-project-delete-modal-v1',
  templateUrl: './ai-search-and-analysis-project-delete-modal-v1.html',
  styleUrls: ['./ai-search-and-analysis-project-delete-modal-v1.scss']
})
export class AiSearchAndAnalysisProjectDeleteModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiSearchAndAnalysisProjectDeleteModalV1';
  }

  @Input() aiSearchAndAnalysisServiceId: string;

  _ids: Array<string> = [];
  ids: Array<string>;

  constructor(
    private notificationService: NotificationServiceV2,
    private aiSearchAndAnalysisProjectsService: AiSearchAndAnalysisProjectsServiceV1,
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

  show(ids: Array<string>) {
    if (
      lodash.isArray(ids) &&
      !lodash.isEmpty(ids)
    ) {
      this.ids = lodash.cloneDeep(ids);
      this.isOpen = true;
    } else {
      this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_PROJECTS_MESSAGES.ERROR.SHOW_DELETE_MODAL);
    }
  }

  delete(): void {
    _debugX(AiSearchAndAnalysisProjectDeleteModalV1.getClassName(), 'delete',
      {
        aiSearchAndAnalysisServiceId: this.aiSearchAndAnalysisServiceId,
        this_ids: this.ids,
      });

    this.aiSearchAndAnalysisProjectsService.deleteManyByServiceIdAndIds(this.aiSearchAndAnalysisServiceId, this.ids)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleDeleteManyByIdsError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response) => {
        _debugX(AiSearchAndAnalysisProjectDeleteModalV1.getClassName(), 'delete',
          {
            response,
          });

        this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_PROJECTS_MESSAGES.SUCCESS.DELETE_MANY_BY_IDS);
        this.isOpen = false;
        this.eventsService.filterEmit(null);
      });
  }

  handleDeleteManyByIdsError(error: any): Observable<void> {
    this.eventsService.loadingEmit(false);
    _errorX(AiSearchAndAnalysisProjectDeleteModalV1.getClassName(), 'handleDeleteOneByIdError',
      {
        error,
      });

    this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_PROJECTS_MESSAGES.ERROR.DELETE_MANY_BY_IDS);
    return of();
  }

  handleEventDelete(event: any) {
    _debugX(AiSearchAndAnalysisProjectDeleteModalV1.getClassName(), 'handleEventDelete',
      {
        event,
      });

    this.delete();
  }

}
