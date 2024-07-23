/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
} from 'client-shared-services';

import {
  ApplicationsViewV1,
  ApplicationsChangesViewV1,
  TenantsViewV1,
  TenantsChangesViewV1,
  AccessGroupsViewV1,
  AccessGroupsChangesViewV1,
  UsersViewV1,
  UsersChangesViewV1,
} from 'client-views';

@Injectable()
export class AdministratorServiceV1 {

  static getClassName() {
    return 'AdministratorServiceV1';
  }

  constructor(
    private router: Router,
    private sessionService: SessionServiceV1,
  ) { }

  getViews() {
    const VIEWS = [
      {
        type: 'MULTI_VIEW',
        name: 'applications_view_v1.name',
        icon: 'assets/carbon-icons/20/navigation/apps.svg',
        component: ApplicationsViewV1.getClassName(),
        views: [
          {
            type: 'SINGLE_VIEW',
            component: ApplicationsViewV1.getClassName(),
            name: 'applications_view_v1.definitions',
            icon: 'assets/carbon-icons/20/navigation/caret--right.svg',
            route: [
              'admin-view/applications'
            ]
          },
          {
            type: 'SINGLE_VIEW',
            component: ApplicationsChangesViewV1.getClassName(),
            name: 'applications_changes_view_v1.name',
            icon: 'assets/carbon-icons/20/navigation/caret--right.svg',
            route: [
              'admin-view/applications/changes',
            ]
          },
        ],
      },
      {
        type: 'MULTI_VIEW',
        name: 'tenants_view_v1.name',
        icon: 'assets/carbon-icons/20/commerce/building.svg',
        component: TenantsViewV1.getClassName(),
        views: [
          {
            type: 'SINGLE_VIEW',
            component: TenantsViewV1.getClassName(),
            name: 'tenants_view_v1.definitions',
            icon: 'assets/carbon-icons/20/navigation/caret--right.svg',
            route: [
              'admin-view/tenants'
            ]
          },
          {
            type: 'SINGLE_VIEW',
            component: TenantsChangesViewV1.getClassName(),
            name: 'tenants_changes_view_v1.name',
            icon: 'assets/carbon-icons/20/navigation/caret--right.svg',
            route: [
              'admin-view/tenants/changes'
            ]
          },
        ],
      },
      {
        type: 'MULTI_VIEW',
        name: 'access_groups_view_v1.name',
        icon: 'assets/carbon-icons/20/user/user--role.svg',
        component: AccessGroupsViewV1.getClassName(),
        views: [
          {
            type: 'SINGLE_VIEW',
            component: AccessGroupsViewV1.getClassName(),
            name: 'access_groups_view_v1.definitions',
            icon: 'assets/carbon-icons/20/navigation/caret--right.svg',
            route: [
              'admin-view/access-groups'
            ]
          },
          {
            type: 'SINGLE_VIEW',
            component: AccessGroupsChangesViewV1.getClassName(),
            name: 'access_groups_changes_view_v1.name',
            icon: 'assets/carbon-icons/20/navigation/caret--right.svg',
            route: [
              'admin-view/access-groups/changes',
            ]
          },
        ],
      },
      {
        type: 'MULTI_VIEW',
        name: 'users_view_v1.name',
        icon: 'assets/carbon-icons/20/user/user.svg',
        component: UsersViewV1.getClassName(),
        views: [
          {
            type: 'SINGLE_VIEW',
            component: UsersViewV1.getClassName(),
            name: 'users_view_v1.definitions',
            icon: 'assets/carbon-icons/20/navigation/caret--right.svg',
            route: [
              'admin-view/users'
            ]
          },
          {
            type: 'SINGLE_VIEW',
            component: UsersChangesViewV1.getClassName(),
            name: 'users_changes_view_v1.name',
            icon: 'assets/carbon-icons/20/navigation/caret--right.svg',
            route: [
              'admin-view/users/changes'
            ]
          },
        ],
      },
    ];
    const RET_VAL = VIEWS.filter(view => this.sessionService.isViewAllowed(view?.component));
    return RET_VAL;
  }

  exitAdminMode() {
    const SESSION = this.sessionService.getSession();
    let routeTo = SESSION?.application?.configuration?.route;
    if (
      lodash.isEmpty(routeTo) || !lodash.isString(routeTo)
    ) {
      routeTo = '/main-view';
    }
    _debugX(AdministratorServiceV1.getClassName(), 'authorizeSession',
      {
        routeTo,
      });

      this.router.navigateByUrl(routeTo).then(() => {
        window.location.reload();
      });
  }

}
