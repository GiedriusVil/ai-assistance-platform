/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, Input } from '@angular/core';

import * as lodash from 'lodash';

import {
  SessionServiceV1,
  ConfigServiceV1
} from 'client-shared-services';

import {
  AdministratorServiceV1,
} from '../../../services';

@Component({
  selector: 'aiap-header-admin-menu-v1',
  templateUrl: './header-admin-menu-v1.html',
  styleUrls: ['./header-admin-menu-v1.scss']
})
export class HeaderAdminMenuV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'HeaderAdminMenuV1';
  }

  @Input() user;

  views: any[] = [];

  _state = {
    isAtLeastOneViewEnabled: false,
  };
  state = lodash.cloneDeep(this._state);

  constructor(
    private configService: ConfigServiceV1,
    private sessionService: SessionServiceV1,
    private administratorService: AdministratorServiceV1,
  ) { }

  ngOnInit(): void {
    this.views = this.administratorService.getViews();
    const NEW_STATE = lodash.cloneDeep(this.state);
    NEW_STATE.isAtLeastOneViewEnabled = this.isAtLeastOneViewEnabled();
    this.state = NEW_STATE;
  }

  ngOnDestroy(): void {
    //
  }

  isAtLeastOneViewEnabled() {
    let retVal = false;
    const FLAT_VIEWS = [];
    this.views?.forEach((view: any) => {
      const CHILD_VIEWS = view?.views;
      if (lodash.isEmpty(CHILD_VIEWS)) {
        FLAT_VIEWS.push(view);
      } else {
        FLAT_VIEWS.push(...CHILD_VIEWS)
      }
    });
    if (
      lodash.isArray(FLAT_VIEWS) &&
      !lodash.isEmpty(FLAT_VIEWS)
    ) {
      for (const VIEW of FLAT_VIEWS) {
        if (
          lodash.isString(VIEW?.component) &&
          !lodash.isEmpty(VIEW?.component) &&
          this.sessionService.isViewAllowed(VIEW.component)
        ) {
          retVal = true;
          break;
        }
      }
    }
    return retVal;
  }

}
