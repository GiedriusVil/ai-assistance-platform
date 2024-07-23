/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit } from '@angular/core';

import * as lodash from 'lodash';

import {
  BaseModal,
} from 'client-shared-views';

import {
  _debugX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-tenants-changes-modal-v1',
  templateUrl: './tenants-changes-modal-v1.html',
  styleUrls: ['./tenants-changes-modal-v1.scss']
})
export class TenantsChangesModalV1 extends BaseModal implements OnInit {

  static getClassName() {
    return 'TenantsChangesModalV1';
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
    docId: undefined,
    action: undefined,
  };
  changeLog = lodash.cloneDeep(this._changeLog);

  constructor() {
    super();
  }

  ngOnInit() {
    //
  }

  show(changeLog: any) {
    _debugX(TenantsChangesModalV1.getClassName(), `show`,
      {
        changeLog,
      });

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
