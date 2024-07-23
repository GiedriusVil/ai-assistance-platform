/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

import {
  ElementRoutingModule,
} from 'client-shared-utils';

import {
  LiveAnalyticsViewV1,
  LiveAnalyticsViewV2,
  UnauthorizedView,
} from 'client-shared-views';

import { OUTLETS } from 'client-utils';

import {
  TranscriptViewV1,
  ConversationsViewV1,
  UtterancesViewV1,
  SurveysViewV1,
  LiveMetricsView,
  TopicModelingViewV1
} from 'client-views';

import { MainView } from './views/main-view';

const OUTLET = OUTLETS.convInsights;

const ROUTES: Routes = [
  {
    path: 'main-view',
    component: MainView,
    outlet: OUTLET,
    children: [
      UnauthorizedView.route(),
      LiveMetricsView.route(),
      ConversationsViewV1.route([TranscriptViewV1.route([])]),
      UtterancesViewV1.route([TranscriptViewV1.route([])]),
      SurveysViewV1.route([TranscriptViewV1.route([])]),
      LiveAnalyticsViewV1.route(),
      LiveAnalyticsViewV2.route(),
      TopicModelingViewV1.route([]),
      // ,
      { path: '**', redirectTo: 'conversations-view-v1' }
    ],
  },
  // otherwise redirect to home
  {
    path: '**',
    redirectTo: `/(${OUTLET}:main-view/conversations-view-v1)`,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [ElementRoutingModule.withRoutes(ROUTES, { onSameUrlNavigation: 'reload' })],
  exports: [ElementRoutingModule],
})
export class AppRouting { }
