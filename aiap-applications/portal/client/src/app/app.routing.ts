/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './guards/authentication';
import { LoginViewV1 } from './views/login-view-v1/login-view-v1';
import { MainViewV1 } from './views/main-view-v1/main-view-v1';
import { AdminViewV1 } from './views/admin-view-v1';

import {
  ApplicationsViewV1,
  ApplicationsChangesViewV1,
  TenantsViewV1,
  TenantsChangesViewV1,
  AccessGroupsViewV1,
  AccessGroupsChangesViewV1,
  UsersViewV1,
  UsersChangesViewV1,
  PersonalProfileViewV1,
  WbcApplicationViewV1,
} from 'client-views';

import { UnauthorizedView } from 'client-shared-views';

const routes: Routes = [
  {
    path: 'login',
    component: LoginViewV1,
    data: { title: 'Login' }
  },
  {
    path: 'admin-view',
    component: AdminViewV1,
    children: [
      ApplicationsViewV1.route(),
      ApplicationsChangesViewV1.route(),
      TenantsViewV1.route([]),
      TenantsChangesViewV1.route(),
      AccessGroupsViewV1.route(),
      AccessGroupsChangesViewV1.route(),
      UsersViewV1.route(),
      UsersChangesViewV1.route(),
      PersonalProfileViewV1.route(),
    ],
    canActivateChild: [AuthenticationGuard],
  },
  {
    path: 'main-view-wbc',
    component: MainViewV1,
    children: [
      WbcApplicationViewV1.route(),
    ],
    canActivate: [AuthenticationGuard],
    canActivateChild: [AuthenticationGuard],
  },
  {
    path: 'main-view',
    component: MainViewV1,
    children: [
      UnauthorizedView.route(),
      {
        path: '**',
        redirectTo: 'unauthorized',
      }
    ],
    canActivate: [
      AuthenticationGuard,
    ],
    canActivateChild: [
      AuthenticationGuard,
    ],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  // otherwise redirect to home
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,
      {
        onSameUrlNavigation: 'reload',
      })
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRouting { }
