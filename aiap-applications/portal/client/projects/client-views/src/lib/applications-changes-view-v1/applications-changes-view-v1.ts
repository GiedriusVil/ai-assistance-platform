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
  ApplicationsChangesModalV1,
} from '.';

@Component({
  selector: 'aiap-applications-changes-view-v1',
  templateUrl: './applications-changes-view-v1.html',
  styleUrls: ['./applications-changes-view-v1.scss'],
  providers: [
    StripTextPipe,
  ]
})
export class ApplicationsChangesViewV1 extends BaseView implements OnInit, OnDestroy {

  static getClassName() {
    return 'ApplicationsChangesViewV1';
  }

  @ViewChild('applicationsChangesModal') applicationsChangesModal: ApplicationsChangesModalV1;

  _viewEnabled = false;

  state: any = {
    dateRange: {},
    search: '',
  }

  queryState: any = {
    queryType: DEFAULT_TABLE.APPLICATIONS_CHANGES.TYPE,
    defaultSort: DEFAULT_TABLE.APPLICATIONS_CHANGES.SORT,
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
    this._viewEnabled = this.configService.getConfig()?.applicationsChangesEnabled;

    this.queryService.setSort(this.queryState.queryType, this.queryState.defaultSort);
    const QUERY = this.queryService.query(this.queryState.queryType);
    this.state.dateRange = QUERY?.filter?.dateRange;
    this.state.search = QUERY?.filter?.search;
    _debugX(ApplicationsChangesViewV1.getClassName(), `ngOnInit`,
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
    _debugX(ApplicationsChangesViewV1.getClassName(), `handleDateRangeChange`,
      {
        range,
      });

    this.queryService.setFilterItem(this.queryState.queryType, QueryServiceV1.FILTER_KEY.DATE_RANGE, range);
    this.eventsService.filterEmit(this.queryService.query(this.queryState.queryType));
  }

  handleShowTransactionEvent(event: any) {
    _debugX(ApplicationsChangesViewV1.getClassName(), `handleTransactionRowClick`,
      {
        event,
      });

    this.applicationsChangesModal.show(event?.value);
  }

  handleSearchEvent(event: any) {
    _debugX(ApplicationsChangesViewV1.getClassName(), `handleSearchChangeEvent`,
      {
        event,
      });

    this.queryService.setFilterItem(this.queryState.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.queryState.queryType));
  }

  hanleClearSearchEvent(event: any) {
    _debugX(ApplicationsChangesViewV1.getClassName(), `hanleSearchClearEvent`,
      {
        event,
      });
    this.queryService.deleteFilterItems(this.queryState.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.queryState.queryType));
  }

  static route() {
    const RET_VAL = {
      path: 'applications/changes',
      component: ApplicationsChangesViewV1,
      data: {
        name: 'applications_changes_view_v1.name',
        breadcrumb: 'applications_changes_view_v1.breadcrumb',
        description: 'applications_changes_view_v1.description',
        component: ApplicationsChangesViewV1.getClassName(),
        requiresApplicationPolicy: true,
        actions: [
          {
            name: 'applications_changes_view_v1.actions.export.name',
            component: 'applications-changes.view.export',
            description: 'applications_changes_view_v1.actions.export.description',
          },
        ]
      }
    };
    return RET_VAL;
  }
}
