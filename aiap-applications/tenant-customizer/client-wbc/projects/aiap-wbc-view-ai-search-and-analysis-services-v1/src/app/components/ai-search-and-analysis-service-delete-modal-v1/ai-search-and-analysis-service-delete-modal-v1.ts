/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
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
  AiSearchAndAnalysisServicesServiceV1,
} from 'client-services';

import {
  AI_SEARCH_AND_ANALYSIS_SERVICES_MESSAGES,
} from '../../messages';

@Component({
  selector: 'aiap-ai-search-and-analysis-service-delete-modal-v1',
  templateUrl: './ai-search-and-analysis-service-delete-modal-v1.html',
  styleUrls: ['./ai-search-and-analysis-service-delete-modal-v1.scss']
})
export class AiSearchAndAnalysisServiceDeleteModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiSearchAndAnalysisServiceDeleteModalV1';
  }

  _ids: Array<any> = [];
  ids: Array<any>;

  constructor(
    private notificationService: NotificationServiceV2,
    private aiSearchAndAnalysisServicesService: AiSearchAndAnalysisServicesServiceV1,
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

  show(ids: any) {
    if (
      lodash.isArray(ids) &&
      !lodash.isEmpty(ids)
    ) {
      this.ids = lodash.cloneDeep(ids);
      this.isOpen = true;
    } else {
      this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_SERVICES_MESSAGES.ERROR.SHOW_DELETE_MODAL);
    }
  }

  delete(): void {
    _debugX(AiSearchAndAnalysisServiceDeleteModalV1.getClassName(), 'delete',
      {
        this_ids: this.ids,
      });

    this.aiSearchAndAnalysisServicesService.deleteManyByIds(this.ids)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleDeleteManyByIdsError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response) => {
        _debugX(AiSearchAndAnalysisServiceDeleteModalV1.getClassName(), 'delete',
          {
            response,
          });

        this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_SERVICES_MESSAGES.SUCCESS.DELETE_MANY_BY_IDS);
        this.isOpen = false;
        this.eventsService.filterEmit(null);
      });
  }

  handleDeleteManyByIdsError(error: any): Observable<void> {
    this.eventsService.loadingEmit(false);
    _errorX(AiSearchAndAnalysisServiceDeleteModalV1.getClassName(), 'handleDeleteOneByIdError',
      {
        error,
      });

    this.notificationService.showNotification(AI_SEARCH_AND_ANALYSIS_SERVICES_MESSAGES.ERROR.DELETE_MANY_BY_IDS);
    return of();
  }

  handleEventDelete(event: any) {
    _debugX(AiSearchAndAnalysisServiceDeleteModalV1.getClassName(), 'handleEventDelete',
      {
        event,
      });

    this.delete();
  }

}
