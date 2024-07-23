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
  DEFAULT_TABLE,
} from 'client-utils';

import {
  EventsServiceV1,
  TimezoneServiceV1,
  QueryServiceV1,
  ConfigServiceV1
} from 'client-shared-services';

import {
  BaseView
} from 'client-shared-views';

import {
  UsersChangesModalV1,
} from '.';

@Component({
  selector: 'aiap-users-changes-view-v1',
  templateUrl: './users-changes-view-v1.html',
  styleUrls: ['./users-changes-view-v1.scss'],
  providers: [StripTextPipe]
})
export class UsersChangesViewV1 extends BaseView implements OnInit, OnDestroy {

  static getClassName() {
    return 'UsersChangesViewV1';
  }

  @ViewChild('usersChangesModal') usersChangesModal: UsersChangesModalV1;

  _viewEnabled = false;

  state: any = {
    dateRange: {},
    search: '',
  }

  queryState: any = {
    queryType: DEFAULT_TABLE.USERS_CHANGES.TYPE,
    defaultSort: DEFAULT_TABLE.USERS_CHANGES.SORT,
  };

  constructor(
    public timezoneService: TimezoneServiceV1,
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
    private configService: ConfigServiceV1
  ) {
    super();
  }

  ngOnInit(): void {
    this._viewEnabled = this.configService.getConfig()?.usersChangesEnabled;

    this.queryService.setSort(this.queryState.queryType, this.queryState.defaultSort);
    const QUERY = this.queryService.query(this.queryState.queryType);
    this.state.dateRange = QUERY?.filter?.dateRange;
    this.state.search = QUERY?.filter?.search;
    _debugX(UsersChangesViewV1.getClassName(), `ngOnInit`,
      {
        query: QUERY,
        this_state: this.state,
        _viewEnabled: this._viewEnabled,
      });

  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.queryState.queryType));
  }

  handleDateRangeChange(range: any) {
    _debugX(UsersChangesViewV1.getClassName(), `handleDateRangeChange`,
      {
        range,
      });

    this.queryService.setFilterItem(this.queryState.queryType, QueryServiceV1.FILTER_KEY.DATE_RANGE, range);
    this.eventsService.filterEmit(this.queryService.query(this.queryState.queryType));
  }

  handleShowTransactionEvent(event: any) {
    _debugX(UsersChangesViewV1.getClassName(), `handleTransactionRowClick`,
      {
        event,
      });

    this.usersChangesModal.show(event?.value);
  }

  handleSearchEvent(event: any) {
    _debugX(UsersChangesViewV1.getClassName(), `handleSearchChangeEvent`,
      {
        event,
      });

    this.queryService.setFilterItem(this.queryState.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.queryState.queryType));
  }

  hanleClearSearchEvent(event: any) {
    _debugX(UsersChangesViewV1.getClassName(), `hanleSearchClearEvent`,
      {
        event,
      });

    this.queryService.deleteFilterItems(this.queryState.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.queryState.queryType));
  }

  static route() {
    const RET_VAL = {
      path: 'users/changes',
      component: UsersChangesViewV1,
      data: {
        name: 'users_changes_view_v1.name',
        breadcrumb: 'users_changes_view_v1.breadcrumb',
        description: 'users_changes_view_v1.description',
        component: UsersChangesViewV1.getClassName(),
        requiresApplicationPolicy: true,

        actions: [
          {
            name: 'users_changes_view_v1.actions.export.name',
            component: 'users-changes.view.export',
            description: 'users_changes_view_v1.actions.export.description',
          },
        ]
      }
    };
    return RET_VAL;
  }
}
