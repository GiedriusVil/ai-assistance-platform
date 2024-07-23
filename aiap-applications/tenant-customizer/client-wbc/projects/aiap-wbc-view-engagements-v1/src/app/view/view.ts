/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import {
  _debugX,
  _error,
  _info
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
  OUTLETS,
} from 'client-utils';

import { BaseViewV1 } from 'client-shared-views';

import * as ramda from 'ramda';
import {
  EngagementDeleteModalV1,
  EngagementImportModalV1,
  EngagementSaveModalV1
} from '../components';

@Component({
  selector: 'aiap-engagements-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss'],
})
export class EngagementsViewV1 extends BaseViewV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'EngagementsViewV1';
  }

  @ViewChild('engagementDeleteModal') engagementDeleteModal: EngagementDeleteModalV1;
  @ViewChild('engagementImportModal') engagementImportModal: EngagementImportModalV1;
  @ViewChild('engagementSaveModal') engagementSaveModal: EngagementSaveModalV1;

  outlet = OUTLETS.tenantCustomizer;

  state: any = {
    queryType: DEFAULT_TABLE.ENGAGEMENTS_V1.TYPE,
    defaultSort: DEFAULT_TABLE.ENGAGEMENTS_V1.SORT
  };

  constructor(
    private activatedRouter: ActivatedRoute,
    private queryService: QueryServiceV1,
    private eventsService: EventsServiceV1,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleEngagementSaveModal(engagement: any = undefined): void {
    _debugX(EngagementsViewV1.getClassName(), `handleEngagementSaveModal`, { engagement });
    const ENGAGEMENT_ID = ramda.path(['id'], engagement?.value);
    this.engagementSaveModal.show(ENGAGEMENT_ID);
  }

  handleApplicationdeleteModal(applicationsIds: any = undefined): void {
    _debugX(EngagementsViewV1.getClassName(), `handleShowDeleteModal`, { event });
    this.engagementDeleteModal.show(applicationsIds);
  }

  handleSearchClearEvent(event: any) {
    _debugX(EngagementsViewV1.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchChangeEvent(event: any) {
    _debugX(EngagementsViewV1.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleShowImportQueue(event: any) {
    _debugX(EngagementsViewV1.getClassName(), `handleShowImportQueue`, { event });
    this.engagementImportModal.show();
  }

}
