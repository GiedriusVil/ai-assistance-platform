/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  BaseModal
} from 'client-shared-views';

import { isValidCron } from 'cron-validator';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  JOBS_QUEUES_MESSAGES,
} from '../../messages';

import {
  JobsQueuesServiceV1,
} from 'client-services';
import { JobsQueuesDeleteModalV1 } from '../jobs-queues-delete-modal-v1/jobs-queues-delete-modal-v1';

@Component({
  selector: 'aiap-jobs-queues-save-modal-v1',
  templateUrl: './jobs-queues-save-modal-v1.html',
  styleUrls: ['./jobs-queues-save-modal-v1.scss'],
})
export class JobsQueuesSaveModalV1 extends BaseModal implements OnInit, AfterViewInit, OnDestroy {

  static getClassName() {
    return 'JobsQueuesSaveModalV1';
  }

  _queue: any = {
    id: undefined,
    name: undefined,
    type: undefined,
    client: undefined,
    created: undefined,
    createdBy: undefined,
    updated: undefined,
    updatedBy: undefined,
    lambdaModule: undefined,
    removeOnComplete: undefined,
    cron: '*/30 * * * * *',
  };

  _selections: any = {
    clientTypes: [],
    types: []
  };

  queue = lodash.cloneDeep(this._queue);
  selections = lodash.cloneDeep(this._selections);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private jobsQueuesService: JobsQueuesServiceV1,
    private sessionService: SessionServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngAfterViewInit() {
    //
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  isCronExpressionInvalid() {
    let retVal = true;
    try {
      retVal = isValidCron(this.queue?.cron, { seconds: true }) ? false : true;
    } catch (error) {
      _errorX(JobsQueuesSaveModalV1.getClassName(), 'isCronExpressionInvalid', { error });
    }
    return retVal;
  }

  private sendErrorNotification(error: any) {
    _errorX(JobsQueuesSaveModalV1.getClassName(), 'loadFormData', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(JOBS_QUEUES_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

  loadFormData(id: any) {
    this.jobsQueuesService.findOneById({
      id: id
    }).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.sendErrorNotification(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(JobsQueuesSaveModalV1.getClassName(), 'loadFormData', { response });
      const QUEUE = response;
      const REDIS_CLIENT = QUEUE?.client;
      const TYPE = QUEUE?.type;
      if (lodash.isEmpty(QUEUE.id)) {
        this.queue = lodash.cloneDeep(this._queue);
      } else {
        this.queue = this.flatten(QUEUE);
      }
      this.setClientTypesSelections(REDIS_CLIENT);
      this.setTypesSelections(TYPE);
      this.superShow();
      this.eventsService.loadingEmit(false);
    });
  }

  flatten(queue) {
    const CLONED_QUEUE = lodash.cloneDeep(queue);
    delete CLONED_QUEUE.updated;
    delete CLONED_QUEUE.created;
    const RET_VAL: any = {};
    for (const [key, value] of Object.entries(CLONED_QUEUE)) {
      if (
        typeof value === 'object'
      ) {
        Object.assign(RET_VAL, this.flatten(value));
      } else {
        RET_VAL[key] = value;
      }
    }
    RET_VAL.updated = queue?.updated;
    RET_VAL.created = queue?.created;
    return RET_VAL;
  }

  private setClientTypesSelections(clientId: any) {
    const CLIENT_TYPE_SELECTED = clientId;
    for (const CLIENT_TYPE of this.selections.clientTypes) {
      if (
        CLIENT_TYPE_SELECTED === CLIENT_TYPE.value
      ) {
        CLIENT_TYPE.selected = true;
        this.selections.selectedClientType = CLIENT_TYPE;
        break;
      }
    }
  }

  private setTypesSelections(typeValue: any) {
    const TYPE_SELECTED = typeValue;
    for (const TYPE of this.selections.types) {
      if (
        TYPE_SELECTED === TYPE.value
      ) {
        TYPE.selected = true;
        this.selections.selectedType = TYPE;
        break;
      }
    }
  }

  private transformClientTypesIntoDropDownItems() {
    const CLIENT_LIST = [];
    const TENANT = this.sessionService.getTenant();
    const REDIS_CLIENTS = TENANT?.redisClients;
    for (const CLIENT of REDIS_CLIENTS) {
      const CLIENT_TYPE = ramda.path(['type'], CLIENT);

      if (
        CLIENT?.name && CLIENT_TYPE === 'ioredis'
      ) {
        const TMP_ITEM = {
          content: CLIENT?.name,
          value: CLIENT?.name
        };
        CLIENT_LIST.push(TMP_ITEM);
      }
    }
    this.selections.clientTypes = CLIENT_LIST;
  }

  handleSaveFormError(error: any) {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(JOBS_QUEUES_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

  private constructQueueObj() {
    const RET_VAL = {
      id: this.queue?.id,
      name: this.queue?.name,
      client: this.selections?.selectedClientType?.value,
      type: this.selections?.selectedType?.value,
      created: this.queue?.created,
      createdBy: this.queue?.createdBy,
      updated: this.queue?.createdBy,
      updatedBy: this.queue?.updatedBy,
      defaultJob: {
        lambdaModule: this.queue?.lambdaModule,
        options: {
          removeOnComplete: this.queue?.removeOnComplete,
          repeat: {
            cron: this.queue?.cron
          }
        }
      }
    };
    return RET_VAL;
  }

  /* Switch is required here */
  save() {
    const QUEUE = this.constructQueueObj();
    QUEUE.client = this.selections?.selectedClientType?.value;
    QUEUE.type = this.selections?.selectedType?.value;
    this.jobsQueuesService.saveOne(QUEUE).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleSaveFormError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(JobsQueuesSaveModalV1.getClassName(), 'save', { response });
      this.notificationService.showNotification(JOBS_QUEUES_MESSAGES.SUCCESS.SAVE_ONE);
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(undefined);
      this.close();
    });
  }

  show(queueId: string) {
    _debugX(JobsQueuesSaveModalV1.getClassName(), 'show', { queueId });
    this.selections = lodash.cloneDeep(this._selections);
    this.loadFormData(queueId);
    this.selections.types = this.jobsQueuesService.types;
    this.transformClientTypesIntoDropDownItems();
  }
}
