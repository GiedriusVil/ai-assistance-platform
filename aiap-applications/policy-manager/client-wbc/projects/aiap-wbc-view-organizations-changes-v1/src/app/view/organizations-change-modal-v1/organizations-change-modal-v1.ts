/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component } from '@angular/core';

import * as lodash from 'lodash';

import {
  JsonEditorOptions,
} from 'ang-jsoneditor';

import {
  BaseModal,
} from 'client-shared-views';

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import { LocalePipe } from 'client-shared-components';

@Component({
  selector: 'aiap-organizations-change-modal-v1',
  templateUrl: './organizations-change-modal-v1.html',
  styleUrls: ['./organizations-change-modal-v1.scss']
})
export class OrganizationsChangesModalV1 extends BaseModal {

  static getClassName() {
    return 'OrganizationsChangesModalV1';
  }

  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  isOpen = false;

  _value = {
    id: undefined,
    doc: undefined,
    docId: undefined,
    docType: undefined,
    docChanges: undefined,
    action: undefined,
    context: {
      user: {
        id: undefined,
        username: undefined
      }
    },
    timestamp: undefined,
  };

  value = lodash.cloneDeep(this._value);

  constructor(
    private localePipe: LocalePipe
  ) {
    super();
  }

  close() {
    this.isOpen = false;
  }

  show(value: any) {
    _debugW(OrganizationsChangesModalV1.getClassName(), `show`, { value });
    if (
      !lodash.isEmpty(value)
    ) {
      this.value = this._sanitizeValue(value);
    } else {
      this.value = lodash.cloneDeep(this._value);
    }
    this.isOpen = true;
  }

  _sanitizeValue(transaction: any) {
    const RET_VAL = lodash.cloneDeep(transaction);
    RET_VAL.timestamp = this.localePipe.transform(transaction.timestamp);

    return RET_VAL;
  }
}
