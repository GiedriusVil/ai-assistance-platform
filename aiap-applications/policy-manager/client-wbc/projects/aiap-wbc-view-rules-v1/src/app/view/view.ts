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
} from 'client-shared-utils';

import {
  BaseViewWbcV1,
} from 'client-shared-views';

import {
  EventsServiceV1,
  QueryServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE
} from 'client-utils';

import {
  RuleSaveModalV1,
  RuleDeleteModalV1,
  RuleEnableModalV1,
} from 'client-components';

import { RulesExportModalV1 } from './rules-export-modal-v1/rules-export-modal-v1';
import { RulesPullModalV1 } from './rules-pull-modal-v1/rules-pull-modal-v1';
import { OrganizationsServiceV1 } from 'client-services';

@Component({
  selector: 'aiap-wbc-rules-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class RulesViewV1 extends BaseViewWbcV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'RulesViewV1';
  }

  @ViewChild('ruleSaveModal') ruleSaveModal: RuleSaveModalV1;
  @ViewChild('ruleDeleteModal') ruleDeleteModal: RuleDeleteModalV1;
  @ViewChild('ruleEnableModal') ruleEnableModal: RuleEnableModalV1;
  @ViewChild('rulesExportModal') rulesExportModal: RulesExportModalV1;
  @ViewChild('rulesPullModal') rulesPullModal: RulesPullModalV1;


  _state = {
    warning: false,
    query: {
      type: DEFAULT_TABLE.RULES_V1.TYPE,
      sort: DEFAULT_TABLE.RULES_V1.SORT,
    },
    buyers: [],
    buyersSelected: [],
    status: [
      {
        content: this.translateService.instant('view_rules_v1.status_filter.all'),
        value: ''
      },
      {
        content: this.translateService.instant('view_rules_v1.status_filter.enabled'),
        value: true
      },
      {
        content: this.translateService.instant('view_rules_v1.status_filter.disabled'),
        value: false
      }
    ],
    statusSelected: []
  };

  state = lodash.cloneDeep(this._state);

  constructor(
    // params-super
    protected notificationService: NotificationService,
    // params-native
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
    private organizationsService: OrganizationsServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super(notificationService);
  }

  ngOnInit(): void {

    const ORG_QUERY = {
      pagination: {
        page: 1,
        size: 99999
      },
    };

    this.organizationsService.findManyLiteByQuery(ORG_QUERY)
      .subscribe((organizations: any) => {
        this.state.buyers = organizations.items.map(this.convertOrganizationToDropdownItem);
      });

  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleShowRuleModal(event: any = undefined) {
    _debugW(RulesViewV1.getClassName(), `handleShowRuleModal`, { event });

    this.ruleSaveModal.show(event?.value);
  }

  handleShowRuleDeleteModal(ids: any[]) {
    _debugW(RulesViewV1.getClassName(), `handleShowRuleDeleteModal`, { ids });

    this.ruleDeleteModal.show(ids);
  }

  handleShowRuleEnableModal(ids: any[]) {
    _debugW(RulesViewV1.getClassName(), `handleShowRuleEnableModal`, { ids });

    this.ruleEnableModal.show(ids);
  }

  handleShowPullModal(event: any) {
    _debugW(RulesViewV1.getClassName(), `handleShowPullModal`, { event });

    this.rulesPullModal.show();
  }

  handleSearchChangeEvent(event: any) {
    _debugW(RulesViewV1.getClassName(), `handleSearchChangeEvent`, { event });

    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleSearchClearEvent(event: any) {
    _debugW(RulesViewV1.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleShowExportModal(event: any) {
    _debugW(RulesViewV1.getClassName(), `handleShowExportModal`, { event });
    this.rulesExportModal.show();
  }

  handleWarningFilterCheck(event: any) {
    _debugW(RulesViewV1.getClassName(), `handleWarningFilterCheck`, { event });

    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.IS_RULES_WITH_WARNING, event.checked);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleBuyerSelectionEvent(event) {
    _debugW(RulesViewV1.getClassName(), 'handleBuyerSelectionEvent', {
      event: event,
      this_state: this.state
    });

    this.queryService.setFilterItem(
      this.state?.query?.type,
      QueryServiceV1.FILTER_KEY.BUYER_IDS,
      this._selectedBuyersIds()
    );

    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleStatusSelectionEvent(event) {
    _debugW(RulesViewV1.getClassName(), 'handleStatusSelectionEvent', {
      event: event,
      this_state: this.state
    });

    this.queryService.setFilterItem(
      this.state?.query?.type,
      QueryServiceV1.FILTER_KEY.RULE_STATUS,
      event.item?.value
    );

    // console.log('selected status', this._selectedStatus());

    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  _selectedBuyersIds() {
    const RET_VAL = [];
    if (
      !lodash.isArray(this.state.buyersSelected) ||
      lodash.isEmpty(this.state.buyersSelected)
    ) {
      return RET_VAL;
    }

    for (const BUYER of this.state.buyersSelected) {
      if (
        !lodash.isEmpty(BUYER) &&
        BUYER.selected
      ) {
        RET_VAL.push(BUYER.value);
      }
    }

    return RET_VAL;
  }



  convertOrganizationToDropdownItem(organization) {
    const RET_VAL = {
      content: organization.name,
      value: organization.id
    };
    return RET_VAL;
  }
}
