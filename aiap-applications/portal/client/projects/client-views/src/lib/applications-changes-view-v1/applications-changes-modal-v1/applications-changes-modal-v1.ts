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
  selector: 'aiap-applications-changes-modal-v1',
  templateUrl: './applications-changes-modal-v1.html',
  styleUrls: ['./applications-changes-modal-v1.scss']
})
export class ApplicationsChangesModalV1 extends BaseModal implements OnInit {

  static getClassName() {
    return 'ApplicationsChangesModalV1';
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
    _debugX(ApplicationsChangesModalV1.getClassName(), `show`,
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
