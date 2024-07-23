/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
} from 'client-shared-services';

import {
  LoginServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-header-applications-menu-v1',
  templateUrl: './header-applications-menu-v1.html',
  styleUrls: ['./header-applications-menu-v1.scss'],
})
export class HeaderApplicationsMenuV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'HeaderApplicationsMenuV1';
  }

  @Input() user;

  applications: any = [];

  constructor(
    protected sessionService: SessionServiceV1,
    protected loginService: LoginServiceV1,
  ) { }

  get allowed(): boolean {
    return lodash.isEmpty(this.applications);
  }

  get applicationName(): string {
    if (
      lodash.isEmpty(this.applications)
    ) {
      return 'No application authorized';
    }

    const APPLICATION = this.getSelectedApplication();
    if (
      lodash.isEmpty(APPLICATION) || lodash.isEmpty(APPLICATION.name)
    ) {
      return 'Select application';
    }
    return APPLICATION.name;
  }

  private getAvailableApplications() {
    const SESSION = this.sessionService.getSession();
    if (!lodash.isEmpty(SESSION)) {
      const APPLICATIONS = SESSION?.tenant?.applications;
      const APPLICATIONS_AVAILABLE_FOR_USER = [];
      if (!lodash.isEmpty(APPLICATIONS)) {
        _debugX(HeaderApplicationsMenuV1.getClassName(), `availableApplications`,
          {
            APPLICATIONS
          });
        for (const APPLICATION of APPLICATIONS) {
          const AVAILABLE_FOR_USER = this.checkIfApplicationAvailableForUser(APPLICATION);
          if (AVAILABLE_FOR_USER) {
            APPLICATIONS_AVAILABLE_FOR_USER.push(APPLICATION);
          }
        }
        return APPLICATIONS_AVAILABLE_FOR_USER;
      }
    }

    return [];
  }

  private getSelectedApplication() {
    const SESSION = this.sessionService.getSession();
    if (!lodash.isEmpty(SESSION)) {
      const APPLICATION = ramda.path(['application'], SESSION);
      if (!lodash.isEmpty(APPLICATION)) {
        return APPLICATION;
      }
    }

    return null;
  }

  ngOnInit() {
    this.applications = this.getAvailableApplications();
  }

  checkIfApplicationAvailableForUser(application) {
    let retVal = false;
    const TENANT_ID = this.user?.session?.tenant?.id;
    const ACCESS_GROUP_TENANTS = this.user?.session?.accessGroup?.tenants;
    if (
      lodash.isArray(ACCESS_GROUP_TENANTS) &&
      !lodash.isEmpty(ACCESS_GROUP_TENANTS)
    ) {
      const SELECTED_ACCESS_GROUP_TENANT = ACCESS_GROUP_TENANTS.find((tenant) => tenant.id === TENANT_ID);
      const SELECTED_ACCESS_GROUP_TENANT_APPLICATIONS = SELECTED_ACCESS_GROUP_TENANT?.applications;
      if (!lodash.isEmpty(SELECTED_ACCESS_GROUP_TENANT_APPLICATIONS)) {
        retVal = SELECTED_ACCESS_GROUP_TENANT_APPLICATIONS.some((availableApplication) => availableApplication.id === application.id)
      }
    }
    return retVal;
  }

  ngOnDestroy() {
    //
  }

  ngAfterViewInit() {
    //
  }

  handleApplicationAuthorizationEvent(application: any) {
    const TENANT = this.user?.session?.tenant;
    _debugX(HeaderApplicationsMenuV1.getClassName(), `handleApplicationAuthorizationEvent`, { TENANT, application });
    this.loginService.authorizeSession(TENANT, application);
  }
}
