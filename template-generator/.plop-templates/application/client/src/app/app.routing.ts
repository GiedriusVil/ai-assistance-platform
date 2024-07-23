/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import { MainView } from './views/main-view';

import {
  DefaultView,
} from 'aca-client-views';

import { ElementRoutingModule } from 'client-shared-utils';

import { Routes } from '@angular/router';

const OUTLET = '{{camelCase name}}';
const ROUTES: Routes = [
  {
    path: 'main-view',
    component: MainView,
    outlet: OUTLET,
    children: [
      // Application view
      DefaultView.route(),

      { path: '**', redirectTo: 'default' }
    ],
  },
  // otherwise redirect to home
  {
    path: '**',
    redirectTo: `/(${OUTLET}:main-view/default`,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [ElementRoutingModule.withRoutes(ROUTES, { onSameUrlNavigation: 'reload' })],
  exports: [ElementRoutingModule],
})
export class AppRouting { }
