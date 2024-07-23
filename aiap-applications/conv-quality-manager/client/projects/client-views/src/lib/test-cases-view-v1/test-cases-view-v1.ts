/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  DEFAULT_TABLE
} from 'client-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  BaseView
} from 'client-shared-views';

import {
  TestCaseSaveModalV1,
  TestCaseImportModalV1,
  TestCaseDeleteModalV1,
} from '.';


@Component({
  selector: 'aiap-test-cases-view-v1',
  templateUrl: './test-cases-view-v1.html',
  styleUrls: ['./test-cases-view-v1.scss']
})
export class TestCasesViewV1 extends BaseView implements OnInit, OnDestroy {

  static getClassName() {
    return 'TestCasesViewV1';
  }

  @ViewChild('testCaseSaveModal') testCaseSaveModal: TestCaseSaveModalV1;
  @ViewChild('testCaseImportModal') testCaseImportModal: TestCaseImportModalV1;
  @ViewChild('testCaseDeleteModal') testCaseDeleteModal: TestCaseDeleteModalV1;

  state: any = {
    queryType: DEFAULT_TABLE.TEST_CASES.TYPE,
    defaultSort: DEFAULT_TABLE.TEST_CASES.SORT,
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

  handleShowSavePlaceEvent(event: any = undefined): void {
    _debugX(TestCasesViewV1.getClassName(), `handleShowSavePlaceEvent`,
      {
        event,
      });

    const ID = event?.value?.id;
    this.testCaseSaveModal.show(ID);
  }

  handleShowDeletePlaceEvent(event: any = undefined): void {
    _debugX(TestCasesViewV1.getClassName(), `handleShowDeletePlaceEvent`,
      {
        event,
      });

    this.testCaseDeleteModal.show(event);
  }

  handleSearchClearEvent(event: any) {
    _debugX(TestCasesViewV1.getClassName(), `handleSearchClearEvent`,
      {
        event,
      });

    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchChangeEvent(event: any) {
    _debugX(TestCasesViewV1.getClassName(), `handleSearchChangeEvent`,
      {
        event,
      });

    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleShowImportModal(event: any) {
    _debugX(TestCasesViewV1.getClassName(), `handleShowImportModal`,
      {
        event,
      });

    this.testCaseImportModal.showImportModal();
  }

  handleAuditColumnsVisibilityChange(event: any) {
    _debugX(TestCasesViewV1.getClassName(), `handleAuditColumnsVisibilityChange`,
      {
        event,
      });

    this.state.isAuditColumnsVisible = event;
    const STATE = lodash.cloneDeep(this.state)
    this.state = STATE;
  }

  static route() {
    const VALUE = {
      path: 'test-cases',
      component: TestCasesViewV1,
      data: {
        name: 'test_cases_view_v1.name',
        breadcrumb: 'test_cases_view_v1.breadcrumb',
        description: 'test_cases_view_v1.description',
        component: TestCasesViewV1.getClassName(),
        actions: [
          {
            name: 'test_cases_view_v1.action_save.name',
            description: 'test_cases_view_v1.action_save.description',
            component: 'test-cases.view.save',
          },
          {
            name: 'test_cases_view_v1.action_delete.name',
            description: 'test_cases_view_v1.action_delete.description',
            component: 'test-cases.view.delete',
          }
        ]
      }
    };

    return VALUE;
  }
}
