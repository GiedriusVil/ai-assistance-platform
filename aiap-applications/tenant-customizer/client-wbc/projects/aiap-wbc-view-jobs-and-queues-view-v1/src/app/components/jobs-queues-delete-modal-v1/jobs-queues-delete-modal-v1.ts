/*
  © Copyright IBM Corporation 2023. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  BaseModal
} from 'client-shared-views';

import {
  JOBS_QUEUES_MESSAGES,
} from '../../messages';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';
import { JobsQueuesServiceV1 } from 'client-services';


@Component({
  selector: 'aiap-jobs-queues-delete-modal-v1',
  templateUrl: './jobs-queues-delete-modal-v1.html',
  styleUrls: ['./jobs-queues-delete-modal-v1.scss']
})
export class JobsQueuesDeleteModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'JobsQueuesDeleteModalV1';
  }

  _jobs: any = [];
  jobs: any = lodash.cloneDeep(this._jobs);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private jobsQueuesService: JobsQueuesServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  handleDeleteManyByIds() {
    this.jobsQueuesService.deleteManyByIds(this.jobs)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleDeleteManyByIdsError(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response) => {
        _debugX(JobsQueuesDeleteModalV1.getClassName(), 'handleDeleteManyByIds', { response });

        this.notificationService.showNotification(JOBS_QUEUES_MESSAGES.SUCCESS.DELETE_MANY_BY_QUERY);
        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(undefined);
        this.close();
      });
  }

  handleDeleteManyByIdsError(error: any) {
    _debugX(JobsQueuesDeleteModalV1.getClassName(), 'handleDeleteManyByIdsError', { error });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(JOBS_QUEUES_MESSAGES.ERROR.DELETE_MANY_BY_QUERY);
    return of();
  }


  show(jobsIds: Array<any>) {
    _debugX(JobsQueuesDeleteModalV1.getClassName(), 'show', { jobsIds });

    if (!lodash.isEmpty(jobsIds)) {
      this.jobs = lodash.cloneDeep(jobsIds);
      this.superShow();
    } else {
      this.notificationService.showNotification(JOBS_QUEUES_MESSAGES.ERROR.DELETE_MANY_BY_QUERY);
    }
  }
}
