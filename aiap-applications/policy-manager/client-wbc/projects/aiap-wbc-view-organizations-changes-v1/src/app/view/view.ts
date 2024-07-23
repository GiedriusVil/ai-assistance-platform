/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import * as lodash from 'lodash';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugW,
} from 'client-shared-utils';

import {
  BaseViewWbcV1,
} from 'client-shared-views';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  OrganizationsChangesModalV1,
} from '.';

@Component({
  selector: 'aiap-organizations-changes-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss'],
})
export class OrganizationsChangesViewV1 extends BaseViewWbcV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'OrganizationsChangesViewV1';
  }

  @ViewChild('organizationsChangesModal') organizationsChangesModal: OrganizationsChangesModalV1;


  _state: any = {
    dateRange: {},
    query: {
      type: DEFAULT_TABLE.ORGANIZATIONS_CHANGES_V1.TYPE,
      sort: DEFAULT_TABLE.ORGANIZATIONS_CHANGES_V1.SORT,
    }
  };
  state = lodash.cloneDeep(this._state);

  constructor(
    // params-super
    protected notificationService: NotificationService,
    // params-native
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
  ) {
    super(notificationService);
  }

  ngOnInit() {
    const QUERY = this.queryService.query(this.state?.query?.type);
    this.state.dateRange = QUERY?.filter?.dateRange;
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleShowChangeEvent(event: any) {
    _debugW(OrganizationsChangesViewV1.getClassName(), `handleShowChangeEvent`, { event });
    this.organizationsChangesModal.show(event?.value);
  }

  handleSearchChangeEvent(event: any) {
    _debugW(OrganizationsChangesViewV1.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }


  handleSearchClearEvent(event: any) {
    _debugW(OrganizationsChangesViewV1.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleDateRangeChange(range: any) {
    _debugW(OrganizationsChangesViewV1.getClassName(), `handleDateRangeChange`, { range });
    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.DATE_RANGE, range);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

}
