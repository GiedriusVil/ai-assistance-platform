/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

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

import {
  RulesSaveModalV2,
  RulesDeleteModalV2,
  RulesImportModalV2,
} from '.';

@Component({
  selector: 'aiap-wbc-rules-view-v2',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class RulesViewV2 extends BaseViewWbcV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'RulesViewV2';
  }

  @ViewChild('rulesSaveModalV2') rulesSaveModalV2: RulesSaveModalV2;
  @ViewChild('rulesDeleteModalV2') rulesDeleteModalV2: RulesDeleteModalV2;
  @ViewChild('rulesImportModalV2') rulesImportModalV2: RulesImportModalV2;

  selectedRulesV2: any[] = [];

  queryState: any = {
    queryType: DEFAULT_TABLE.RULES_V2.TYPE,
    defaultSort: DEFAULT_TABLE.RULES_V2.SORT,
  };

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



  handleShowRulesV2SaveModal(event: any = undefined): void {
    const RULE_V2_ID = event?.value?.id;
    _debugW(RulesViewV2.getClassName(), `handleShowRulesV2SaveModal`, { event, RULE_V2_ID });
    this.rulesSaveModalV2.show(RULE_V2_ID);
  }

  handleShowRulesV2DeleteModal(rulesV2Ids: string[]) {
    _debugW(RulesViewV2.getClassName(), `handleShowRulesV2DeleteModal`, { rulesV2Ids });
    this.rulesDeleteModalV2.show(rulesV2Ids);
  }

  handleShowImportModal() {
    _debugW(RulesViewV2.getClassName(), `handleShowImportView`, {});
    this.rulesImportModalV2.show();
  }

}
