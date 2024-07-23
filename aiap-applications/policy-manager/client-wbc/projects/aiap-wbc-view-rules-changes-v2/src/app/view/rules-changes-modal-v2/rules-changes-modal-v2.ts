/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit } from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugW,
} from 'client-shared-utils';

import {
  BaseModal,
} from 'client-shared-views';

@Component({
  selector: 'aiap-wbc-rules-changes-modal-v2',
  templateUrl: './rules-changes-modal-v2.html',
  styleUrls: ['./rules-changes-modal-v2.scss']
})
export class RulesChangesModalV2 extends BaseModal implements OnInit {

  static getClassName() {
    return 'RulesChangesModalV2';
  }

  _changeLog: any = {
    id: undefined,
    docType: undefined,
    created: {
      user: {
        id: undefined,
        name: undefined,
      },
      date: undefined,
    },
    ruleKey: undefined,
    action: undefined,
  };
  changeLog = lodash.cloneDeep(this._changeLog);

  constructor() {
    super();
  }

  ngOnInit() { }

  show(changeLog: any) {
    _debugW(RulesChangesModalV2.getClassName(), this.show.name, { changeLog });
    if (
      !lodash.isEmpty(changeLog)
    ) {
      this.changeLog = lodash.cloneDeep(changeLog);
    } else {
      this.changeLog = lodash.cloneDeep(this._changeLog);
    }
    this.superShow();
  }
}
