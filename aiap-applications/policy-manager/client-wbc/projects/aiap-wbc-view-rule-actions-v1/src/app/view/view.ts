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
  DEFAULT_TABLE,
} from 'client-utils';

import { RuleActionsDeleteModalV1 } from './rule-actions-delete-modal-v1/rule-actions-delete-modal-v1';
import { RuleActionsImportModalV1 } from './rule-actions-import-modal-v1/rule-actions-import-modal-v1';
import { RuleActionsSaveModalV1 } from './rule-actions-save-modal-v1/rule-actions-save-modal-v1';

@Component({
  selector: 'aiap-wbc-rule-actions-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class RuleActionsViewV1 extends BaseViewWbcV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'RuleActionsViewV1';
  }

  @ViewChild('ruleActionsDeleteModal') ruleActionsDeleteModal: RuleActionsDeleteModalV1;
  @ViewChild('ruleActionsImportModal') ruleActionsImportModal: RuleActionsImportModalV1;
  @ViewChild('ruleActionsSaveModal') ruleActionsSaveModal: RuleActionsSaveModalV1;

  _state: any = {
    query: {
      type: DEFAULT_TABLE.RULE_ACTIONS_V1.TYPE,
      sort: DEFAULT_TABLE.RULE_ACTIONS_V1.SORT,
    },
    showIneffective: false,
    showExpired: false,
  };
  state = lodash.cloneDeep(this._state);

  constructor(
    // params-super
    protected notificationService: NotificationService,
    // params-native
  ) {
    super(notificationService);
  }

  ngOnInit(): void { }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleShowRuleActionsDeleteModal(actionsIds): void {
    _debugW(RuleActionsViewV1.getClassName(), 'handleShowRuleActionsDeleteModal', { actionsIds });
    this.ruleActionsDeleteModal.show(actionsIds);
  }

  handleShowRuleActionsImportModal() {
    _debugW(RuleActionsViewV1.getClassName(), 'handleShowRuleActionsImportModal', {});
    this.ruleActionsImportModal.show();
  }

  handleShowRuleActionsSaveModal(event: any = undefined): void {
    const RULE_ACTION_ID = event?.value?.id;
    _debugW(RuleActionsViewV1.getClassName(), 'handleShowRuleActionsSaveModal', { event, RULE_ACTION_ID });
    this.ruleActionsSaveModal.show(RULE_ACTION_ID);
  }

}
