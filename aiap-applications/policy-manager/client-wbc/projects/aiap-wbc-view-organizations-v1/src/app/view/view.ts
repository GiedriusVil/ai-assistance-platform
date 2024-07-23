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
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  BaseViewWbcV1,
} from 'client-shared-views';

import {
  DEFAULT_TABLE
} from 'client-utils';

import {
  OrganizationDeleteModalV1,
  OrganizationSaveModalV1,
  OrganizationsPullModalV1,
} from 'client-components';

@Component({
  selector: 'aiap-wbc-organizations-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class OrganizationsViewV1 extends BaseViewWbcV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'OrganizationsViewV1';
  }

  @ViewChild('organizationSaveModalV1') organizationSaveModalV1: OrganizationSaveModalV1;
  @ViewChild('organizationDeleteModalV1') organizationDeleteModalV1: OrganizationDeleteModalV1;
  @ViewChild('organizationsPullModalV1') organizationsPullModalV1: OrganizationsPullModalV1;


  _state: any = {
    query: {
      type: DEFAULT_TABLE.ORGANIZATIONS_V1.TYPE,
      sort: DEFAULT_TABLE.ORGANIZATIONS_V1.SORT,
    }
  };
  state = lodash.cloneDeep(this._state);

  constructor(
    // params-super
    protected notificationService: NotificationService,
    // params-native
    private queryService: QueryServiceV1,
    private eventsService: EventsServiceV1,
  ) {
    super(notificationService);
  }

  ngOnInit(): void { }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleShowOrganizationModal(event: any = undefined) {
    _debugW(OrganizationsViewV1.getClassName(), `handleShowOrganizationModal`, { event });
    this.organizationSaveModalV1.show(event?.value);
  }

  handleShowOrganizationDeleteModal(ids: any[]) {
    _debugW(OrganizationsViewV1.getClassName(), `handleShowOrganizationDeleteModal`, { ids });
    this.organizationDeleteModalV1.show(ids);
  }

  handleShowPullModal(event: any) {
    _debugW(OrganizationsViewV1.getClassName(), `handleShowPullModal`, { event });
    this.organizationsPullModalV1.show();
  }

  handleSearchChangeEvent(event: any) {
    _debugW(OrganizationsViewV1.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleSearchClearEvent(event: any) {
    _debugW(OrganizationsViewV1.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

}
