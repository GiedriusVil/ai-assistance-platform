/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, Input } from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  LoginServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-header-tenants-menu-v1',
  templateUrl: './header-tenants-menu-v1.html',
  styleUrls: ['./header-tenants-menu-v1.scss'],
})
export class HeaderTenantsMenuV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'HeaderTenantsMenu';
  }

  @Input() user;

  tenants: any[];

  constructor(
    private loginService: LoginServiceV1,
  ) { }

  ngOnInit(): void {
    this.sortTenants();
  }

  ngOnDestroy(): void {
    //
  }

  sortTenants() {
    const SESSION_TENANTS = lodash.cloneDeep(this.user?.session?.accessGroup?.tenants) || [];
    const TENANTS_WITH_IDS = SESSION_TENANTS.filter(tenant => !lodash.isEmpty(tenant?.id));
    _debugX(HeaderTenantsMenuV1.getClassName(), 'sortTenants',
      {
        SESSION_TENANTS,
        TENANTS_WITH_IDS,
      });

    const MAP = { dev: 1, test: 2, uat: 3, prod: 4 };
    if (
      !lodash.isEmpty(TENANTS_WITH_IDS)
    ) {
      TENANTS_WITH_IDS.sort((a, b) => a?.name > b?.name ? 1 : -1);
      TENANTS_WITH_IDS.sort((a, b) => MAP[a?.environment?.id] - MAP[b?.environment?.id]);
    }
    this.tenants = TENANTS_WITH_IDS;
  }

  handleTenantAuthorizationEvent(tenant) {
    const APPLICATION = this.user?.session?.application;
    _debugX(HeaderTenantsMenuV1.getClassName(), 'handleTenantAuthorizationEvent',
      {
        tenant,
        APPLICATION,
      });

    this.loginService.authorizeSession(tenant, APPLICATION);
  }

}
