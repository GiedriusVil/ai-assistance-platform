/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import { MainView } from './views/main-view';
import { UnauthorizedView } from 'client-shared-views';

import { ElementRoutingModule } from 'client-shared-utils';

import {
  QueriesConfigurationViewV1,
  ChartsConfigurationViewV1,
  DashboardsConfigurationViewV1,
  TilesConfigurationViewV1,
  FiltersConfigurationViewV1,
  FiltersModelsChangesViewV1,
  DashboardsModelsChangesViewV1,
  TilesModelsChangesViewV1,
  QueriesModelsChangesViewV1,
  ChartsModelsChangesViewV1,
} from 'client-views';

import {
  LiveAnalyticsViewV1,
} from 'client-shared-views';

import { Routes } from '@angular/router';


const OUTLET = 'liveAnalytics';
const ROUTES: Routes = [
  {
    path: 'main-view',
    component: MainView,
    outlet: OUTLET,
    children: [
      UnauthorizedView.route(),
      QueriesConfigurationViewV1.route([]),
      QueriesModelsChangesViewV1.route(),
      ChartsConfigurationViewV1.route([]),
      ChartsModelsChangesViewV1.route(),
      TilesConfigurationViewV1.route([]),
      TilesModelsChangesViewV1.route(),
      DashboardsConfigurationViewV1.route([]),
      DashboardsModelsChangesViewV1.route(),
      FiltersConfigurationViewV1.route([]),
      FiltersModelsChangesViewV1.route(),
      LiveAnalyticsViewV1.route(),
      { path: '**', redirectTo: 'queries-configuration' }
    ],
  },
  // otherwise redirect to home
  {
    path: '**',
    redirectTo: `/(${OUTLET}:main-view/queries-configuration)`,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [ElementRoutingModule.withRoutes(ROUTES, { onSameUrlNavigation: 'reload' })],
  exports: [ElementRoutingModule],
})
export class AppRouting { }
