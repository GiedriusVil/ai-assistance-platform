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
  selector: 'aiap-access-groups-changes-modal-v1',
  templateUrl: './access-groups-changes-modal-v1.html',
  styleUrls: ['./access-groups-changes-modal-v1.scss']
})
export class AccessGroupsChangesModalV1 extends BaseModal implements OnInit {

  static getClassName() {
    return 'AccessGroupsChangesModalV1';
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
    _debugX(AccessGroupsChangesModalV1.getClassName(), `show`,
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
