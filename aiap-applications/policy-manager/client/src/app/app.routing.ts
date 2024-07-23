/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

import { AuthenticationGuard } from './guards/authentication';

import { ElementRoutingModule } from 'client-shared-utils';

import { MainView } from './views/main-view/main-view';

import {
  // doc-validations-view
  DocValidationMetricsViewV2,
  DocValidationMetricsViewV1,
  DocValidationsViewV1,
  DocValidationsViewV2,

  // home-view-v1
  HomeViewV1,

  // organizations-views
  OrganizationsChangesViewV1,
  OrganizationsImportViewV1,
  OrganizationsViewV1,

  // rules-views
  RuleActionsChangesViewV1,
  RuleActionsViewV1,
  RuleMessagesChangesViewV1,
  RuleMessagesImportViewV1,
  RuleMessagesViewV1,
  RulesChangesViewV1,
  RulesChangesViewV2,
  RulesImportViewV1,
  RulesViewV1,
  RulesViewV2,

  // validation-engagements-views
  ValidationEngagementsChangesViewV1,
  ValidationEngagementsViewV1,
} from 'client-views';

import {
  LiveAnalyticsViewV1,
} from 'client-shared-views';

import { OUTLETS } from 'client-utils';

const OUTLET = OUTLETS.policyManager;
const ROUTES: Routes = [
  {
    path: 'main-view',
    component: MainView,
    outlet: OUTLET,
    children: [
      // doc-validations-views
      DocValidationMetricsViewV1.route(),
      DocValidationMetricsViewV2.route(),
      DocValidationsViewV1.route(),
      DocValidationsViewV2.route(),

      // home-view-v1
      HomeViewV1.route(),

      // organizations-views
      OrganizationsChangesViewV1.route(),
      OrganizationsImportViewV1.route(),
      OrganizationsViewV1.route(),

      // rules-views
      RuleActionsChangesViewV1.route(),
      RuleActionsViewV1.route(),
      RuleMessagesChangesViewV1.route(),
      RuleMessagesImportViewV1.route(),
      RuleMessagesViewV1.route(),
      RulesChangesViewV1.route(),
      RulesChangesViewV2.route(),
      RulesImportViewV1.route(),
      RulesViewV1.route(),
      RulesViewV2.route(),

      // validation-engagements-views
      ValidationEngagementsViewV1.route(),
      ValidationEngagementsChangesViewV1.route(),

      // live-analytics-view-v1
      LiveAnalyticsViewV1.route(),
      { path: '**', redirectTo: `` }
    ],
    // canActivate: [AuthenticationGuard],
    // canActivateChild: [AuthenticationGuard],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  { path: '**', redirectTo: `/(${OUTLET}:main-view)`, pathMatch: 'full' }
];

@NgModule({
  imports: [
    ElementRoutingModule.withRoutes(ROUTES, { onSameUrlNavigation: 'reload' }),
  ],
  exports: [
    ElementRoutingModule,
  ],
})
export class AppRouting { }
