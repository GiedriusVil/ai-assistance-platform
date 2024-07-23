/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
} from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  JsonEditorOptions,
} from 'ang-jsoneditor';

import {
  BaseModal,
} from 'client-shared-views';

@Component({
  selector: 'aiap-engagement-changes-view-modal-v1',
  templateUrl: './engagement-changes-view-modal-v1.html',
  styleUrls: ['./engagement-changes-view-modal-v1.scss']
})
export class EngagementChangesViewModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'EngagementChangesViewModalV1';
  }

  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  _transaction: any = {
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
  transaction = lodash.cloneDeep(this._transaction);

  constructor() {
    super();
  }

  ngOnInit() {
    this.jsonEditorOptions.name = 'transaction';
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    //
  }

  show(transaction: any) {
    _debugX(EngagementChangesViewModalV1.getClassName(), `show`,
      {
        transaction,
      });

    if (
      !lodash.isEmpty(transaction)
    ) {
      this.transaction = lodash.cloneDeep(transaction);
    } else {
      this.transaction = lodash.cloneDeep(this._transaction);
    }
    this.superShow();
  }
}
