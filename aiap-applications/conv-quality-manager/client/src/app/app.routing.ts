/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

import { ElementRoutingModule } from 'client-shared-utils';

import { MainView } from './views/main-view';

import {
  TestWorkersViewV1,
  TestCasesViewV1,
  TestExecutionsViewV1,
} from 'client-views';

const OUTLET = 'acaConvQualityManager';
const ROUTES: Routes = [
  {
    path: 'main-view',
    component: MainView,
    outlet: OUTLET,
    children: [
      TestWorkersViewV1.route(),
      TestCasesViewV1.route(),
      TestExecutionsViewV1.route(),
      { path: '**', redirectTo: `/test-workers` }
    ]
  },
  {
    path: '**',
    redirectTo: `/(${OUTLET}:main-view/test-workers)`,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [ElementRoutingModule.withRoutes(ROUTES, { onSameUrlNavigation: 'reload' })],
  exports: [ElementRoutingModule],
})
export class AppRouting { }
