/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { LazyElementsModule } from '@angular-extensions/elements';

import { ClientSharedUtilsModule } from 'client-shared-utils';
import { ClientSharedServicesModule } from 'client-shared-services'
import { ClientSharedComponentsModule } from 'client-shared-components';

import { ClientUtilsModule } from 'client-utils';
import { ClientServicesModule } from 'client-services';

import {
  DatePickerV1,
} from './date-pickers';

import { DifferencesTableV1 } from './difference-tables';
import { DocValidationsModule } from './doc-validations';
import { OrganizationsModule } from './organizations';
import { ReportChartsModule } from './report-charts';
import { RuleActionsModule } from './rule-actions';
import { RuleMessagesModule } from './rule-messages';
import { RulesModule } from './rules';
import { CarbonFrameworkModule } from './carbon-framework-module';
import { ValidationEngagementsModule } from './validation-engagements';

@NgModule({
  declarations: [
    DatePickerV1,
    DifferencesTableV1,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    LazyElementsModule,
    ClientSharedUtilsModule,
    ClientSharedServicesModule,
    ClientSharedComponentsModule,
    ClientUtilsModule,
    ClientServicesModule,
    CarbonFrameworkModule,
    // doc-validations
    DocValidationsModule,
    // organizations
    OrganizationsModule,
    // report-charts
    ReportChartsModule,
    // rule-actions
    RuleActionsModule,
    // rule-messages
    RuleMessagesModule,
    // rules
    RulesModule,
    // validation-engagements
    ValidationEngagementsModule,
  ],
  exports: [
    // date-pickers
    DatePickerV1,
    // difference-tables
    DifferencesTableV1,
    // doc-validations
    DocValidationsModule,
    // organizations
    OrganizationsModule,
    // report-charts
    ReportChartsModule,
    // rule-actions
    RuleActionsModule,
    // rule-messages
    RuleMessagesModule,
    // rules
    RulesModule,
    // validation-engagements
    ValidationEngagementsModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ClientComponentsModule { }
