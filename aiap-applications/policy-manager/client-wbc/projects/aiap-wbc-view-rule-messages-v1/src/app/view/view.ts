/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

import * as lodash from 'lodash';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  BaseViewWbcV1,
} from 'client-shared-views';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  RuleMessageDeleteModalV1,
  RuleMessagePullModalV1,
  RuleMessageSaveModalV1,
} from 'client-components'

@Component({
  selector: 'aiap-wbc-rule-messages-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class RuleMessagesViewV1 extends BaseViewWbcV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'RuleMessagesViewV1';
  }

  @ViewChild('deleteModal') deleteModal: RuleMessageDeleteModalV1;
  @ViewChild('pullModal') pullModal: RuleMessagePullModalV1;
  @ViewChild('saveModal') saveModal: RuleMessageSaveModalV1;

  _state: any = {
    search: '',
    query: {
      type: DEFAULT_TABLE.RULE_MESSAGES_V1.TYPE,
      sort: DEFAULT_TABLE.RULE_MESSAGES_V1.SORT,
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

  ngOnInit(): void {
    const QUERY = this.queryService.query(this.state?.query?.type);

    this.state.search = QUERY?.filter?.search || '';
    _debugW(RuleMessagesViewV1.getClassName(), `ngOnInit`, {
      query: QUERY,
      this_state: this.state
    });
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleSearchChangeEvent(event: any) {
    _debugW(RuleMessagesViewV1.getClassName(), `handleSearchChangeEvent`,
      {
        event
      });

    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleSearchClearEvent(event: any) {
    _debugW(RuleMessagesViewV1.getClassName(), `handleSearchClearEvent`,
      {
        event
      });

    this.queryService.deleteFilterItems(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleShowMessageDeleteModal(ids: any[]) {
    _debugW(RuleMessagesViewV1.getClassName(), `handleShowMessageDeleteModal`,
      {
        ids
      });

    this.deleteModal.show(ids);
  }

  handleShowPullModal(event: any) {
    _debugW(RuleMessagesViewV1.getClassName(), `handleShowPullModal`,
      {
        event
      });

    this.pullModal.show();
  }

  handleShowMessageModal(event: any = undefined) {
    _debugW(RuleMessagesViewV1.getClassName(), `handleShowMessageModal`,
      {
        event
      });

    this.saveModal.show(event?.value);
  }

}
