/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
  TEST_EXECUTION_MESSAGES,
} from 'client-utils';

import {
  TestExecutionsService,
} from 'client-services';

import {
  BaseView
} from 'client-shared-views';

import {
  TestExecutionDeleteModalV1,
  TestExecutionSaveModalV1,
  TestExecutionGenerateManyModalV1,
} from '.';

@Component({
  selector: 'aiap-test-executions-view-v1',
  templateUrl: './test-executions-view-v1.html',
  styleUrls: ['./test-executions-view-v1.scss']
})
export class TestExecutionsViewV1 extends BaseView implements OnInit, OnDestroy {

  static getClassName() {
    return 'TestExecutionsViewV1';
  }

  @ViewChild('overflowMenuItemTemplate', { static: true }) overflowMenuItemTemplate: TemplateRef<any>;

  @ViewChild('testExecutionDeleteModal') testExecutionDeleteModal: TestExecutionDeleteModalV1;
  @ViewChild('testExecutionSaveModal') testExecutionSaveModal: TestExecutionSaveModalV1;
  @ViewChild('testExecutionGenerateManyModal') testExecutionGenerateManyModal: TestExecutionGenerateManyModalV1;


  state: any = {
    queryType: DEFAULT_TABLE.TEST_CASE_EXECUTIONS.TYPE,
    defaultSort: DEFAULT_TABLE.TEST_CASE_EXECUTIONS.SORT,
    isAuditColumnsVisible: false,
  };

  constructor(
    private queryService: QueryServiceV1,
    private eventsService: EventsServiceV1,
    private testExecutionsService: TestExecutionsService,
    private notificationService: NotificationServiceV2,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleShowSavePlaceEvent(event: any = undefined): void {
    _debugX(TestExecutionsViewV1.getClassName(), `handleShowSavePlaceEvent`,
      {
        event,
      });

    const ID = event?.value?.id;
    this.testExecutionSaveModal.show(ID);
  }

  handleShowGenerateManyPlaceEvent(event: any = undefined) {
    _debugX(TestExecutionsViewV1.getClassName(), `handleShowSaveManyPlaceEvent`,
      {
        event,
      });

    this.testExecutionGenerateManyModal.show();
  }

  handleShowRemovePlaceEvent(event: any = undefined): void {
    _debugX(TestExecutionsViewV1.getClassName(), `handleShowRemovePlaceEvent`,
      {
        event,
      });

    this.testExecutionDeleteModal.show(event);
  }

  handleSearchClearEvent(event: any) {
    _debugX(TestExecutionsViewV1.getClassName(), `handleSearchClearEvent`,
      {
        event,
      });

    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchChangeEvent(event: any) {
    _debugX(TestExecutionsViewV1.getClassName(), `handleSearchChangeEvent`,
      {
        event,
      });

    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleAuditColumnsVisibilityChange(event: any) {
    _debugX(TestExecutionsViewV1.getClassName(), `handleAuditColumnsVisibilityChange`,
      {
        event,
      });

    this.state.isAuditColumnsVisible = event;
    const STATE = lodash.cloneDeep(this.state)
    this.state = STATE;
  }

  handleReExecuteEvent(event: any) {
    const EXECUTION = lodash.cloneDeep(event);
    _debugX(TestExecutionsViewV1.getClassName(), `handleReExecuteEvent`,
      {
        EXECUTION,
      });

    if (
      !lodash.isEmpty(EXECUTION)
    ) {
      EXECUTION.status = 'PENDING';
      this.testExecutionsService.saveOne(EXECUTION)
        .pipe(
          tap(() => this.eventsService.loadingEmit(true)),
          catchError((error) => this.handleSaveExecutionError(error)),
          takeUntil(this._destroyed$),
        )
        .subscribe((response: any) => {
          _debugX(TestExecutionsViewV1.getClassName(), 'save',
            {
              response,
            });

          this.eventsService.loadingEmit(false);
          this.eventsService.filterEmit(undefined);
          this.notificationService.showNotification(TEST_EXECUTION_MESSAGES.SUCCESS.SAVE_ONE);
        });
    }
  }

  private handleSaveExecutionError(error: any) {
    _errorX(TestExecutionsViewV1.getClassName(), 'handleSaveOneError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(TEST_EXECUTION_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

  static route() {
    const VALUE = {
      path: 'test-executions',
      component: TestExecutionsViewV1,
      data: {
        requiresApplicationPolicy: true,
        name: 'test_executions_view_v1.name',
        breadcrumb: 'test_executions_view_v1.breadcrumb',
        description: 'test_executions_view_v1.description',
        componentInRoleTable: TestExecutionsViewV1.getClassName(),
        actions: [
          {
            name: 'test_executions_view_v1.action_save.name',
            description: 'test_executions_view_v1.action_save.description',
            component: 'test-executions.view.save',
          },
          {
            name: 'test_executions_view_v1.action_delete.name',
            description: 'test_executions_view_v1.action_delete.description',
            component: 'test-executions.view.delete',
          },
        ]
      }
    };

    return VALUE;
  }
}
