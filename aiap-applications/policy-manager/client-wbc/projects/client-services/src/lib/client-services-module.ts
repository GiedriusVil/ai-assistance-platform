/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import { ClientUtilsModule } from 'client-utils';

import {
  ChartServiceV1,
  ClientSideDownloadServiceV1,
  DataExportServiceV1,
  DocValidationMetricsServiceV1,
  DocValidationMetricsServiceV2,
  DocValidationsServiceV1,
  DocValidationsServiceV2,
  EventsServiceV1,
  HTMLDependenciesServiceV1,
  OrganizationsChangesServiceV1,
  OrganizationsImportServiceV1,
  OrganizationsServiceV1,
  ReportsChartsServiceV1,
  ReportsDataServiceV1,
  ReportsTransformServiceV1,
  RuleActionsChangesServiceV1,
  RuleActionsServiceV1,
  RuleMessagesChangesServiceV1,
  RuleMessagesImportServiceV1,
  RuleMessagesServiceV1,
  RulesChangesServiceV1,
  RulesChangesServiceV2,
  RulesConditionsServiceV2,
  RulesImportServiceV1,
  RulesServiceV1,
  RulesServiceV2,
  ValidationEngagementsChangesServiceV1,
  ValidationEngagementsServiceV1,
} from './services';

@NgModule({
  declarations: [],
  imports: [
    ClientUtilsModule,
  ],
  providers: [
    ChartServiceV1,
    ClientSideDownloadServiceV1,
    DataExportServiceV1,
    DocValidationMetricsServiceV1,
    DocValidationMetricsServiceV2,
    DocValidationsServiceV1,
    DocValidationsServiceV2,
    EventsServiceV1,
    HTMLDependenciesServiceV1,
    OrganizationsChangesServiceV1,
    OrganizationsImportServiceV1,
    OrganizationsServiceV1,
    ReportsChartsServiceV1,
    ReportsDataServiceV1,
    ReportsTransformServiceV1,
    RuleActionsChangesServiceV1,
    RuleActionsServiceV1,
    RuleMessagesChangesServiceV1,
    RuleMessagesImportServiceV1,
    RuleMessagesServiceV1,
    RulesChangesServiceV1,
    RulesChangesServiceV2,
    RulesConditionsServiceV2,
    RulesImportServiceV1,
    RulesServiceV1,
    RulesServiceV2,
    ValidationEngagementsChangesServiceV1,
    ValidationEngagementsServiceV1,
  ],
  exports: []
})
export class ClientServicesModule { }
