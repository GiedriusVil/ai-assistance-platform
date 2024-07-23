/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';

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
  AccessGroupsChangesModalV1,
} from '.';

@Component({
  selector: 'aiap-access-groups-changes-view-v1',
  templateUrl: './access-groups-changes-view-v1.html',
  styleUrls: ['./access-groups-changes-view-v1.scss'],
  providers: [
    StripTextPipe,
  ]
})
export class AccessGroupsChangesViewV1 extends BaseView implements OnInit, OnDestroy {

  static getClassName() {
    return 'AccessGroupsChangesViewV1';
  }

  @ViewChild('accessGroupsChangesModal') accessGroupsChangesModal: AccessGroupsChangesModalV1;

  _viewEnabled = false;

  state: any = {
    dateRange: {},
    search: '',
  }

  queryState: any = {
    queryType: DEFAULT_TABLE.ACCESS_GROUPS_CHANGES.TYPE,
    defaultSort: DEFAULT_TABLE.ACCESS_GROUPS_CHANGES.SORT,
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
    this._viewEnabled = this.configService.getConfig()?.accessGroupsChangesEnabled;

    this.queryService.setSort(this.queryState.queryType, this.queryState.defaultSort);
    const QUERY = this.queryService.query(this.queryState.queryType);
    this.state.dateRange = QUERY?.filter?.dateRange;
    this.state.search = QUERY?.filter?.search;
    _debugX(AccessGroupsChangesViewV1.getClassName(), `ngOnInit`,
      {
        query: QUERY,
        this_state: this.state
      });
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.queryState.queryType));
  }

  handleDateRangeChange(range: any) {
    _debugX(AccessGroupsChangesViewV1.getClassName(), `handleDateRangeChange`,
      {
        range,
      });

    this.queryService.setFilterItem(this.queryState.queryType, QueryServiceV1.FILTER_KEY.DATE_RANGE, range);
    this.eventsService.filterEmit(this.queryService.query(this.queryState.queryType));
  }

  handleShowTransactionEvent(event: any) {
    _debugX(AccessGroupsChangesViewV1.getClassName(), `handleTransactionRowClick`,
      {
        event,
      });

    this.accessGroupsChangesModal.show(event?.value);
  }

  handleSearchEvent(event: any) {
    _debugX(AccessGroupsChangesViewV1.getClassName(), `handleSearchChangeEvent`,
      {
        event,
      });

    this.queryService.setFilterItem(this.queryState.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.queryState.queryType));
  }

  hanleClearSearchEvent(event: any) {
    _debugX(AccessGroupsChangesViewV1.getClassName(), `hanleSearchClearEvent`,
      {
        event,
      });

    this.queryService.deleteFilterItems(this.queryState.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.queryState.queryType));
  }

  static route() {
    const RET_VAL = {
      path: 'access-groups/changes',
      component: AccessGroupsChangesViewV1,
      data: {
        name: 'access_groups_changes_view_v1.name',
        breadcrumb: 'access_groups_changes_view_v1.breadcrumb',
        description: 'access_groups_changes_view_v1.description',
        component: AccessGroupsChangesViewV1.getClassName(),
        requiresApplicationPolicy: true,
        actions: [
          {
            name: 'access_groups_changes_view_v1.actions.export.name',
            component: 'access-groups-changes.view.export',
            description: 'access_groups_changes_view_v1.actions.export.description',
          },
        ]
      }
    };
    return RET_VAL;
  }
}
