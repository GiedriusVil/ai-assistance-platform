/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';


import {
  _debugX,
  StripTextPipe,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  TimezoneServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  BaseView
} from 'client-shared-views';

import {
  DEFAULT_TABLE,
  OUTLETS,
} from 'client-utils';

import { LambdaModuleChangeView } from './lambda-module-change-view-modal-v1/lambda-module-change-view-modal-v1';

@Component({
  selector: 'aca-lambda-modules-changes-view',
  templateUrl: './lambda-modules-changes-view-v1.html',
  styleUrls: ['./lambda-modules-changes-view-v1.scss'],
  providers: [StripTextPipe]
})
export class LambdaModulesChangesView extends BaseView implements OnInit, OnDestroy {

  static getClassName() {
    return 'LambdaModulesChangesView';
  }

  @ViewChild('lambdaModuleChangeView') lambdaModuleChangeView: LambdaModuleChangeView;

  outlet = OUTLETS.tenantCustomizer;

  state: any = {
    dateRange: {},
    search: '',
    queryType: DEFAULT_TABLE.LAMBDA_CHANGES.TYPE,
    defaultSort: DEFAULT_TABLE.LAMBDA_CHANGES.SORT
  }

  constructor(
    public timezoneService: TimezoneServiceV1,
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    const QUERY = this.queryService.query(this.state.queryType);
    this.queryService.setPagination(this.state.queryType, QUERY.pagination);
    this.state.dateRange = QUERY?.filter?.dateRange;
    this.state.search = QUERY?.filter?.search;
    _debugX(LambdaModulesChangesView.getClassName(), `ngOnInit`, {
      query: QUERY,
      this_state: this.state
    });
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleDateRangeChange(range: any) {
    _debugX(LambdaModulesChangesView.getClassName(), `handleDateRangeChange`, { range });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.DATE_RANGE, range);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleShowTransactionEvent(event: any) {
    _debugX(LambdaModulesChangesView.getClassName(), `handleTransactionRowClick`, { event });
    this.lambdaModuleChangeView.show(event?.value);
  }

  handleSearchChangeEvent(event: any) {
    _debugX(LambdaModulesChangesView.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchClearEvent(event: any) {
    _debugX(LambdaModulesChangesView.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  static route() {
    const RET_VAL = {
      path: 'lambda-modules-changes',
      component: LambdaModulesChangesView,
      data: {
        name: 'λ Modules changes',
        breadcrumb: 'lambda_modules_changes_view_v1.breadcrumb',
        component: LambdaModulesChangesView.getClassName(),
        description: 'Enables access to Lambda Modules view',
        actions: [
          {
            name: 'View lambda-module change',
            component: 'lambda-modules-changes.view.actions.view',
            description: 'Allows viewing of Lambda Modules changes',
          }
        ]
      }
    };
    return RET_VAL;
  }
}
