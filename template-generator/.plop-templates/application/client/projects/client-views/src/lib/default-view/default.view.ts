/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

@Component({
  selector: 'aca-default-view',
  templateUrl: './default.view.html',
  styleUrls: ['./default.view.scss'],
})
export class DefaultView {

  static getClassName() {
    return 'DefaultView';
  }

  constructor() { }

  static route() {
    const RET_VAL = {
      path: 'default',
      component: DefaultView,
      data: {
        name: 'Default',
        breadcrumb: 'Default',
        component: DefaultView.getClassName()
      }
    };
    return RET_VAL;
  }
}
