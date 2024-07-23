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
  selector: 'aiap-wbc-validation-engagements-changes-modal-v1',
  templateUrl: './validation-engagements-changes-modal-v1.html',
  styleUrls: ['./validation-engagements-changes-modal-v1.scss']
})
export class ValidationEngagementsChangesModalV1 extends BaseModal implements OnInit {

  static getClassName() {
    return 'ValidationEngagementsChangesModalV1';
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
    engagementKey: undefined,
    action: undefined,
  };
  changeLog = lodash.cloneDeep(this._changeLog);

  constructor() {
    super();
  }

  ngOnInit() { }

  show(changeLog: any) {
    _debugW(ValidationEngagementsChangesModalV1.getClassName(), this.show.name, { changeLog });
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
