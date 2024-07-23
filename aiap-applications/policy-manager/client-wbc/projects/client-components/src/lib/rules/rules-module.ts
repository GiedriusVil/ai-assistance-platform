/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { LazyElementsModule } from '@angular-extensions/elements';

import { ClientSharedUtilsModule } from 'client-shared-utils';
import { ClientSharedServicesModule } from 'client-shared-services'
import { ClientSharedComponentsModule } from 'client-shared-components';

import { ClientUtilsModule } from 'client-utils';
import { ClientServicesModule } from 'client-services';

import { CarbonFrameworkModule } from '../carbon-framework-module';
import { RuleActionsModule } from '../rule-actions';
import { RuleMessagesModule } from '../rule-messages';

import { RuleClearModalV1 } from './rule-clear-modal-v1/rule-clear-modal-v1';
import { RuleDeleteModalV1 } from './rule-delete-modal-v1/rule-delete-modal-v1';
import { RuleEnableModalV1 } from './rule-enable-modal-v1/rule-enable-modal-v1';
import { RuleInstructionModalV1 } from './rule-instruction-modal-v1/rule-instruction-modal-v1';
import { RuleSaveModalV1 } from './rule-save-modal-v1/rule-save-modal-v1';
import { RulesChangesTableV1 } from './rules-changes-table-v1/rules-changes-table-v1';
import { RulesConditionsTableV1 } from './rules-conditions-table-v1/rules-conditions-table-v1';
import { RulesTableV1 } from './rules-table-v1/rules-table-v1';



@NgModule({
  declarations: [
    RuleClearModalV1,
    RuleDeleteModalV1,
    RuleEnableModalV1,
    RuleInstructionModalV1,
    RuleSaveModalV1,
    RulesChangesTableV1,
    RulesConditionsTableV1,
    RulesTableV1,
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
    RuleActionsModule,
    RuleMessagesModule,
  ],
  exports: [
    RuleClearModalV1,
    RuleDeleteModalV1,
    RuleEnableModalV1,
    RuleInstructionModalV1,
    RuleSaveModalV1,
    RulesChangesTableV1,
    RulesConditionsTableV1,
    RulesTableV1,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class RulesModule { }
