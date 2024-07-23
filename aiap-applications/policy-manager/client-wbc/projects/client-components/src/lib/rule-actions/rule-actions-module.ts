/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { LazyElementsModule } from '@angular-extensions/elements';

import {
  CarbonFrameworkModule,
} from '../carbon-framework-module';

import { ClientSharedUtilsModule } from 'client-shared-utils';
import { ClientSharedServicesModule } from 'client-shared-services'
import { ClientSharedComponentsModule } from 'client-shared-components';

import {
  ClientUtilsModule,
} from 'client-utils';

import {
  ClientServicesModule,
} from 'client-services';

import { RuleActionsChangesTableV1 } from './rule-actions-changes-table-v1/rule-actions-changes-table-v1';
import { RuleActionsComboboxV1 } from './rule-actions-combobox-v1/rule-actions-combobox-v1';
import { RuleActionsTableV1 } from './rule-actions-table-v1/rule-actions-table-v1';

@NgModule({
  declarations: [
    RuleActionsChangesTableV1,
    RuleActionsComboboxV1,
    RuleActionsTableV1,
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
    //
    CarbonFrameworkModule,
  ],
  exports: [
    RuleActionsChangesTableV1,
    RuleActionsComboboxV1,
    RuleActionsTableV1,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class RuleActionsModule { }
