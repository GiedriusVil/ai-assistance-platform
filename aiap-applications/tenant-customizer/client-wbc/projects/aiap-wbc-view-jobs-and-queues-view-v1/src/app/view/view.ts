/*
  © Copyright IBM Corporation 2023. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import {
  DEFAULT_TABLE,
  OUTLETS,
} from 'client-utils';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  BaseView
} from 'client-shared-views';

import {
  JobsQueuesSaveModalV1,
  JobsQueuesDeleteModalV1,
  JobsQueuesImportModalV1
} from '../components';

@Component({
  selector: 'aiap-jobs-queues-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class JobsQueuesViewV1 extends BaseView implements OnInit, AfterViewInit {

  static getClassName() {
    return 'JobsQueuesViewV1';
  }

  @ViewChild('jobsQueuesSaveModal') jobsQueuesSaveModal: JobsQueuesSaveModalV1;
  @ViewChild('jobsQueuesDeleteModal') jobsQueuesDeleteModal: JobsQueuesDeleteModalV1;
  @ViewChild('jobsQueuesImportModal') jobsQueuesImportModal: JobsQueuesImportModalV1;

  outlet = OUTLETS.tenantCustomizer;

  state: any = {
    queryType: DEFAULT_TABLE.JOBS_QUEUES_V1.TYPE,
    defaultSort: DEFAULT_TABLE.JOBS_QUEUES_V1.SORT,
    search: '',
  };

  constructor(
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
  ) {
    super();
  }


  ngOnInit() {
    //
  }

  ngAfterViewInit() {
    //
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleFormSaveEvent(event: any = undefined): void {
    _debugX(JobsQueuesViewV1.getClassName(), `handleShowSavePlaceEvent`, { event });
    const JOBS_QUEUE_ID = event?.value?.id;
    this.jobsQueuesSaveModal.show(JOBS_QUEUE_ID);
  }

  handleFormDeleteEvent(event: any = undefined): void {
    _debugX(JobsQueuesViewV1.getClassName(), `handleDeleteEvent`, { event });
    this.jobsQueuesDeleteModal.show(event);
  }

  handleSearchClearEvent(event: any) {
    _debugX(JobsQueuesViewV1.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchChangeEvent(event: any) {
    _debugX(JobsQueuesViewV1.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleShowImportQueue(event: any) {
    _debugX(JobsQueuesViewV1.getClassName(), `handleShowImportQueue`, { event });
    this.jobsQueuesImportModal.showImportModal();
  }
}
