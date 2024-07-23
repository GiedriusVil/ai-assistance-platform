/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy } from '@angular/core';

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

@Component({
  selector: 'aiap-wbc-template-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class TemplateViewV1 extends BaseViewWbcV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'TemplateViewV1';
  }

  _state: any = {
    query: {
      type: undefined,
      sort: undefined,
    }
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

}
