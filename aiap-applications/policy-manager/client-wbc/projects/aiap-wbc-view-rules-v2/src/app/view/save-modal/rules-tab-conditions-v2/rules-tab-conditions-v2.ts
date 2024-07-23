/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild } from '@angular/core';

import {
  _debugW,
} from 'client-shared-utils';

import {
  BaseTabV1,
} from 'client-shared-components';

import {
  RulesConditionsTableV2,
} from '../../../components';

import {
  RulesConditionsSaveModalV2,
  RulesConditionsDeleteModalV2,
} from '..';

@Component({
  selector: 'aiap-rules-tab-conditions-v2',
  templateUrl: './rules-tab-conditions-v2.html',
  styleUrls: ['./rules-tab-conditions-v2.scss']
})
export class RulesTabConditionsV2 extends BaseTabV1 implements OnInit {

  static getClassName() {
    return 'RulesTabConditionsV2';
  }

  @ViewChild('rulesConditionsTableV2') rulesConditionsTableV2: RulesConditionsTableV2;
  @ViewChild('rulesConditionsSaveModalV2') rulesConditionsSaveModalV2: RulesConditionsSaveModalV2;
  @ViewChild('rulesConditionsDeleteModalV2') rulesConditionsDeleteModalV2: RulesConditionsDeleteModalV2;

  constructor() {
    super();
  }

  ngOnInit(): void { }

  updateTabData(validationEngagementId: string) {
    this.rulesConditionsTableV2.refreshTable();
    this.rulesConditionsSaveModalV2.updateValidationEngagementPaths(validationEngagementId);
  }

  handleShowRulesV2ConditionsSaveModal(event: any = undefined) {
    const RULE_ID = this.value?.id;
    const CONDITION_ID = event?.value?.id;
    _debugW(
      RulesTabConditionsV2.getClassName(),
      'handleShowRulesV2ConditionsSaveModal',
      {
        event,
        RULE_ID,
        CONDITION_ID,
      });

    this.rulesConditionsSaveModalV2.show(RULE_ID, CONDITION_ID);
  }

  handleShowRulesV2ConditionsDeleteModal(conditions: any): void {
    _debugW(RulesTabConditionsV2.getClassName(), 'handleShowRulesV2ConditionsDeleteModal', { conditions });
    this.rulesConditionsDeleteModalV2.show(conditions);
  }
}
