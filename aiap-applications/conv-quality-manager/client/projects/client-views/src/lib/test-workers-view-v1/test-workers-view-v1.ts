/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';

import * as lodash from 'lodash';


import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE
} from 'client-utils';

import {
  BaseView
} from 'client-shared-views';

import {
  TestWorkerDeleteModalV1,
  TestWorkerSaveModalV1,
} from '.';


@Component({
  selector: 'aiap-test-workers-view-v1',
  templateUrl: './test-workers-view-v1.html',
  styleUrls: ['./test-workers-view-v1.scss']
})
export class TestWorkersViewV1 extends BaseView implements OnInit, OnDestroy {

  static getClassName() {
    return 'TestWorkersView';
  }

  @ViewChild('overflowMenuItemTemplate', { static: true }) overflowMenuItemTemplate: TemplateRef<any>;

  @ViewChild('testWorkerDeleteModal') testWorkerDeleteModal: TestWorkerDeleteModalV1;
  @ViewChild('testWorkerSaveModal') testWorkerSaveModal: TestWorkerSaveModalV1;

  state: any = {
    queryType: DEFAULT_TABLE.TEST_CASE_CONFIGURATIONS.TYPE,
    defaultSort: DEFAULT_TABLE.TEST_CASE_CONFIGURATIONS.SORT,
    isAuditColumnsVisible: false,
  };

  constructor(
    private queryService: QueryServiceV1,
    private eventsService: EventsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleSaveActionEvent(event: any = undefined): void {
    _debugX(TestWorkersViewV1.getClassName(), `handleSaveActionEvent`,
      {
        event,
      });

    const ID = event?.value?.id;
    this.testWorkerSaveModal.show(ID);
  }

  handleDeleteActionEvent(event: any = undefined): void {
    _debugX(TestWorkersViewV1.getClassName(), `handleDeleteActionEvent`,
      {
        event,
      });

    this.testWorkerDeleteModal.show(event);
  }

  handleSearchClearEvent(event: any) {
    _debugX(TestWorkersViewV1.getClassName(), `handleSearchClearEvent`,
      {
        event,
      });

    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchChangeEvent(event: any) {
    _debugX(TestWorkersViewV1.getClassName(), `handleSearchChangeEvent`,
      {
        event,
      });

    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleAuditColumnsVisibilityChange(event: any) {
    _debugX(TestWorkersViewV1.getClassName(), `handleAuditColumnsVisibilityChange`,
      {
        event,
      });

    this.state.isAuditColumnsVisible = event;
    const STATE = lodash.cloneDeep(this.state)
    this.state = STATE;
  }

  static route() {
    const VALUE = {
      path: 'test-workers',
      component: TestWorkersViewV1,
      data: {
        requiresApplicationPolicy: true,
        name: 'test_workers_view_v1.name',
        breadcrumb: 'test_workers_view_v1.breadcrumb',
        description: 'test_workers_view_v1.description',
        componentInRoleTable: TestWorkersViewV1.getClassName(),
        actions: [
          {
            name: 'test_workers_view_v1.action_save.name',
            description: 'test_workers_view_v1.action_save.description',
            component: 'test-workers.view.save',

          },
          {
            name: 'test_workers_view_v1.action_delete.name',
            description: 'test_workers_view_v1.action_delete.description',
            component: 'test-workers.view.delete',

          }
        ]
      }
    };

    return VALUE
  }
}
