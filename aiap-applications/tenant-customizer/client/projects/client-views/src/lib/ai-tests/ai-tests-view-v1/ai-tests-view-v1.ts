/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  WbcLocationServiceV1,
  EventsServiceV1,
  TimezoneServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  BaseViewV1,
} from 'client-shared-views';

import { DEFAULT_TABLE, OUTLETS } from 'client-utils';

import {
  AiTestDeleteModal,
} from './aitest-delete-modal-v1/aitest-delete-modal-v1';

@Component({
  selector: 'aca-ai-tests-view',
  templateUrl: './ai-tests-view-v1.html',
  styleUrls: ['./ai-tests-view-v1.scss']
})
export class AiTestsView extends BaseViewV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiTestsView';
  }

  @ViewChild('aiTestDeleteModal') aiTestDeleteModal: AiTestDeleteModal;

  outlet = OUTLETS.tenantCustomizer;

  state: any = {
    testName: '',
    dateRange: {},
    testId: '',
    queryType: DEFAULT_TABLE.TESTS.TYPE,
    defaultSort: DEFAULT_TABLE.TESTS.SORT
  }


  constructor(
    private eventsService: EventsServiceV1,
    public timezoneService: TimezoneServiceV1,
    private queryService: QueryServiceV1,
    private wbcLocationService: WbcLocationServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    const QUERY = this.queryService.query(this.state.queryType);
    if (!lodash.isEmpty(QUERY?.filter?.testId)) {
      this.state.testId = QUERY.filter.testId;
    }
    if (!lodash.isEmpty(QUERY?.filter?.testName)) {
      this.state.testName = QUERY.filter.testName;
    }
    this.state.dateRange = QUERY?.filter?.dateRange;
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  ngOnDestroy(): void {
    this.superNgOnDestroy();
  }

  handleDateRangeChange(range: any) {
    _debugX(AiTestsView.getClassName(), `handleDateRangeChange`,
      {
        range,
      });

    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.DATE_RANGE, range);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handeAiTestsSearchByIdEvent(event: string = undefined) {
    _debugX(AiTestsView.getClassName(), `handeAiTestsSearchByIdEvent`,
      {
        event,
      });

    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.TEST_ID, event);
    const QUERY = this.queryService.query(this.state.queryType)
    QUERY.pagination.page = 1;
    this.queryService.setPagination(this.state.queryType, QUERY.pagination);
    this.eventsService.filterEmit(QUERY);
  }
  handeAiTestsSearchByNameEvent(event: string = undefined) {
    _debugX(AiTestsView.getClassName(), `handeAiTestsSearchByNameEvent`,
      {
        event,
      });

    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.TEST_NAME, event);
    const QUERY = this.queryService.query(this.state.queryType)
    QUERY.pagination.page = 1;
    this.queryService.setPagination(this.state.queryType, QUERY.pagination);
    this.eventsService.filterEmit(QUERY);
  }

  refresh() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  showDeleteTestModal(test: any) {
    this.aiTestDeleteModal.showAsModal(test);
  }

  handleRowClick(test: any) {
    const NAVIGATION: any = {
    };
    let testId;
    try {
      testId = test?.value?.id;
      NAVIGATION.path = '(tenantCustomizer:main-view/aitests/ai-test)';
      NAVIGATION.extras = {
        queryParams: {
          testId: testId
        }
      };
      _debugX(AiTestsView.getClassName(), 'handleRowClick', { NAVIGATION });
      this.wbcLocationService.navigateToPath(NAVIGATION.path, NAVIGATION.extras);
    } catch (error) {
      _errorX(AiTestsView.getClassName(), 'handleRowClick', { error, NAVIGATION });
    }
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'aitests',
      children: [
        ...children,
        {
          path: '',
          component: AiTestsView,
          data: {
            name: 'AI Tests',
            component: AiTestsView.getClassName(),
            description: 'Enables access to AI Tests view',
            actions: [
              {
                name: 'Delete AI Test',
                component: 'ai-test.view.delete',
                description: 'Allows deletion of existing AI Tests',
              },
              {
                name: 'View Test',
                component: 'test.view.view-test',
                description: 'Allows the ability to view an AI Test results',
              }
            ]
          }
        },
      ],
      data: {
        breadcrumb: 'ai_tests_view_v1.breadcrumb',
      }
    };
    return RET_VAL;
  }
}
